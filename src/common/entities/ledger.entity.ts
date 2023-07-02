import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { StringToNumericTransformer } from '../transformers/string-to-numeric.transformer';
import { CustomBaseEntity } from './custom-base.entity';
import { SellEntity } from './sell.entity';
import { ManufactureEntity } from './manufacture.entity';
import { CustomerEntity } from './customer.entity';

@Entity({ name: 'LedgerEntity' })
export class LedgerEntity extends CustomBaseEntity {
  @Column({
    type: 'decimal',
    name: 'previousLedger',
    precision: 20,
    scale: 6,
    default: () => "'0.000000'",
    transformer: new StringToNumericTransformer(),
  })
  previousLedger: number;

  @Column({
    type: 'decimal',
    name: 'depositAmount',
    precision: 20,
    scale: 6,
    default: () => "'0.000000'",
    transformer: new StringToNumericTransformer(),
  })
  depositAmount: number;

  @Column({
    type: 'decimal',
    name: 'remainingLedger',
    precision: 20,
    scale: 6,
    default: () => "'0.000000'",
    transformer: new StringToNumericTransformer(),
  })
  remainingLedger: number;

  @OneToOne(() => CustomerEntity, (customerEntity) => customerEntity.ledger)
  @JoinColumn({ name: 'customer_id' })
  customer: CustomerEntity;
}
