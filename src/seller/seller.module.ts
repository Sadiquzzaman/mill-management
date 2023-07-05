import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BcryptService } from 'src/common/services/bcrypt.service';
import { ConversionService } from '../common/services/conversion.service';
import { ExceptionService } from '../common/services/exception.service';
import { RequestService } from '../common/services/request.service';
import { ResponseService } from '../common/services/response.service';
import { SellerEntity } from 'src/common/entities/seller.entity';
import { SellerService } from './services/seller.service';
import { SellerController } from './controllers/seller.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SellerEntity])],
  controllers: [SellerController],
  providers: [
    ConversionService,
    BcryptService,
    ResponseService,
    ExceptionService,
    RequestService,
    SellerService,
  ],
})
export class SellerModule {}
