import {
    Controller,
    Post,
    Body,
    UseGuards,
    Request,
    Get,
    Put,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PrismaService } from '../../prisma/prisma.service';

@Controller('dofus')
export class DofusController {
    constructor(private prisma: PrismaService) { }

    @UseGuards(JwtAuthGuard)
    @Post('sync')
    async syncAllDofus(
        @Body() body: {
            dofusList: { dofusName: string; obtained: boolean; questAchieved: number }[];
        },
        @Request() req
    ) {
        const userId = req.user.userId;

        // 1. Supprimer les anciens Dofus de l'utilisateur
        await this.prisma.dofus.deleteMany({
            where: { userId },
        });

        // 2. Insérer les nouveaux
        const created = await this.prisma.dofus.createMany({
            data: body.dofusList.map((d) => ({
                userId,
                dofusName: d.dofusName,
                obtained: d.obtained,
                questAchieved: d.questAchieved,
            })),
        });

        return { message: 'Progression synchronisée', count: created.count };
    }


    @UseGuards(JwtAuthGuard)
    @Get('my')
    async getMyDofus(@Request() req) {
        const userId = req.user.userId;

        return this.prisma.dofus.findMany({
            where: { userId },
            orderBy: { dofusName: 'asc' },
        });
    }
}
