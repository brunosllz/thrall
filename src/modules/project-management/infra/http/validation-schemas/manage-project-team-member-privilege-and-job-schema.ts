import { PermissionType } from '@/modules/project-management/domain/entities/member';
import { z } from 'zod';

export const manageProjectTeamMemberPrivilegeAndJobBodySchema = z.object({
  permissionType: z.nativeEnum(PermissionType),
  jobsId: z.array(z.string().uuid()),
});

export const manageProjectTeamMemberPrivilegeAndJobParamsSchema = z.object({
  projectId: z.string().uuid(),
  memberId: z.string().uuid(),
});

export type ManageProjectTeamMemberPrivilegeAndJobBodySchema = z.infer<
  typeof manageProjectTeamMemberPrivilegeAndJobBodySchema
>;

export type ManageProjectTeamMemberPrivilegeAndJobParamsSchema = z.infer<
  typeof manageProjectTeamMemberPrivilegeAndJobParamsSchema
>;
