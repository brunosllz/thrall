import { Logger } from '@nestjs/common';
import 'dotenv/config';
import { z } from 'zod';

const nodeEnv = z.enum(['development', 'production', 'test']);

// function requiredOnEnv(env: z.infer<typeof nodeEnv>) {
//   return (value: any) => {
//     if (env === process.env.NODE_ENV && !value) {
//       return false;
//     }

//     return true;
//   };
// }

const envSchema = z.object({
  NODE_ENV: nodeEnv.default('development'),
  APP_NAME: z.string().default('Thrall'),
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.string().url(),
  JWT_SECRET_KEY: z.string(),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  Logger.log('❌ Invalid environment variables', _env.error.format());

  throw new Error('Invalid environment variables.');
}

export const env = _env.data;
