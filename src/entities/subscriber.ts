import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity()
export class Subscriber extends BaseEntity {
  constructor(slackId: string) {
    super();

    this.slackId = slackId;
  }

  @PrimaryGeneratedColumn()
  id: number | undefined;

  @Column({ unique: true })
  slackId: string;

  @Column({ default: true })
  isActive: boolean | undefined;
}
