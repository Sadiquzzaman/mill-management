import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { LedgerDto } from '../ledger.dto';

export class CreateLedgerDto extends LedgerDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'User ID must be defined' })
  @IsUUID('all', { message: 'Must be a valid user ID' })
  customerId: string;
}
