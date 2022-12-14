import { RoleNameEnum } from './../../enums/role-name.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
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

export class UserDto extends BaseDto {
  @ApiProperty({ default: 'Shovon' })
  @IsNotEmpty({ message: 'Must be non empty' })
  @IsString({ message: 'Must be a string' })
  @MaxLength(65, { message: 'Maximum 65 characters supported' })
  name: string;

  @ApiProperty({ default: 'bh123@gmail.com' })
  @IsNotEmpty({ message: 'Must be non empty' })
  @IsEmail()
  @MaxLength(100, { message: 'Maximum 100 characters supported' })
  email: string;

  @ApiProperty({ default: '01734911481' })
  @IsOptional()
  @IsString({ message: 'Must be a string' })
  @MaxLength(20, { message: 'Maximum 20 character supported' })
  phone: string;

  @ApiProperty({ default: '12345678' })
  @Exclude({ toPlainOnly: true })
  @IsNotEmpty({ message: 'Must be non empty' })
  @IsString({ message: 'Must be a string' })
  @MaxLength(100, { message: 'Maximum 100 characters supported' })
  password: string;

  @ApiProperty({ default: RoleNameEnum.EDITOR_ROLE })
  @IsOptional()
  @IsString({ message: 'Must be a string!' })
  @IsEnum(RoleNameEnum)
  roleName: RoleNameEnum;
}

export class UserSearchDto extends ApiQueryPaginationBaseDTO {
  @ApiProperty({
    default: 'Shovon',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({
    default: 'bh123@gmail.com',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsEmail()
  email: string;

  @ApiProperty({
    required: false,
    type: String,
    default: '01734911480',
  })
  @IsOptional()
  @IsString({ message: 'Must be a string' })
  phone: string;

  @ApiProperty({
    default: 'Team Lead',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  address: string;

  @ApiProperty({
    required: false,
    default: RoleNameEnum.EDITOR_ROLE,
    enum: RoleNameEnum,
  })
  @IsOptional()
  @IsString({
    message: `Must be one of those ${Object.entries(RoleNameEnum).join('/')}`,
  })
  @IsEnum(RoleNameEnum)
  roleName: RoleNameEnum;
}
