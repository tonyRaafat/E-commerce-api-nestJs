import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module, Scope } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SentryGlobalFilter, SentryModule } from '@sentry/nestjs/setup';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerInerceptor } from './interceptors/logger.interceptor';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { OrdersModule } from './orders/orders.module';
import { CopounsModule } from './copouns/copouns.module';
import config from './config/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true, load: [config] }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    SentryModule.forRoot(),
    UsersModule,
    AuthModule,
    ProductsModule,
    CategoriesModule,
    OrdersModule,
    CopounsModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: SentryGlobalFilter,
    },
    AppService,
    {
      provide: APP_INTERCEPTOR,
      scope: Scope.REQUEST,
      useClass: LoggerInerceptor,
    },
  ],
})
export class AppModule {}
