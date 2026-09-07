import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service.js';
import { Prisma, User } from '../generated/prisma/client.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {

    @Inject()
    private readonly prisma: PrismaService;

    async createUser(data: Prisma.UserCreateInput) {
        const hashedPassword = await bcrypt.hash(data.password, 10);

        return this.prisma.user.create({
            data: {
                ...data,
                password: hashedPassword,
            }
        });
    }

    async updateUser(params: {
        where: Prisma.UserWhereUniqueInput;
        data: Prisma.UserUpdateInput;
    }): Promise<User> {
        const { where, data } = params;
        return this.prisma.user.update({
            data,
            where,
        });
    }

    async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
        return this.prisma.user.delete({
            where,
        });
    }
    async user(
        userWhereUniqueInput: Prisma.UserWhereUniqueInput,
    ): Promise<User> {
        const user = await this.prisma.user.findUnique({
            where: userWhereUniqueInput,
        });
        if (!user) {
            throw new NotFoundException('Usuário não encontrado');
        }

        return user;
    }
}
