import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { BaseDto } from '../core/base.dto';
import { Type } from 'class-transformer';
import { PurchaseDto } from '../purchase/purchase.dto';
import { ApiQueryPaginationBaseDTO } from '../pagination/api-query-pagination-base.dto';

export class SellDto extends BaseDto {
  @ApiProperty({ default: 'Wheat' })
  @IsNotEmpty({ message: 'Must be non empty' })
  @IsString({ message: 'Must be a string' })
  @MaxLength(65, { message: 'Maximum 65 characters supported' })
  name: string;

  @ApiProperty({ default: 50 })
  @IsNotEmpty()
  @IsNumber(
    { maxDecimalPlaces: 6 },
    { message: 'Should be a number with at most 6 decimal places' },
  )
  price: number;

  @ApiProperty({ default: 100 })
  @IsNotEmpty()
  @IsNumber(
    { maxDecimalPlaces: 6 },
    { message: 'Should be a number with at most 6 decimal places' },
  )
  amount: number;

  @ApiProperty({ default: new Date() })
  @IsNotEmpty()
  @IsDateString({ strict: true }, { message: 'Must be a valid date' })
  sellDate: Date | null;

  @Type(() => PurchaseDto)
  purchase: PurchaseDto;
}

export class SellSearchDto extends ApiQueryPaginationBaseDTO {
  @ApiProperty({
    default: 'Wheat',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  name: string;
}
