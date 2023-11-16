import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Get,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { signInDto } from 'src/auth/dto/signIn-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body(ValidationPipe) signInDto: signInDto) {
    return this.authService.signIn(signInDto);
  }

  @Post('register')
  registration(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<User> {
    return this.authService.register(createUserDto);
  }
}
