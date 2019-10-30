import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity()
export class Team extends BaseEntity {
  constructor(name: string, location: string, description: string) {
    super();

    this.name = name;
    this.location = location;
    this.description = description;
    this.members = [];
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  location: string;

  @Column()
  description: string;

  @Column('text', { array: true })
  members: string[];
}
