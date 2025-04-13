import {
  Controller,
  Get,
  Param,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { SearchHistoryService } from './search-history.service';

//Fonction sleep a utiliser pour pas depasser les limite de 20 requetes par seconde
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}


@Controller('riot')
export class RiotController {
  private readonly logger = new Logger(RiotController.name);

  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
    private historyService: SearchHistoryService,
  ) { }

  //Avec un nom d'un utilisateur on recupere son PUUID et des infos sur l'utilisateur qui sera nécessaire pour le reste des routes
  @Get('summoner/:gameName/:tagLine')
  async getSummonerInfo(
    @Param('gameName') gameName: string,
    @Param('tagLine') tagLine: string
  ) {
    const apiKey = this.configService.get<string>('RIOT_API_KEY');
    if (!apiKey) {
      throw new InternalServerErrorException('RIOT_API_KEY is missing');
    }

    const accountUrl = `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`;
    this.logger.log(`Fetching account info from: ${accountUrl}`);
    this.historyService.addToHistory(gameName, tagLine);


    try {
      const accountRes = await firstValueFrom(
        this.httpService.get(accountUrl, {
          headers: { 'X-Riot-Token': apiKey },
        })
      );

      const { puuid } = accountRes.data;
      this.logger.log(`PUUID retrieved: ${puuid}`);

      const summonerUrl = `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`;
      const summonerRes = await firstValueFrom(
        this.httpService.get(summonerUrl, {
          headers: { 'X-Riot-Token': apiKey },
        })
      );

      return {
        account: accountRes.data,
        summoner: summonerRes.data,
      };
    } catch (error) {
      this.logger.error(`Erreur Riot API: ${error.response?.status}`);
      throw new InternalServerErrorException('Erreur lors de la récupération des données Riot');
    }
  }

  //On recupere les 5 personnages les plus joué d'un utilisateur
  @Get('mastery/:puuid')
  async getMasteries(@Param('puuid') puuid: string) {
    const apiKey = this.configService.get<string>('RIOT_API_KEY');

    if (!apiKey) {
      throw new InternalServerErrorException('RIOT_API_KEY is missing');
    }

    const region = 'euw1'; // temporairement fixe pour EUW
    const url = `https://${region}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}`;

    this.logger.log(`Fetching champion masteries from: ${url}`);

    try {
      const response = await firstValueFrom(
        this.httpService.get(url, {
          headers: {
            'X-Riot-Token': apiKey,
          },
        }),
      );
      this.logger.log(`Masteries API status: ${response.status}`);
      return response.data;
    } catch (error) {
      const errMsg = error.response?.data?.status?.message || error.message;
      this.logger.error(`Erreur Riot Mastery API: ${error.response?.status} - ${errMsg}`);
      throw new InternalServerErrorException('Erreur récupération des maîtrises');
    }
  }

  //On recupere les 3 derniers matchId d'un joueur
  @Get('matches/:puuid')
  async getMatchIds(@Param('puuid') puuid: string) {
    const apiKey = this.configService.get<string>('RIOT_API_KEY');
    if (!apiKey) {
      throw new InternalServerErrorException('RIOT_API_KEY is missing');
    }

    const url = `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=3`;
    this.logger.log(`Fetching match IDs from: ${url}`);

    try {
      const response = await firstValueFrom(
        this.httpService.get(url, {
          headers: { 'X-Riot-Token': apiKey },
        })
      );
      this.logger.log(`Match IDs retrieved`);
      return response.data;
    } catch (error) {
      this.logger.error(`Erreur Riot Match ID API: ${error.response?.status}`);
      throw new InternalServerErrorException('Erreur lors de la récupération des match IDs');
    }
  }

  //On recupere des infos pour un match particulier via son matchId
  @Get('match/:matchId')
  async getMatchDetail(@Param('matchId') matchId: string) {
    const apiKey = this.configService.get<string>('RIOT_API_KEY');
    if (!apiKey) {
      throw new InternalServerErrorException('RIOT_API_KEY is missing');
    }

    const url = `https://europe.api.riotgames.com/lol/match/v5/matches/${matchId}`;
    this.logger.log(`Fetching match detail from: ${url}`);

    try {
      const response = await firstValueFrom(
        this.httpService.get(url, {
          headers: { 'X-Riot-Token': apiKey },
        })
      );
      this.logger.log(`Match detail received`);
      return response.data;
    } catch (error) {
      this.logger.error(`Erreur Riot Match API: ${error.response?.status}`);
      throw new InternalServerErrorException('Erreur lors de la récupération du match');
    }
  }

}
