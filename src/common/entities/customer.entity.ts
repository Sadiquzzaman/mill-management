import { Column, Entity, Index } from 'typeorm';
import { CustomBaseEntity } from './custom-base.entity';

@Entity({ name: 'CustomerEntity' })
export class CustomerEntity extends CustomBaseEntity {
  @Column({ type: 'varchar', name: 'name', length: 65 })
  name: string;

  @Column({ type: 'varchar', name: 'phone', length: 20, nullable: true })
  @Index({ unique: true })
  phone: string;

  @Column({ type: 'varchar', name: 'companyName', length: 100, nullable: true })
  @Index({ unique: true })
  companyName: string;
}
