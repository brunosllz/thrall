import { ProjectStatus } from '@modules/project-management/domain/entities/project';
import { PeriodIdentifier } from '@modules/project-management/domain/entities/value-objects/requirement';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

class Requirements {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  content: string;

  @IsNotEmpty()
  @IsNumber()
  periodAmount: number;

  @IsNotEmpty()
  @IsEnum(PeriodIdentifier)
  periodIdentifier: PeriodIdentifier;
}

class Roles {
  @IsNotEmpty()
  @IsNumber()
  membersAmount: number;

  @IsNotEmpty()
  @IsString()
  name: string;
}

class Technologies {
  @IsNotEmpty()
  @IsString()
  slug: string;
}

export class CreateProjectDTO {
  @IsUUID()
  @IsNotEmpty()
  authorId: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @ValidateNested()
  @Type(() => Requirements)
  @IsObject()
  requirement: Requirements;

  @IsNotEmpty()
  @IsString()
  imageUrl: string;

  @IsNotEmpty()
  @IsEnum(ProjectStatus)
  status: ProjectStatus;

  @IsNotEmpty()
  @IsArray()
  @Type(() => Roles)
  roles: Array<Roles>;

  @IsNotEmpty()
  @IsArray()
  @Type(() => Technologies)
  technologies: Array<Technologies>;
}
