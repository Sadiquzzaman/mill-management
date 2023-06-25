import { RoleNameEnum } from '../enums/role-name.enum';
import { Column, Entity, Index } from 'typeorm';
import { CustomBaseEntity } from './custom-base.entity';
import { Exclude } from 'class-transformer';
import { StringToNumericTransformer } from '../transformers/string-to-numeric.transformer';

@Entity({ name: 'StockEntity' })
export class StockEntity extends CustomBaseEntity {
  @Column({ type: 'varchar', name: 'name', length: 65 })
  name: string;

  @Column({
    type: 'decimal',
    name: 'inStock',
    precision: 20,
    scale: 6,
    default: () => "'0.000000'",
    transformer: new StringToNumericTransformer(),
  })
  inStock: number;

  @Column({
    type: 'decimal',
    name: 'sold',
    precision: 20,
    scale: 6,
    default: () => "'0.000000'",
    transformer: new StringToNumericTransformer(),
  })
  sold: number;

  @Column({
    type: 'decimal',
    name: 'remaining',
    precision: 20,
    scale: 6,
    default: () => "'0.000000'",
    transformer: new StringToNumericTransformer(),
  })
  remaining: number;
}
