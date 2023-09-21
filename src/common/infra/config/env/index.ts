import { z } from 'zod';

const nodeEnv = z.enum(['development', 'production', 'test']);

export const envSchema = z.object({
  NODE_ENV: nodeEnv.default('development'),
  APP_NAME: z.string().default('Thrall'),
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.string().url(),
  JWT_SECRET_KEY: z.string(),
});

export type Env = z.infer<typeof envSchema>;
