import {
  Controller,
  Get,
  Param,
  InternalServerErrorException,
  Logger,
  Post,
  Body,
  Request,
  UseGuards,
  ConflictException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PrismaService } from '../../prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Controller('riot')
export class RiotController {
  private readonly logger = new Logger(RiotController.name);
  constructor(

    private configService: ConfigService,
    private httpService: HttpService,
    private prisma: PrismaService
  ) { }

  @UseGuards(JwtAuthGuard)
  @Post('favorite')
  async addFavorite(
    @Body() body: { gameName: string; tagLine: string },
    @Request() req,
  ) {
    const { gameName, tagLine } = body;
    const userId = req.user.userId;
    const apiKey = this.configService.get<string>('RIOT_API_KEY');

    try {
      // 1. Obtenir le PUUID via le gameName + tagLine
      const accountRes = await firstValueFrom(this.httpService.get(
        `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`,
        { headers: { 'X-Riot-Token': apiKey } }
      ));
      const account = accountRes.data;

      // 2. Récupérer le level du joueur
      const summonerRes = await firstValueFrom(this.httpService.get(
        `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${account.puuid}`,
        { headers: { 'X-Riot-Token': apiKey } }
      ));
      const summoner = summonerRes.data;

      // 3. Vérifie si déjà présent
      const existing = await this.prisma.loLAccount.findFirst({
        where: {
          puuid: account.puuid,
          userId,
        },
      });

      if (existing) {
        throw new ConflictException('Ce joueur est déjà dans vos favoris');
      }

      // 4. Sauvegarde simple
      const saved = await this.prisma.loLAccount.create({
        data: {
          puuid: account.puuid,
          summonerName: account.gameName,
          tagLine: tagLine,
          level: summoner.summonerLevel,
          rank: 'Non défini',
          top5Champions: [],
          userId,
        },
      });

      return {
        message: 'Joueur ajouté aux favoris',
        id: saved.id,
      };

    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException('Impossible d’ajouter ce joueur');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('favorites')
  async getFavorites(@Request() req) {
    const userId = req.user.userId;

    return this.prisma.loLAccount.findMany({
      where: { userId },
      select: {
        id: true,
        summonerName: true,
        tagLine: true,
        level: true,
        rank: true,
      },
    });
  }
  @UseGuards(JwtAuthGuard)
  @Get('favorites/detailed')
  async getDetailedFavorites(@Request() req) {
    const userId = req.user.userId;
    const apiKey = this.configService.get<string>('RIOT_API_KEY');

    const favorites = await this.prisma.loLAccount.findMany({
      where: { userId },
      select: {
        id: true,
        puuid: true,
        summonerName: true,
        tagLine: true,
        level: true,
        rank: true,
      },
    });

    const enriched = await Promise.all(favorites.map(async (fav) => {
      try {
        const summonerRes = await firstValueFrom(this.httpService.get(
          `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${fav.puuid}`,
          { headers: { 'X-Riot-Token': apiKey } }
        ));
        return {
          ...fav,
          profileIconId: summonerRes.data.profileIconId,
        };
      } catch {
        return { ...fav, profileIconId: null }; // fallback
      }
    }));

    return enriched;
  }

  @Get('summoner/:gameName/:tagLine')
  async getSummonerInfo(
    @Param('gameName') gameName: string,
    @Param('tagLine') tagLine: string,
  ) {
    const apiKey = this.configService.get<string>('RIOT_API_KEY');
    if (!apiKey) {
      throw new InternalServerErrorException('RIOT_API_KEY manquante');
    }

    const accountUrl = `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`;
    const summonerUrl = `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid`;

    try {
      const accountRes = await firstValueFrom(
        this.httpService.get(accountUrl, {
          headers: { 'X-Riot-Token': apiKey },
        })
      );
      const account = accountRes.data;

      const summonerRes = await firstValueFrom(
        this.httpService.get(`${summonerUrl}/${account.puuid}`, {
          headers: { 'X-Riot-Token': apiKey },
        })
      );

      return {
        account,
        summoner: summonerRes.data,
      };
    } catch (error) {
      this.logger.error(`Erreur getSummonerInfo: ${error.message}`);
      throw new InternalServerErrorException('Erreur récupération invocateur');
    }
  }
  // 1. Récupère les 5 champions les plus joués
  @Get('mastery/:puuid')
  async getMasteries(@Param('puuid') puuid: string) {
    const apiKey = this.configService.get<string>('RIOT_API_KEY');
    if (!apiKey) {
      throw new InternalServerErrorException('RIOT_API_KEY is missing');
    }

    const url = `https://euw1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}`;
    this.logger.log(`Fetching champion masteries from: ${url}`);

    try {
      const response = await firstValueFrom(
        this.httpService.get(url, {
          headers: { 'X-Riot-Token': apiKey },
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
  // 2. Récupère les 3 derniers matchIds d’un joueur
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
        }),
      );
      this.logger.log(`Match IDs retrieved`);
      return response.data;
    } catch (error) {
      this.logger.error(`Erreur Riot Match ID API: ${error.response?.status}`);
      throw new InternalServerErrorException('Erreur lors de la récupération des match IDs');
    }
  }
  // 3. Récupère les infos détaillées d’un match
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
        }),
      );
      this.logger.log(`Match detail received`);
      return response.data;
    } catch (error) {
      this.logger.error(`Erreur Riot Match API: ${error.response?.status}`);
      throw new InternalServerErrorException('Erreur lors de la récupération du match');
    }
  }

}
