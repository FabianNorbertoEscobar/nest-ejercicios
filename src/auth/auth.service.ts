import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from 'src/users/model/user.schema';
import { User } from '../users/model/user.schema';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { compareHash, generateHash } from './utils/handleBcrypt';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly eventEmitter2: EventEmitter2,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  public async register(userBody: RegisterAuthDto) {
    const { password, ...user } = userBody;
    const parsedUser = { ...user, password: await generateHash(password) };
    const newUser = this.userModel.create(parsedUser);

    this.eventEmitter2.emit('user.created', newUser);

    return newUser;
  }

  public async login(userBody: LoginAuthDto) {
    const { password } = userBody;

    const userDoc = await this.userModel.findOne({ email: userBody.email });
    if (!userDoc) throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);

    const isCheck = await compareHash(password, userDoc.password);

    if (!isCheck)
      throw new HttpException('PASSWORD_INVALID', HttpStatus.CONFLICT);

    const userFlat = userDoc.toObject();
    delete userFlat.password;

    const payload = {
      id: userFlat._id,
    };

    const token = this.jwtService.sign(payload);

    const data = {
      token: token,
    };

    this.eventEmitter2.emit('user.logged', data);

    return data;
  }
}
