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
import { GenerateCodeAndSendMailInput } from './dtos/generate-code-and-send-mail.dto';
import { ConfirmCodeArg } from './dtos/confirm-code.dto';
import { ResetPasswordInput } from './dtos/reset-password.dto';
import { UserOutput } from './dtos/shared.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  async register({
    email,
    password,
    role,
    username,
  }: RegisterInput): Promise<UserOutput> {
    const found = await this.repository.findOne({ email });
    if (found) {
      throw new NotFoundException();
    }
    const newUser = await this.repository.save(
      this.repository.create({ email, password, role, username }),
    );
    return {
      ok: true,
      data: newUser,
    };
  }

  async login({ email, password }: LoginInput) {
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

    return {
      ok: true,
      data: {
        token,
      },
      error: null,
    };
  }

  async generateCodeAndSendMail({ email }: GenerateCodeAndSendMailInput) {
    const found = await this.repository.findOne({
      where: {
        email,
      },
    });
    if (!found) {
      throw new NotFoundException('존재하지 않는 이메일입니다. ');
    }
    const passwordSecretCode = Math.floor(Math.random() * 10000) + 1;

    await this.repository.update({ id: found.id }, { passwordSecretCode });
    await this.mailerService.sendMail({
      to: email, // list of receivers
      from: 'noreply@tamastudy.com', // sender address
      subject: 'Testing Nest MailerModule ✔', // Subject line
      text: 'CODE : 9060', // plaintext body
      html: '<b>CODE : 9060</b>', // HTML body content
    });
    return passwordSecretCode;
  }

  async confirmCode({ email, passwordSecretCode }: ConfirmCodeArg) {
    const found = await this.repository.findOne({
      where: {
        email,
      },
    });
    if (!found) {
      throw new NotFoundException('존재하지 않는 이메일입니다. ');
    }
    if (found.passwordSecretCode !== passwordSecretCode) {
      throw new InternalServerErrorException('코드를 확인해주세요. ');
    }
    await this.repository.update(
      { id: found.id },
      { passwordConfirmSecretCode: true },
    );
    return 'success';
  }

  async resetPassword({ email, password }: ResetPasswordInput) {
    const found = await this.repository.findOne({
      where: {
        email,
      },
    });
    if (!found) {
      throw new NotFoundException('존재하지 않는 이메일입니다. ');
    }
    if (!found.passwordConfirmSecretCode) {
      throw new InternalServerErrorException(
        '접근이 제한되었습니다. 처음부터 다시 시도해주세요.',
      );
    }
    found.password = password;
    found.passwordSecretCode = null;
    found.passwordConfirmSecretCode = false;
    const user = await found.save();
    return {
      ok: true,
      data: user,
    };
  }
}
