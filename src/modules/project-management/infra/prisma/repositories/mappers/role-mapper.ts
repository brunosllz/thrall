import { Role } from '@modules/project-management/domain/entities/role';
import { Slug } from '@modules/project-management/domain/entities/value-objects/slug';
import { Role as RawRole } from '@prisma/client';

type ToDomainRawProps = {
  projectId: string;
  membersAmount: number;
  role: RawRole;
};

export class RoleMapper {
  static toDomain(raw: ToDomainRawProps): Role {
    const role = Role.create(
      {
        projectId: raw.projectId,
        membersAmount: raw.membersAmount,
        name: Slug.createFromText(raw.role.name).getValue(),
      },
      raw.role.id,
    ).getValue();

    return role;
  }
}
