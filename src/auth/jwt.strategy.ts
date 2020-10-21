import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayloadInterface } from './jwt-payload.interface';
import { User } from './entities/user.entitiy';
import { Repository } from 'typeorm/index';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'topSecret51',
    });
  }

  async validate(payload: JwtPayloadInterface): Promise<User> {
    const { id } = payload;
    console.log(id, 'id');
    const user = await this.userRepository.findOne({
      where: { id },
    });
    console.log(user);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
