import { IsEmail, IsString } from 'class-validator';

export class ActivationDto {
  @IsEmail()
  public email: string;
  @IsString()
  public secret: string;
}
