import { Injectable, Controller, Inject, Post, Body } from '@nestjs/common';

import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AuthService') private readonly authService: AuthService,
  ) {}

  @Post()
  public async register(@Body() payload: RegisterDto): Promise<string> {
    return await this.authService.register(payload);
  }
}
