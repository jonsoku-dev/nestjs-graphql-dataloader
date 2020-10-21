import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entitiy';
import { Repository } from 'typeorm/index';
import { RegisterInput } from './dtos/register.dto';
import { LoginInput } from './dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayloadInterface } from './jwt-payload.interface';
import { MailerService } from '@nestjs-modules/mailer';
import { ForgotPasswordInput } from './dtos/forgot-password.dto';
import { ResetPasswordInput } from './dtos/reset-password.dto';
import { ForgotEmailInput } from './dtos/forgot-email.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  register = async ({ email, password, role, username }: RegisterInput) => {
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
      throw new HttpException(e.response, e.status);
    }
  };

  login = async ({ email, password }: LoginInput) => {
    try {
      const found = await this.repository.findOne(
        { email },
        { select: ['password'] },
      );
      if (!found) {
        throw new NotFoundException('해당 이메일을 찾을 수 없습니다.');
      }
      const isMatch = await found.validatePassword(password);
      if (!isMatch) {
        throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
      }
      const payload: JwtPayloadInterface = { id: found.id };
      const token = await this.jwtService.sign(payload);
      return { token };
    } catch (e) {
      console.error(e);
      throw new HttpException(e.response, e.status);
    }
  };

  forgotEmail = async ({ username }: ForgotEmailInput) => {
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
  };

  forgotPassword = async ({ email }: ForgotPasswordInput) => {
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
  };

  resetPassword = async ({ confirmCode, password }: ResetPasswordInput) => {
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
  };

  findOneById = async (userId: string) => {
    try {
      const foundUser = await this.repository.findOne({ id: userId });
      if (!foundUser) {
        throw new NotFoundException();
      }
      return foundUser;
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  };
}
