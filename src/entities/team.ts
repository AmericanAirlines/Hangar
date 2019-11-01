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
    this.judgeVisits = 0;
    this.activeJudgeCount = 0;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  tableNumber: number;

  @Column()
  projectDescription: string;

  @Column('simple-array')
  members: string[];

  // TODO: Make the below two attributes private once this issue is closed: https://github.com/typeorm/typeorm/issues/3548
  @Column()
  judgeVisits: number;

  @Column()
  activeJudgeCount: number;

  async decrementActiveJudgeCount() {
    await Team.createQueryBuilder()
      .update()
      .set({ activeJudgeCount: () => 'activeJudgeCount - 1' })
      .where('id = :id AND activeJudgeCount > 0', { id: this.id })
      .execute();
  }

  async incrementActiveJudgeCount() {
    await Team.createQueryBuilder()
      .update()
      .set({ activeJudgeCount: () => 'activeJudgeCount + 1' })
      .where('id = :id', { id: this.id })
      .execute();
  }

  async incrementJudgeVisits() {
    await Team.createQueryBuilder()
      .update()
      .set({ judgeVisits: () => 'judgeVisits + 1' })
      .where('id = :id', { id: this.id })
      .execute();
  }
}
