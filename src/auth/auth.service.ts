import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service.js';
import { Prisma } from '../generated/prisma/client.js';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    @Inject()
    private readonly userService: UserService;

    @Inject()
    private readonly jwtService: JwtService;    

    async signin(params: Prisma.UserCreateInput): Promise<{access_token: string}> {
        const user = await this.userService.user({email: params.email});  
        if(!user) {
            throw new NotFoundException('User not found');
        }
        const passwordMatch = await bcrypt.compare(params.password, user.password);
        if(!passwordMatch) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = {sub: user.id}
        
        return { access_token: this.jwtService.sign(payload)};
    }
}
