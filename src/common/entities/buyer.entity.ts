import { Column, Entity, Index } from 'typeorm';
import { CustomBaseEntity } from './custom-base.entity';

@Entity({ name: 'BuyerEntity' })
export class BuyerEntity extends CustomBaseEntity {
  @Column({ type: 'varchar', name: 'name', length: 65 })
  name: string;

  @Column({ type: 'varchar', name: 'phone', length: 20, nullable: true })
  @Index({ unique: true })
  phone: string;

  @Column({ type: 'varchar', name: 'companyName', length: 100, nullable: true })
  @Index({ unique: true })
  companyName: string;
}
