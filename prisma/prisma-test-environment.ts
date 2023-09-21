import type {
  JestEnvironmentConfig,
  EnvironmentContext,
} from '@jest/environment';
import dotenv from 'dotenv';
import NodeEnvironment from 'jest-environment-node';
import { exec } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import util from 'node:util';
import { Client } from 'pg';

import {
  HOST,
  NAME,
  PASSWORD,
  PORT,
  USER,
} from '../src/common/infra/config/database';

dotenv.config({ path: '.env.testing' });

const execSync = util.promisify(exec);

const prismaBinary = './node_modules/.bin/prisma';

export default class PrismaTestEnvironment extends NodeEnvironment {
  private schema: string;
  private connectionString: string;

  constructor(config: JestEnvironmentConfig, context: EnvironmentContext) {
    super(config, context);

    this.schema = `test_${randomUUID()}`;
    this.connectionString = `postgresql://${USER}:${PASSWORD}@${HOST}:${PORT}/${NAME}?schema=${this.schema}`;
  }

  async setup() {
    process.env.DATABASE_URL = this.connectionString;
    this.global.process.env.DATABASE_URL = this.connectionString;

    await execSync(`${prismaBinary} migrate deploy`);

    return super.setup();
  }

  async teardown() {
    const client = new Client({
      connectionString: this.connectionString,
    });

    await client.connect();
    await client.query(`DROP SCHEMA IF EXISTS "${this.schema}" CASCADE`);
    await client.end();
  }
}
