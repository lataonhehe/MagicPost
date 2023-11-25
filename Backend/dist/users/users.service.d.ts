import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    findAll(): Promise<User[]>;
    findOne(id: number): Promise<User | null>;
    findOneUsername(username: string): Promise<User | null>;
    remove(id: number): Promise<void>;
    create(createUserDto: CreateUserDto): Promise<User>;
}
