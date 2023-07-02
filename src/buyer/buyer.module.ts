import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuyerEntity } from 'src/common/entities/buyer.entity';
import { BcryptService } from 'src/common/services/bcrypt.service';
import { ConversionService } from '../common/services/conversion.service';
import { ExceptionService } from '../common/services/exception.service';
import { RequestService } from '../common/services/request.service';
import { ResponseService } from '../common/services/response.service';
import { BuyerController } from './controllers/buyer.controller';
import { BuyerService } from './services/buyer.service';

@Module({
  imports: [TypeOrmModule.forFeature([BuyerEntity])],
  controllers: [BuyerController],
  providers: [
    ConversionService,
    BcryptService,
    ResponseService,
    ExceptionService,
    RequestService,
    BuyerService,
  ],
})
export class BuyerModule {}
