import { IsEmail, Length, IsNotEmpty } from "class-validator";

export class CreatePlayerInputs {
  @IsEmail()
  email: string;

  @IsNotEmpty({ message: "Username should not be embty" })
  username: string;

  @Length(6, 20, {
    message: "Password length should be between 6 and 20 character",
  })
  password: string;
}

export class LoginInputs {
  @IsNotEmpty({ message: "Username should not be embty" })
  email: string;

  @Length(6,20,{ message: "Password length should be between 6 and 20 character" })
  password: string;
}

export class DeleteInputs {
    @Length(6,20,{ message: "Password length should be between 6 and 20 character" })
    password: string;
  }
