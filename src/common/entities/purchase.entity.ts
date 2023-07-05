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
import { TransactionType } from '../enums/transactionType.enum';
import { SellerEntity } from './seller.entity';

@Entity({ name: 'PurchaseEntity' })
export class PurchaseEntity extends CustomBaseEntity {
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
    name: 'purchase_date',
    nullable: true,
  })
  purchaseDate: Date | null;

  @Column({
    type: 'enum',
    enum: TransactionType,
    name: 'transactionType',
    default: `${TransactionType.Cash}`,
  })
  transactionType: TransactionType;

  @OneToOne(() => SellerEntity, (sellerEntity) => sellerEntity.purchase)
  @JoinColumn({ name: 'seller_id' })
  customer: SellerEntity;

  @OneToMany(() => SellEntity, (sellEntity) => sellEntity.purchase)
  @JoinColumn({ name: 'purchase_id' })
  sells: SellEntity[];

  @OneToMany(
    () => ManufactureEntity,
    (manufactureEntity) => manufactureEntity.purchase,
  )
  @JoinColumn({ name: 'purchase_id' })
  manufactures: ManufactureEntity[];
}
