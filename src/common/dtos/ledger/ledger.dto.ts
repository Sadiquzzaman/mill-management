import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { BaseDto } from '../core/base.dto';
import { ApiQueryPaginationBaseDTO } from '../pagination/api-query-pagination-base.dto';
import { PurchaseDto } from '../purchase/purchase.dto';

export class LedgerDto extends BaseDto {
  @ApiProperty({ default: 50 })
  @IsNotEmpty()
  @IsNumber(
    { maxDecimalPlaces: 6 },
    { message: 'Should be a number with at most 6 decimal places' },
  )
  previousLedger: number;

  @ApiProperty({ default: 100 })
  @IsNotEmpty()
  @IsNumber(
    { maxDecimalPlaces: 6 },
    { message: 'Should be a number with at most 6 decimal places' },
  )
  depositAmount: number;

  @Type(() => PurchaseDto)
  purchase: PurchaseDto;
}

export class LedgerSearchDto extends ApiQueryPaginationBaseDTO {
  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  customerId: string;
}
