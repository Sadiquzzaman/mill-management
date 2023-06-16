import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseEntity } from 'src/common/entities/purchase.entity';
import { BcryptService } from 'src/common/services/bcrypt.service';
import { ConversionService } from '../common/services/conversion.service';
import { ExceptionService } from '../common/services/exception.service';
import { RequestService } from '../common/services/request.service';
import { ResponseService } from '../common/services/response.service';
import { PurchaseController } from './controllers/purchase.controller';
import { PurchaseService } from './services/purchase.service';

@Module({
  imports: [TypeOrmModule.forFeature([PurchaseEntity])],
  controllers: [PurchaseController],
  providers: [
    ConversionService,
    BcryptService,
    ResponseService,
    ExceptionService,
    RequestService,
    PurchaseService,
  ],
})
export class PurchaseModule {}
