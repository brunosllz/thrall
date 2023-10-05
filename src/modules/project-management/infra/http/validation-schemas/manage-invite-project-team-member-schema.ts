import { z } from 'zod';

export const manageInviteProjectTeamMemberBodySchema = z.object({
  status: z.enum(['approved', 'rejected']),
});

export const manageInviteProjectTeamMemberParamsSchema = z.object({
  projectId: z.string().uuid(),
});

export type ManageInviteProjectTeamMemberBodySchema = z.infer<
  typeof manageInviteProjectTeamMemberBodySchema
>;

export type ManageInviteProjectTeamMemberParamsSchema = z.infer<
  typeof manageInviteProjectTeamMemberParamsSchema
>;
