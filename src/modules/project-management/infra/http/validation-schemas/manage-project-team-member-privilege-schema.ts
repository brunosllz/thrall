import { PermissionType } from '@/modules/project-management/domain/entities/member';
import { z } from 'zod';

export const manageProjectTeamMemberPrivilegeBodySchema = z.object({
  permissionType: z.nativeEnum(PermissionType),
});

export const manageProjectTeamMemberPrivilegeParamsSchema = z.object({
  projectId: z.string().uuid(),
  memberId: z.string().uuid(),
});

export type ManageProjectTeamMemberPrivilegeBodySchema = z.infer<
  typeof manageProjectTeamMemberPrivilegeBodySchema
>;

export type ManageProjectTeamMemberPrivilegeParamsSchema = z.infer<
  typeof manageProjectTeamMemberPrivilegeParamsSchema
>;
