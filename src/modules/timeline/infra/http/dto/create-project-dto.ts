import { TimeIdentifier } from '@modules/timeline/domain/entities/value-objects/requirement';
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
  timeAmount: number;

  @IsNotEmpty()
  @IsEnum(TimeIdentifier)
  timeIdentifier: TimeIdentifier;
}

class Roles {
  @IsNotEmpty()
  @IsNumber()
  amount: number;

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
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @ValidateNested()
  @Type(() => Requirements)
  @IsObject()
  requirements: Requirements;

  @IsNotEmpty()
  @IsArray()
  @Type(() => Roles)
  roles: Array<Roles>;

  @IsNotEmpty()
  @IsArray()
  @Type(() => Technologies)
  technologies: Array<Technologies>;
}
