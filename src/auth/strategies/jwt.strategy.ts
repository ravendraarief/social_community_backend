import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // ❌ tidak boleh pakai this di sini
      secretOrKey: configService.get<string>('JWT_SECRET'), // ✅ cukup pakai parameter
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email };
  }
}
