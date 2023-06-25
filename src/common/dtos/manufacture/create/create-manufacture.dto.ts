import { ApiProperty } from '@nestjs/swagger';
import { ManufactureDto } from '../manufacture.dto';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateManuafactureDto extends ManufactureDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'User ID must be defined' })
  @IsUUID('all', { message: 'Must be a valid user ID' })
  purchaseId: string;
}
