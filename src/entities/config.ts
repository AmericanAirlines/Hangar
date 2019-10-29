import { Entity, PrimaryColumn, Column, BaseEntity } from 'typeorm';

@Entity('configuration')
export class Config extends BaseEntity {
  constructor(key: string, value: string) {
    super();

    this.key = key;
    this.value = value;
  }

  @PrimaryColumn()
  key: string;

  @Column()
  value: string;
}
