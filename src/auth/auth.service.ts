import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) {}
  async signup(signupDto: SignupDto) {
    const { email } = signupDto;
    const user = await this.usersService.findOneByEmail(email);
    if (user) throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    if (signupDto.password !== signupDto.repassword) throw new HttpException('Repeating password is not matching', HttpStatus.BAD_REQUEST);
    console.log('bcrypt is:', bcrypt);
    const password = bcrypt.hashSync(signupDto.password, 10);
    return await this.usersService.create({ ...signupDto, password });
  }

  async signin(signinDto: SigninDto) {
    const { email, password } = signinDto;
    const user = await this.usersService.findOneByEmail(email);
    if (!user) throw new HttpException('User not exists', HttpStatus.BAD_REQUEST);
    if (!bcrypt.compare(password, user.password)) throw new HttpException('Password not matching', HttpStatus.BAD_REQUEST);
    const payload = { sub: user };
    const token = this.jwtService.sign(payload);
    return token;
  }
}
