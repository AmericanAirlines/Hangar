import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity()
export class Subscriber extends BaseEntity {
  constructor(slackId: string) {
    super();

    this.slackId = slackId;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  slackId: string;

  @Column({ default: true })
  isActive: boolean;
}
