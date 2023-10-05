import { z } from 'zod';

export const sendAInviteTeamMemberBodySchema = z.object({
  recipientId: z.string().uuid(),
});

export const sendAInviteTeamMemberParamsSchema = z.object({
  projectId: z.string().uuid(),
});

export type SendAInviteTeamMemberBodySchema = z.infer<
  typeof sendAInviteTeamMemberBodySchema
>;

export type SendAInviteTeamMemberParamsSchema = z.infer<
  typeof sendAInviteTeamMemberParamsSchema
>;
