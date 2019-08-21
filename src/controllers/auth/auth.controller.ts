import {
  Injectable,
  Controller,
  Inject,
  Post,
  Body,
  Put,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { ActivationService } from './activation.service';
import { RegisterDto } from './dto/register.dto';
import { RequestActivationDto } from './dto/request-activation.dto';
import { ActivationDto } from './dto/activation.dto';

@Injectable()
@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AuthService') private readonly authService: AuthService,
    @Inject('ActivationService')
    private readonly activationService: ActivationService,
  ) {}

  @Post()
  public async register(@Body() payload: RegisterDto): Promise<string> {
    return await this.authService.register(payload);
  }

  @Post('activation')
  public async requestActivation(
    @Body() payload: RequestActivationDto,
  ): Promise<boolean> {
    return await this.activationService.requestActivation(payload.email);
  }

  @Put('activation')
  public async activate(@Body() payload: ActivationDto): Promise<boolean> {
    return await this.activationService.activate(payload.email, payload.secret);
  }
}
