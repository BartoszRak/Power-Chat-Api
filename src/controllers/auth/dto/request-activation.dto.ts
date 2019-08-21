import { IsEmail } from 'class-validator';

export class RequestActivationDto {
  @IsEmail()
  public email: string;
}
