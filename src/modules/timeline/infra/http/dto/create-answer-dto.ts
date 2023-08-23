import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateAnswerDTO {
  @IsUUID()
  @IsNotEmpty()
  authorId: string;

  @IsUUID()
  @IsNotEmpty()
  projectId: string;

  @IsNotEmpty()
  @IsString()
  content: string;
}
