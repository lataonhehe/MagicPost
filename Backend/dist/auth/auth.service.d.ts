import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { signInDto } from 'src/auth/dto/signIn-user.dto';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    signIn(signIn: signInDto): Promise<{
        access_token: string;
    }>;
    register(createUserDto: CreateUserDto): Promise<User>;
}
