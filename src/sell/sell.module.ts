import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseEntity } from 'src/common/entities/purchase.entity';
import { BcryptService } from 'src/common/services/bcrypt.service';
import { ConversionService } from '../common/services/conversion.service';
import { ExceptionService } from '../common/services/exception.service';
import { RequestService } from '../common/services/request.service';
import { ResponseService } from '../common/services/response.service';
import { SellController } from './controllers/sell.controller';
import { SellService } from './services/sell.service';
import { SellEntity } from 'src/common/entities/sell.entity';
import { PurchaseService } from 'src/purchase/services/purchase.service';

@Module({
  imports: [TypeOrmModule.forFeature([SellEntity, PurchaseEntity])],
  controllers: [SellController],
  providers: [
    ConversionService,
    BcryptService,
    ResponseService,
    ExceptionService,
    RequestService,
    SellService,
    PurchaseService,
  ],
})
export class SellModule {}
