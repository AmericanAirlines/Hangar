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

  // TODO: change to 'simple-json' type
  @Column()
  value: string;

  // TODO: prevent this from erring on null values
  static async findToggleForKey(key: string): Promise<boolean> {
    const toggle = await this.findOne({ key });
    if (toggle) {
      toggle.value = toggle.value.toLowerCase();
      if (toggle.value !== 'false' && toggle.value !== 'true') {
        throw new Error('Config item found but cannot be cast to boolean');
      }
    }
    return toggle ? toggle.value === 'true' : false;
  }

  // TODO: create getValueAs method with all signature possibilities
}
