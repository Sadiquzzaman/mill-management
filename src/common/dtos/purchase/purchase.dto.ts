import { RoleNameEnum } from '../../enums/role-name.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { BaseDto } from '../core/base.dto';
import { ApiQueryPaginationBaseDTO } from '../pagination/api-query-pagination-base.dto';

export class PurchaseDto extends BaseDto {
  @ApiProperty({ default: 'Wheat' })
  @IsNotEmpty({ message: 'Must be non empty' })
  @IsString({ message: 'Must be a string' })
  @MaxLength(65, { message: 'Maximum 65 characters supported' })
  name: string;

  @ApiProperty({default: 50})
  @IsNotEmpty()
  @IsNumber(
    { maxDecimalPlaces: 6 },
    { message: 'Should be a number with at most 6 decimal places' },
  )
  price: number;

  @ApiProperty({default: 100})
  @IsNotEmpty()
  @IsNumber(
    { maxDecimalPlaces: 6 },
    { message: 'Should be a number with at most 6 decimal places' },
  )
  amount: number;
  
  @ApiProperty({default: new Date()})
  @IsNotEmpty()
  @IsDateString({ strict: true }, { message: 'Must be a valid date' })
  puchaseDate: Date | null;
}

