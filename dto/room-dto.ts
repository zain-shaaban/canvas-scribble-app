import { Length, IsNotEmpty } from "class-validator";

export class CreateRoomInputs {
  @IsNotEmpty({ message: "Room name shouldn't be emty" })
  roomName: string;

  maxPlayers: number;

  rounds: number;

  isPrivate: boolean;

  @Length(4, 10, { message: "Password should be between 4 and 10 character" })
  password: string;
}

export class JoinRoomInputs {
  @IsNotEmpty({ message: "Room id should't be empty" })
  roomId: string;

  @Length(4, 10, { message: "Password should be between 4 and 10 character" })
  password: string;
}

export class ExitRoomInputs{
  @IsNotEmpty({message:'Room id should\'t be empty'})
  roomId:string
}

export class DeleteRoomInputs{
  @IsNotEmpty({message:'Room id should\'t be embty'})
  roomId:string;

}