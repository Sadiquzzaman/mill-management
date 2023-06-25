import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { StringToNumericTransformer } from '../transformers/string-to-numeric.transformer';
import { CustomBaseEntity } from './custom-base.entity';
import { PurchaseEntity } from './purchase.entity';

@Entity({ name: 'ManufactureEntity' })
export class ManufactureEntity extends CustomBaseEntity {
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

  // @Column({
  //   type: 'decimal',
  //   name: 'price',
  //   precision: 20,
  //   scale: 6,
  //   default: () => "'0.000000'",
  //   transformer: new StringToNumericTransformer(),
  // })
  // price: number;

  @Column({
    type: 'timestamp',
    name: 'manufacture_date',
    nullable: true,
  })
  manufactureDate: Date | null;

  @ManyToOne(
    () => PurchaseEntity,
    (purchaseEntity) => purchaseEntity.manufactures,
  )
  @JoinColumn({ name: 'purchase_id' })
  purchase: PurchaseEntity;
}
