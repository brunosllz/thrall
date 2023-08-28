import { env } from '@config/env';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AuthUser } from './auth-user';

type Payload = {
  uid: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: env.JWT_SECRET_KEY,
    });
  }

  async validate(payload: Payload): Promise<AuthUser> {
    return { userId: payload.uid };
  }
}
