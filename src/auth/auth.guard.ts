import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import env from 'src/env';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    console.log('token found!');
    let payload;
    try {
      payload = await this.jwtService.verifyAsync(token, {
        secret: env.JWT_SECRET,
      });
    } catch (e) {
      throw new UnauthorizedException();
    }
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    const user = payload.sub;

    for (const role of roles) {
      if (!user.roles.includes(role)) {
        throw new ForbiddenException();
      }
    }

    request['user'] = user;

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
