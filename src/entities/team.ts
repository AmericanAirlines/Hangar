import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

// TODO: Enforce only one team registered per person
@Entity()
export class Team extends BaseEntity {
  constructor(name: string, tableNumber: number, projectDescription: string, members?: string[]) {
    super();

    this.name = name;
    this.tableNumber = tableNumber;
    this.projectDescription = projectDescription;
    this.members = members || [];
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  tableNumber: number;

  @Column()
  projectDescription: string;

  @Column('text', { array: true })
  members: string[];
}
