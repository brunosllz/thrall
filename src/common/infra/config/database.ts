import 'dotenv/config';

const USER = process.env.DATABASE_USER ?? 'postgres';
const PASSWORD = process.env.DATABASE_PASS ?? 'docker';
const HOST = process.env.DATABASE_HOST ?? 'localhost';
const PORT = process.env.DATABASE_PORT ?? '5432';
const NAME = process.env.DATABASE_NAME ?? 'e2e_test';

export { USER, PASSWORD, HOST, PORT, NAME };
