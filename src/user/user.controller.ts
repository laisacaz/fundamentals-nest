import { Body, Controller, Delete, Get, Inject, Param, Post, Put } from '@nestjs/common';
import { UserModel } from '../generated/prisma/models/User.js';
import { UserService } from './user.service.js';
import { Prisma } from '../generated/prisma/client.js';


@Controller('user')
export class UserController {
    @Inject()
    private readonly userService: UserService;

    @Post('')
    async signupUser(
        @Body() userData: Prisma.UserCreateInput,
    ): Promise<UserModel> {
        return this.userService.createUser(userData);
    }

    @Put(':id')
    async updateUser(
        @Body() userData: Prisma.UserUpdateInput,
        @Param('id') id: string,
    ): Promise<UserModel> {
        return this.userService.updateUser({
            where: { id },
            data: userData
        });
    }

    @Delete(':id')
    async deleteUser(@Param('id') id: string): Promise<UserModel> {
        return this.userService.deleteUser({ id });
    }

    @Get(':id')
    async getUser(
        @Param('id') id: string,
    ): Promise<UserModel> {
        return this.userService.user({ id });
    }
}
