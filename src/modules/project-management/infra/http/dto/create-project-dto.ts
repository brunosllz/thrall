import { MeetingDTO } from '@modules/project-management/application/use-cases/commands/dtos/meeting-dto';
import { ProjectDTO } from '@modules/project-management/application/use-cases/commands/dtos/project-dto';
import { RoleDTO } from '@modules/project-management/application/use-cases/commands/dtos/role-dto';
import { TechnologyDTO } from '@modules/project-management/application/use-cases/commands/dtos/technology-dto';
import { ProjectStatus } from '@modules/project-management/domain/entities/project';
import {
  MeetingType,
  WEEK_DAYS,
} from '@modules/project-management/domain/entities/value-objects/meeting';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  IsUrl,
  ValidateNested,
} from 'class-validator';

class Roles implements RoleDTO {
  @IsNotEmpty()
  @IsNumber()
  membersAmount: number;

  @IsNotEmpty()
  @IsString()
  name: string;
}

class Technologies implements TechnologyDTO {
  @IsNotEmpty()
  @IsString()
  slug: string;
}

class Meeting implements MeetingDTO {
  @IsNotEmpty()
  @IsString()
  occurredTime: string;

  @IsNotEmpty()
  @IsEnum(MeetingType)
  type: MeetingType;

  @IsOptional()
  @IsNumber()
  @IsEnum(WEEK_DAYS)
  date: string | WEEK_DAYS;
}

export class CreateProjectDTO implements ProjectDTO {
  @IsUUID()
  @IsNotEmpty()
  authorId: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  requirements: string;

  @IsNotEmpty()
  @IsString()
  @IsUrl()
  imageUrl: string;

  @IsNotEmpty()
  @IsEnum(ProjectStatus)
  status: ProjectStatus;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested()
  @Type(() => Roles)
  roles: Array<Roles>;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested()
  @Type(() => Technologies)
  technologies: Array<Technologies>;

  @IsNotEmptyObject()
  @ValidateNested()
  meeting: Meeting;
}
