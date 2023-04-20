import { IsEmail, IsInt, IsNotEmpty, Max, Min } from 'class-validator';

export class CheckOTPDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsInt()
  @Min(100000)
  @Max(1000000 - 1)
  otp: number;
}
