import { IsString, IsEmail, MinLength, MaxLength } from 'class-validator'

export class RegisterDto {
  @IsString()
  nickname: string
  @IsString()
  @IsEmail()
  email: string
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  password: string
  description?: string
  thumbnailUrl?: string

}