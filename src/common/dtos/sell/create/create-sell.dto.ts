import { ApiProperty } from '@nestjs/swagger';
import { SellDto } from '../sell.dto';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateSellDto extends SellDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'User ID must be defined' })
  @IsUUID('all', { message: 'Must be a valid user ID' })
  purchaseId: string;
}
