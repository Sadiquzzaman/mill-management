import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseEntity } from 'src/common/entities/purchase.entity';
import { BcryptService } from 'src/common/services/bcrypt.service';
import { ConversionService } from '../common/services/conversion.service';
import { ExceptionService } from '../common/services/exception.service';
import { RequestService } from '../common/services/request.service';
import { ResponseService } from '../common/services/response.service';
import { SellEntity } from 'src/common/entities/sell.entity';
import { PurchaseService } from 'src/purchase/services/purchase.service';
import { ManufactureService } from './services/manufacture.service';
import { ManufactureController } from './controllers/manufacture.controller';
import { ManufactureEntity } from 'src/common/entities/manufacture.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ManufactureEntity, PurchaseEntity])],
  controllers: [ManufactureController],
  providers: [
    ConversionService,
    BcryptService,
    ResponseService,
    ExceptionService,
    RequestService,
    ManufactureService,
    PurchaseService,
  ],
})
export class ManufactureModule {}
