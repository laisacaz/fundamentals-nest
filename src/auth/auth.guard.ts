import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';



@Injectable()

export class AuthGuard implements CanActivate {

  @Inject()
  private readonly jwtService: JwtService; 

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorization = this.extractTokenFromHeader(request);
    if(!authorization) {
      throw new UnauthorizedException('Authorization header not found');
    }
    
    try{
      const payload = await this.jwtService.verifyAsync(authorization, {
        secret: process.env.SECRET_KEY,
      });
      request.userId = payload;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
    return true;
  }

private extractTokenFromHeader(request: any): string | undefined {
  const [type, token] = request.headers.authorization?.split(' ') ?? [];
  return type === 'Bearer' ? token : undefined;
}
}
   