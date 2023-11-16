import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { signInDto } from 'src/auth/dto/signIn-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(signIn: signInDto) {
    const { username, password } = signIn;
    const user = await this.usersService.findOneUsername(username);
    if (!user) {
      throw new UnauthorizedException();
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Wrong password');
    }

    const payload = { username: user.username, role: user.role, sub: user.id };
    return {
      access_token: await this.jwtService.signAsync(user),
    };
  }

  async register(createUserDto: CreateUserDto): Promise<User> {
    const { username, password } = createUserDto;
    const salt = await bcrypt.genSalt();
    const hashed = await bcrypt.hash(password, salt);
    createUserDto.password = hashed;
    return this.usersService.create(createUserDto);
  }
}
