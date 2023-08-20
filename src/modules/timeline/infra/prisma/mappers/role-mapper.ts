import { Role } from '@modules/timeline/domain/entities/role';
import { Slug } from '@modules/timeline/domain/entities/value-objects/slug';
import { Role as RawRole } from '@prisma/client';

type ToDomainRawProps = { projectId: string; amount: number; role: RawRole };

export class RoleMapper {
  static toDomain(raw: ToDomainRawProps): Role {
    const role = Role.create(
      {
        amount: raw.amount,
        name: Slug.createFromText(raw.role.name),
        projectId: raw.projectId,
      },
      raw.role.id,
    );

    return role;
  }
}
