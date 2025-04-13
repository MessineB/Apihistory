import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SearchHistoryService } from './riot/search-history.service';
import { ConfigModule } from '@nestjs/config';
import { RiotController } from './riot/riot.controller';
import { HttpModule } from '@nestjs/axios';
import { EsportRiotController } from './riot/EsportRiot.controller';


@Module({
  imports: [ HttpModule,
    ConfigModule.forRoot({
    envFilePath: '../env.riot', // Charge le .env.riot
    isGlobal: true,
  }),],
  controllers: [AppController,RiotController,EsportRiotController],
  providers: [AppService,SearchHistoryService],
})
export class AppModule {}
