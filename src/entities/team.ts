import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

// TODO: Enforce only one team registered per person
// TODO: Enforce uniqueness of table number
@Entity()
export class Team extends BaseEntity {
  constructor(name: string, tableNumber: string, projectDescription: string, members?: string[]) {
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
  tableNumber: string;

  @Column()
  projectDescription: string;

  @Column('text', { array: true })
  members: string[];
}
