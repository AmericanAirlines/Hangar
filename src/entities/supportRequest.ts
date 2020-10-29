import { DateTime } from 'luxon';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, BeforeInsert, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import logger from '../logger';
import { genHash } from '../utilities/genHash';

export enum SupportRequestStatus {
  Pending = 'Pending',
  InProgress = 'InProgress',
  Complete = 'Complete',
  Abandoned = 'Abandoned',
}

export enum SupportRequestType {
  IdeaPitch = 'IdeaPitch',
  TechnicalSupport = 'TechnicalSupport',
}

export enum SupportRequestErrors {
  ExistingActiveRequest = 'ExistingActiveRequest',
}

@Entity()
export class SupportRequest extends BaseEntity {
  constructor(slackIdId: string, name: string, type: SupportRequestType) {
    super();

    this.slackId = slackIdId;
    this.name = name;
    this.type = type;
    this.syncHash = genHash();
  }

  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  movedToInProgressAt: Date;

  @Column({ nullable: false })
  slackId: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false, default: SupportRequestStatus.Pending, type: 'simple-enum', enum: SupportRequestStatus })
  status: SupportRequestStatus;

  @Column({ nullable: false, type: 'simple-enum', enum: SupportRequestType })
  type: SupportRequestType;

  /**
   * This is used for running concurrent operations
   */
  @Column()
  syncHash: string;

  @BeforeInsert()
  async validateNoActiveRequests(): Promise<void> {
    const abandonedRequests: SupportRequest[] = [];

    const existingActiveRequests = await SupportRequest.find({
      where: [
        { slackId: this.slackId, status: SupportRequestStatus.Pending },
        { slackId: this.slackId, status: SupportRequestStatus.InProgress },
      ],
    });

    const minutesUntilStale = 15;

    for (let i = 0; i < existingActiveRequests.length; i += 1) {
      const { movedToInProgressAt, status } = existingActiveRequests[i];
      const minutesInProgress = Math.abs(DateTime.fromJSDate(movedToInProgressAt || new Date()).diffNow('minutes').minutes);
      if (status === SupportRequestStatus.InProgress && minutesInProgress >= minutesUntilStale) {
        abandonedRequests.push(existingActiveRequests[i]);
      }
    }

    if (existingActiveRequests.length && existingActiveRequests.length !== abandonedRequests.length) {
      const error = new Error('Active support request exists for slackId');
      error.name = SupportRequestErrors.ExistingActiveRequest;
      throw error;
    }

    for (let i = 0; i < abandonedRequests.length; i += 1) {
      try {
        abandonedRequests[i].status = SupportRequestStatus.Abandoned;
        await abandonedRequests[i].save();
      } catch (err) {
        // Ignore coverage for this line
        /* istanbul ignore next */
        logger.error('Something went wrong updating stale requests', err);
      }
    }
  }

  static async getNextSupportRequest(supportType?: SupportRequestType): Promise<SupportRequest> {
    let retries = 5;

    do {
      let nextRequest;
      if (supportType) {
        nextRequest = await SupportRequest.createQueryBuilder('supportRequests')
          .orderBy('"supportRequests"."createdAt"', 'ASC')
          .where({
            status: SupportRequestStatus.Pending,
            type: supportType,
          })
          .getOne();
      } else {
        nextRequest = await SupportRequest.createQueryBuilder('supportRequests')
          .orderBy('"supportRequests"."createdAt"', 'ASC')
          .where({
            status: SupportRequestStatus.Pending,
          })
          .getOne();
      }

      if (!nextRequest) {
        return null;
      }

      try {
        const newHash = genHash();
        const result = await SupportRequest.createQueryBuilder('supportRequests')
          .update()
          .where({
            id: nextRequest.id,
            status: nextRequest.status,
          })
          .set({
            status: SupportRequestStatus.InProgress,
            movedToInProgressAt: new Date(),
            syncHash: newHash,
          })
          .execute();

        await nextRequest.reload();

        if (result.affected > 0 || nextRequest.syncHash === newHash) {
          return nextRequest;
        }
      } finally {
        retries -= 1;
      }
    } while (retries >= 0);

    /* istanbul ignore next */
    throw new Error('Unable to obtain a lock on a record');
  }
}
