import { Column, Entity, Index, OneToOne } from 'typeorm';
import { CustomBaseEntity } from './custom-base.entity';
import { LedgerEntity } from './ledger.entity';
import { SellEntity } from './sell.entity';

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

  @OneToOne(() => SellEntity, (sellEntity) => sellEntity.customer)
  sell: SellEntity;

  @OneToOne(() => LedgerEntity, (ledgerEntity) => ledgerEntity.customer)
  ledger: LedgerEntity;
}
