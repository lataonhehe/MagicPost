import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { signInDto } from 'src/auth/dto/signIn-user.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signIn(signInDto: signInDto): Promise<{
        access_token: string;
    }>;
    registration(createUserDto: CreateUserDto): Promise<User>;
}
