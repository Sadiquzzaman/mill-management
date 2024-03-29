import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigureEnum } from './common/enums/configure.enum';
import { FieldExceptionFilter } from './common/filters/field-exception.filter';
import { SystemExceptionFilter } from './common/filters/system-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { AuthMiddleware } from './common/middleware/auth.middleware';
import { UserModule } from './user/user.module';
import { PurchaseModule } from './purchase/purchase.module';
import { SellModule } from './sell/sell.module';
import { ManufactureModule } from './manufacture/manufacture.module';
import { CustomerModule } from './customer/customer.module';
import { LedgerModule } from './ledger/ledger.module';
import { SellerModule } from './seller/seller.module';

const ENV = process.env['NODE_ENV'];
const envFilePath = [`env/${!ENV ? `.env` : `.env.${ENV}`}`];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get(ConfigureEnum.DATABASE_HOST),
        port: +configService.get(ConfigureEnum.DATABASE_PORT),
        username: configService.get(ConfigureEnum.DATABASE_USER),
        password: configService.get(ConfigureEnum.DATABASE_PASSWORD),
        database: configService.get(ConfigureEnum.DATABASE_DB),
        entities: [__dirname + '/**/common/entities/*.entity{.ts,.js}'],
        synchronize: configService.get(ConfigureEnum.DATABASE_SYNCRONIZE),
        logging: !!configService.get(ConfigureEnum.DATABASE_LOGGING),
        logger: 'file',
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    PurchaseModule,
    SellModule,
    ManufactureModule,
    CustomerModule,
    LedgerModule,
    SellerModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: SystemExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: FieldExceptionFilter,
    },
  ],
})
export class AppModule {
  constructor() {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
    consumer
      .apply(AuthMiddleware)
      // .exclude(...publicUrls)
      .forRoutes('*');
  }
}
