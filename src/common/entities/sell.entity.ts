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
import { PurchaseEntity } from './purchase.entity';
import { TransactionType } from '../enums/transactionType.enum';
import { CustomerEntity } from './customer.entity';

@Entity({ name: 'SellEntity' })
export class SellEntity extends CustomBaseEntity {
  @Column({ type: 'varchar', name: 'name', length: 65 })
  name: string;

  @Column({
    type: 'decimal',
    name: 'amount',
    precision: 20,
    scale: 6,
    default: () => "'0.000000'",
    transformer: new StringToNumericTransformer(),
  })
  amount: number;

  @Column({
    type: 'decimal',
    name: 'price',
    precision: 20,
    scale: 6,
    default: () => "'0.000000'",
    transformer: new StringToNumericTransformer(),
  })
  price: number;

  @Column({
    type: 'timestamp',
    name: 'sell_date',
    nullable: true,
  })
  sellDate: Date | null;

  @Column({
    type: 'enum',
    enum: TransactionType,
    name: 'transactionType',
    default: `${TransactionType.Cash}`,
  })
  transactionType: TransactionType;

  @OneToOne(() => CustomerEntity, (customerEntity) => customerEntity.sell)
  @JoinColumn({ name: 'customer_id' })
  customer: CustomerEntity;

  @ManyToOne(() => PurchaseEntity, (purchaseEntity) => purchaseEntity.sells)
  @JoinColumn({ name: 'purchase_id' })
  purchase: PurchaseEntity;
}

/*

************ Daily Statement ********************* 
  customername
  productname
  amount/quantity
  price - total sell price (debt/cash)

  Same goes for purchase(daily statement excel sheet download)
-----------------------------------------------------------------------------------------------

************wheat type ****************
Russian, Indian, Australian, Ukrain, Brazil, Deshi

*****************Stock**********************

*/
