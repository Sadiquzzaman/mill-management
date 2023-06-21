import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { StringToNumericTransformer } from '../transformers/string-to-numeric.transformer';
import { CustomBaseEntity } from './custom-base.entity';
import { PurchaseEntity } from './purchase.entity';

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

  @ManyToOne(() => PurchaseEntity, (purchaseEntity) => purchaseEntity.sells)
  @JoinColumn({ name: 'purchase_id' })
  purchase: PurchaseEntity;
}
