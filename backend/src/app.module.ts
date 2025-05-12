import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SearchHistoryService } from './riot/search-history.service';
import { ConfigModule } from '@nestjs/config';
import { RiotController } from './riot/riot.controller';
import { DofusController } from './dofus/dofus.controller';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from './auth/auth.modules';


@Module({
  imports: [ HttpModule,
    ConfigModule.forRoot({
    envFilePath: '../env.riot', // Charge le .env.riot
    isGlobal: true,
  }),
  AuthModule],
  controllers: [AppController,RiotController,DofusController],
  providers: [AppService,SearchHistoryService],
})
export class AppModule {}
