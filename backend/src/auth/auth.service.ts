import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto } from '../dto/register.dto';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async register(dto: RegisterDto) {
    const { email, pseudo, password } = dto;

    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new ConflictException('Email déjà utilisé');
    }

    const hashed = await argon2.hash(password);
    console.log('Création de l’utilisateur', { email, pseudo });
    const user = await this.prisma.user.create({
      data: { email, pseudo, password: hashed },      
    });

    console.log('✅ Utilisateur créé dans la BDD :', user);
    return { message: 'Utilisateur créé avec succès', userId: user.id };
  }

async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }
  
}
