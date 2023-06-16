import { Column, Entity } from 'typeorm';
import { StringToNumericTransformer } from '../transformers/string-to-numeric.transformer';
import { CustomBaseEntity } from './custom-base.entity';

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
  puchaseDate: Date | null;
}
