import { EnvService } from '@common/infra/config/env/env.service';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AuthUser } from './auth-user';

type Payload = {
  uid: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: EnvService) {
    const JWTSecretKey = config.get('JWT_SECRET_KEY');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWTSecretKey,
      algorithms: ['HS256'],
    });
  }

  async validate(payload: Payload): Promise<AuthUser> {
    return { userId: payload.uid };
  }
}
