import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateOTPDto } from './dto/createOTP.dto';
import { CheckOTPDto } from './dto/checkOTP.dto';
import { Otp } from './entities/otp.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { sendEmail } from 'src/utils/sendEmail';

@Injectable()
export class AuthService {
  constructor(@InjectModel(Otp.name) private readonly otpmodel: Model<Otp>, private readonly usersService: UsersService, private readonly jwtService: JwtService) {}
  async signup(signupDto: SignupDto) {
    const { email } = signupDto;
    const user = await this.usersService.findOneByEmail(email);
    if (user) throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    if (signupDto.password !== signupDto.repassword) throw new HttpException('Repeating password is not matching', HttpStatus.BAD_REQUEST);
    const password = bcrypt.hashSync(signupDto.password, 10);
    return await this.usersService.create({ ...signupDto, password });
  }

  async signin(signinDto: SigninDto) {
    const { email, password } = signinDto;
    const user = await this.usersService.findOneByEmail(email);
    if (!user) throw new HttpException('User not exists', HttpStatus.BAD_REQUEST);
    const matchingPassword = await bcrypt.compare(password, user.password);
    if (matchingPassword) throw new HttpException('Password not matching', HttpStatus.BAD_REQUEST);
    const payload = { sub: user };
    const token = this.jwtService.sign(payload);
    return token;
  }

  async createOTP(createOTPDto: CreateOTPDto) {
    const { email } = createOTPDto;
    const tdo: Otp = await this.otpmodel.create({ email });
    sendEmail(email, 'Your one time passport', `<p>Your one time password is: <b>${tdo.token}</b></p>`)
      .then(() => {
        Logger.log(`OTP sent to: ${email}`);
        return true;
      })
      .catch((error) => {
        Logger.error(`OTP not send to ${email} error: ${error.message}`);
        return false;
      });
  }

  async verifyOTP(checkOTPDto: CheckOTPDto) {
    const { otp: token, email } = checkOTPDto;
    const otp = await this.otpmodel.findOne({ token });

    if (!otp) throw new HttpException('OTP not found', HttpStatus.BAD_REQUEST);
    if (email !== otp.email) throw new HttpException('Email not match', HttpStatus.BAD_REQUEST);

    const isExpired = this.isOTPExpired(otp);
    if (isExpired) {
      this.removeOTP(token);
      throw new HttpException('OTP is expired', HttpStatus.BAD_REQUEST);
    }

    let user = await this.usersService.findOneByEmail(email);

    if (!user) user = await this.usersService.create({ email });
    this.removeOTP(token);
    const payload = { sub: user };
    return this.jwtService.sign(payload);
  }

  isOTPExpired(otp: Otp): boolean {
    // date from 10 minutes after otp created
    const expireDate = new Date(otp.createdAt.getTime() * 10 * 1000 * 60);
    return expireDate < new Date();
  }

  async removeOTP(token: number) {
    await this.otpmodel.findOneAndDelete({ token });
    return token;
  }
}
