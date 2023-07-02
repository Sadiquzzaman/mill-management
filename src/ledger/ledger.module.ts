import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity } from 'src/common/entities/customer.entity';
import { LedgerEntity } from 'src/common/entities/ledger.entity';
import { BcryptService } from 'src/common/services/bcrypt.service';
import { PurchaseService } from 'src/purchase/services/purchase.service';
import { ConversionService } from '../common/services/conversion.service';
import { ExceptionService } from '../common/services/exception.service';
import { RequestService } from '../common/services/request.service';
import { ResponseService } from '../common/services/response.service';
import { LedgerController } from './controllers/ledger.controller';
import { LedgerService } from './services/ledger.service';
import { CustomerService } from 'src/customer/services/customer.service';
import { PurchaseEntity } from 'src/common/entities/purchase.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([LedgerEntity, CustomerEntity, PurchaseEntity]),
  ],
  controllers: [LedgerController],
  providers: [
    ConversionService,
    BcryptService,
    ResponseService,
    ExceptionService,
    RequestService,
    LedgerService,
    PurchaseService,
    CustomerService,
  ],
})
export class LedgerModule {}
