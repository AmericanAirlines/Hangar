import { DateTime } from 'luxon';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, BeforeInsert, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import logger from '../logger';

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
  constructor(teamId: number, type: SupportRequestType) {
    super();

    this.team = teamId;
    this.type = type;
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
  team: number;

  @Column({ nullable: false, default: SupportRequestStatus.Pending, type: 'simple-enum' })
  status: SupportRequestStatus;

  @Column({ nullable: false, type: 'simple-enum' })
  type: SupportRequestType;

  @BeforeInsert()
  async checkForCurrentRequest(): Promise<void> {
    const abandonedRequests: SupportRequest[] = [];

    const existingActiveRequests = await SupportRequest.find({
      where: [{ team: this.team, status: SupportRequestStatus.Pending }, { team: this.team, status: SupportRequestStatus.InProgress }],
    });

    const minutesUntilStale = 15;

    for (let i = 0; i < existingActiveRequests.length; i += 1) {
      const { movedToInProgressAt, status } = existingActiveRequests[i];

      if (status === SupportRequestStatus.InProgress && DateTime.fromJSDate(movedToInProgressAt).diffNow('minutes').minutes >= minutesUntilStale) {
        abandonedRequests.push(existingActiveRequests[i]);
      }
    }

    if (existingActiveRequests.length && existingActiveRequests.length !== abandonedRequests.length) {
      const error = new Error('Active support request exists for team');
      error.name = SupportRequestErrors.ExistingActiveRequest;
      throw error;
    }

    const promises = [];
    for (let i = 0; i < abandonedRequests.length; i += 1) {
      promises.push((abandonedRequests[i].status = SupportRequestStatus.Abandoned));
    }

    Promise.all(promises).catch((err) => {
      logger.error('Something went wrong updating stale requests', err);
    });
  }

  static async getNextSupportRequest(): Promise<SupportRequest> {
    let retries = 5;

    do {
      const nextRequest = await SupportRequest.createQueryBuilder('supportRequests')
        .orderBy({
          createdAt: 'ASC',
        })
        .where({
          status: SupportRequestStatus.Pending,
        })
        .getOne();

      if (!nextRequest) {
        return null;
      }

      try {
        await SupportRequest.createQueryBuilder('supportRequests')
          .update()
          .where({
            id: nextRequest.id,
            status: nextRequest.status,
          })
          .set({
            status: SupportRequestStatus.InProgress,
            movedToInProgressAt: new Date(),
          })
          .execute();

        await nextRequest.reload();
        return nextRequest;
      } finally {
        retries -= 1;
      }
    } while (retries >= 0);
  }
}
