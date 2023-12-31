import 'dotenv/config';

import { DomainEvents } from '@/common/domain/events/domain-events';
import { envSchema } from '@/common/infra/config/env';
import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';
// import { Redis } from 'ioredis';
import { execSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';

config({ path: '.env', override: true });
config({ path: '.env.testing', override: true });

const env = envSchema.parse(process.env);

const prisma = new PrismaClient();

/** DISABLE REDIS CONFIG */

// const redis = new Redis({
//   host: env.REDIS_HOST,
//   port: env.REDIS_PORT,
//   db: env.REDIS_DB,
// });

function generateUniqueDatabaseURL(schemaId: string) {
  if (!env.DATABASE_URL) {
    throw new Error('Please provider a DATABASE_URL environment variable');
  }

  const url = new URL(env.DATABASE_URL);

  url.searchParams.set('schema', schemaId);

  return url.toString();
}

const schemaId = randomUUID();

beforeEach(async () => {
  const databaseURL = generateUniqueDatabaseURL(schemaId);

  process.env.DATABASE_URL = databaseURL;

  DomainEvents.shouldRun = false;

  // await redis.flushdb();

  execSync('npx prisma migrate deploy');
});

afterEach(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`);
  await prisma.$disconnect();
});
