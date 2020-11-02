import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entitiy';
import { JwtStrategy } from './jwt.strategy';
import { Sns } from './entities/sns.entity';
import { Detail } from './entities/detail.entity';
import { LocalStrategy } from './local.strategy';
import { SessionSerializer } from './session.serializer';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Sns, Detail]),
    PassportModule.register({
      // defaultStrategy: 'jwt',
      session: true,
      access_type: 'offline',
      approval_prompt: 'force',
    }),
    JwtModule.register({
      secret: 'topSecret51',
      signOptions: {
        // expiresIn: 3600,
      },
    }),
  ],
  providers: [AuthService, AuthResolver, JwtStrategy, LocalStrategy, SessionSerializer],
  exports: [JwtStrategy, PassportModule, AuthService],
})
export class AuthModule {
}
