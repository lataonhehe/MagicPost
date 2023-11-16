import { IsNotEmpty, Matches, MaxLength, MinLength } from "class-validator";
import { Unique } from "typeorm";

export class CreateUserDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(12)
//   @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
//     message:
//       'Password is too weak, choose a stronger password between 6 and 12 characters',
//   })
  password: string;
  id: number;
}
