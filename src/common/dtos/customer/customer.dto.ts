import { RoleNameEnum } from '../../enums/role-name.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { BaseDto } from '../core/base.dto';
import { ApiQueryPaginationBaseDTO } from '../pagination/api-query-pagination-base.dto';
import { LedgerDto } from '../ledger/ledger.dto';

export class CustomerDto extends BaseDto {
  @ApiProperty({ default: 'Shovon' })
  @IsNotEmpty({ message: 'Must be non empty' })
  @IsString({ message: 'Must be a string' })
  @MaxLength(65, { message: 'Maximum 65 characters supported' })
  name: string;

  @ApiProperty({ default: '01734911481' })
  @IsOptional()
  @IsString({ message: 'Must be a string' })
  @MaxLength(20, { message: 'Maximum 20 character supported' })
  phone: string;

  @ApiProperty({ default: 'Bashundhara Group' })
  @IsOptional()
  @IsString({ message: 'Must be a string' })
  @MaxLength(20, { message: 'Maximum 100 character supported' })
  companyName: string;

  @Type(() => LedgerDto)
  ledger: LedgerDto;
}

export class CustomerSearchDto extends ApiQueryPaginationBaseDTO {
  @ApiProperty({
    default: 'Shovon',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({
    required: false,
    type: String,
    default: '01734911480',
  })
  @IsOptional()
  @IsString({ message: 'Must be a string' })
  phone: string;

  @ApiProperty({
    required: false,
    type: String,
    default: 'Bashundhara Group',
  })
  @IsOptional()
  @IsString({ message: 'Must be a string' })
  companyName: string;
}
