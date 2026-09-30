import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service.js';
import { Prisma, User } from '../generated/prisma/client.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

    @Inject()
    private readonly userService: UserService;    

    async signin(params: Prisma.UserCreateInput): Promise<Omit<User, 'password'>> {
        const user = await this.userService.user({email: params.email});  
        if(!user) {
            throw new NotFoundException('User not found');
        }
        const passwordMatch = await bcrypt.compare(params.password, user.password);
        if(!passwordMatch) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const { password, ...result } = user;
        return result;
    }
}
