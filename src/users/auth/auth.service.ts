import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from './entities/user.entitiy';
import { Repository } from 'typeorm/index';
import { GoogleRegisterInput, RegisterInput } from './dtos/register.dto';
import { GoogleLoginInput, LoginInput } from './dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayloadInterface } from './jwt-payload.interface';
import { MailerService } from '@nestjs-modules/mailer';
import { ForgotPasswordInput } from './dtos/forgot-password.dto';
import { ResetPasswordInput } from './dtos/reset-password.dto';
import { ForgotEmailInput } from './dtos/forgot-email.dto';
import { Sns } from './entities/sns.entity';
import { Detail } from './entities/detail.entity';
import { CreateSnsInput } from './dtos/create-sns.dto';
import { UpdateSnsInput } from './dtos/edit-sns.dto';
import { UpdateDetailInput } from './dtos/update-detail.dto';
import { CreateDetailInput } from './dtos/create-detail.dto';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {
  private readonly client;

  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
    @InjectRepository(Sns)
    private readonly snsRepository: Repository<Sns>,
    @InjectRepository(Detail)
    private readonly detailRepository: Repository<Detail>,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {
    this.client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  async register({ email, password, role, username }: RegisterInput) {
    try {
      const found = await this.repository.findOne({ email });
      if (found) {
        throw new NotFoundException();
      }
      const newUser = await this.repository.save(
        this.repository.create({ email, password, role, username }),
      );
      if (!newUser) {
        throw new InternalServerErrorException('회원가입에 실패하였습니다.');
      }
      return newUser;
    } catch (e) {
      console.error(e);
      throw new HttpException(e.message, e.status);
    }
  }

  async googleRegister({ tokenId }: GoogleRegisterInput) {
    try {
      const response = await this.client.verifyIdToken({ idToken: tokenId, audience: process.env.GOOGLE_CLIENT_ID });
      const { email_verified, name, email, at_hash } = response.getPayload();
      if (email_verified) {
        const found = await this.repository.findOne({ where: { email } });
        if (found) {
          throw new ConflictException('이미 존재하는 이메일입니다. ');
        }
        const newUser = await this.repository.save(
          this.repository.create({ email, password: at_hash, role: UserRole.Client, username: name }),
        );
        if (!newUser) {
          throw new InternalServerErrorException('회원가입에 실패하였습니다.');
        }
        return newUser;
      } else {
        throw new UnauthorizedException('구글이메일을 확인해주세요. ');
      }
    } catch (e) {
      console.error(e);
      throw new HttpException(e.message, e.status);
    }
  }

  async login({ email, password }: LoginInput) {
    try {
      const found = await this.repository.findOne({
        where: {
          email,
        },
        select: ['id', 'email', 'password'],
      });

      if (!found) {
        throw new NotFoundException('해당 이메일을 찾을 수 없습니다.');
      }
      const isMatch = await found.validatePassword(password);
      if (!isMatch) {
        throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
      }

      const payload: JwtPayloadInterface = { id: found.id };
      return await this.jwtService.sign(payload);
    } catch (e) {
      console.error(e);
      throw new HttpException(e.response, e.status);
    }
  }

  async localLogin({ email, password }: LoginInput) {
    try {
      const found = await this.repository.findOne({
        where: {
          email,
        },
        select: ['id', 'email', 'password'],
      });

      if (!found) {
        throw new NotFoundException('해당 이메일을 찾을 수 없습니다.');
      }
      const isMatch = await found.validatePassword(password);
      if (!isMatch) {
        throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
      }
      return found
    } catch (e) {
      console.error(e);
      throw new HttpException(e.response, e.status);
    }
  }

  async googleLogin({ tokenId }: GoogleLoginInput) {
    try {
      const response = await this.client.verifyIdToken({ idToken: tokenId, audience: process.env.GOOGLE_CLIENT_ID });
      const { email_verified, email } = response.getPayload();
      if (email_verified) {
        const found = await this.repository.findOne({ where: { email } });
        if (!found) {
          throw new NotFoundException('해당 이메일을 찾을 수 없습니다.');
        }
        const payload: JwtPayloadInterface = { id: found.id };
        return await this.jwtService.sign(payload);
      } else {
        throw new UnauthorizedException('구글이메일을 확인해주세요. ');
      }
    } catch (e) {
      console.error(e);
      throw new HttpException(e.message, e.status);
    }
  }

  async forgotEmail({ username }: ForgotEmailInput) {
    try {
      const found = await this.repository.findOne({
        where: {
          username,
        },
      });
      if (!found) {
        throw new NotFoundException('존재하지 않는 유저명입니다. ');
      }
      return found;
    } catch (e) {
      console.error(e);
      throw new HttpException(e.response, e.status);
    }
  }

  async forgotPassword({ email }: ForgotPasswordInput) {
    try {
      const found = await this.repository.findOne({
        where: {
          email,
        },
      });
      if (!found) {
        throw new NotFoundException('존재하지 않는 이메일입니다. ');
      }
      const confirmCode = Math.floor(Math.random() * 10000) + 1;

      await this.repository.update({ id: found.id }, { confirmCode });

      await this.mailerService.sendMail({
        to: email, // list of receivers
        from: 'noreply@tamastudy.com', // sender address
        subject: 'Testing Nest MailerModule ✔', // Subject line
        text: `CODE : ${confirmCode}`, // plaintext body
        html: `<b>CODE : ${confirmCode}</b>`, // HTML body content
      });
      return confirmCode;
    } catch (e) {
      console.error(e);
      throw new HttpException(e.response, e.status);
    }
  }

  async resetPassword({ confirmCode, password }: ResetPasswordInput) {
    try {
      const foundUser = await this.repository.findOne({
        where: { confirmCode },
      });
      if (!foundUser) throw new NotFoundException();
      foundUser.password = password;
      foundUser.confirmCode = null;
      return foundUser.save();
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  async findOneById(userId: string) {
    try {
      const foundUser = await this.repository.findOne({ id: userId });
      if (!foundUser) {
        throw new NotFoundException();
      }
      return foundUser;
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }


  async createSns(user: User, createSnsInput: CreateSnsInput) {
    try {
      await this.snsRepository
        .createQueryBuilder()
        .insert()
        .into(Sns)
        .values({
          user,
          ...createSnsInput,
        })
        .execute();
      return 'success';
    } catch (e) {
      console.error(e);
      throw new HttpException(e.response, e.status);
    }
  }

  async updateSns(user: User, updateSnsInput: UpdateSnsInput) {
    try {
      await this.snsRepository
        .createQueryBuilder()
        .update(Sns)
        .set({
          user,
          ...updateSnsInput,
        })
        .where('userId = :userId', { userId: user.id })
        .execute();
      return 'success';
    } catch (e) {
      console.error(e);
      throw new HttpException(e.response, e.status);
    }
  }

  async createDetail(user: User, createDetailInput: CreateDetailInput) {
    try {
      await this.detailRepository
        .createQueryBuilder()
        .insert()
        .into(Detail)
        .values({
          user,
          ...createDetailInput,
        })
        .execute();
      return 'success';
    } catch (e) {
      console.error(e);
      throw new HttpException(e.response, e.status);
    }
  }

  async updateDetail(user: User, updateDetailInput: UpdateDetailInput) {
    try {
      await this.detailRepository
        .createQueryBuilder()
        .update(Detail)
        .set({
          user,
          ...updateDetailInput,
        })
        .where('userId = :userId', { userId: user.id })
        .execute();
      return 'success';
    } catch (e) {
      console.error(e);
      throw new HttpException(e.response, e.status);
    }
  }
}
