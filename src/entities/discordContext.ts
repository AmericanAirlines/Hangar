import { Entity, PrimaryColumn, Column, BaseEntity } from 'typeorm';

@Entity()
export class DiscordContext extends BaseEntity {
  constructor(id: string, nextStep: string) {
    super();

    this.id = id;
    this.nextStep = nextStep;
  }

  @PrimaryColumn()
  id: string;

  @Column()
  nextStep: string;
}
