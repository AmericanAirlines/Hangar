import { Entity, PrimaryColumn, Column, BaseEntity } from 'typeorm';

type InnerPayload = string | number | boolean | { [k: string]: InnerPayload } | InnerPayload[] | undefined;
type Payload = { [k: string]: InnerPayload };

@Entity()
export class DiscordContext extends BaseEntity {
  constructor(id: string, currentCommand: string, nextStep: string) {
    super();

    this.id = id;
    this.currentCommand = currentCommand;
    this.nextStep = nextStep;
    this.payload = {};
  }

  @PrimaryColumn()
  id: string;

  @Column()
  currentCommand: string;

  @Column()
  nextStep: string;

  @Column({ type: 'simple-json' })
  payload: Payload;

  async clear(): Promise<void> {
    this.nextStep = '';
    this.currentCommand = '';
    this.payload = {};
    await this.save();
  }
}
