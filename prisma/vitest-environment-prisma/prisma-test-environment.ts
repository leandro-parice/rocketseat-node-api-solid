import 'dotenv/config';
import { execSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import pg from 'pg';
import type { Environment } from 'vitest/environments';

function generateDatabaseUrl(schema: string) {
	if (!process.env.DATABASE_URL) {
		throw new Error('DATABASE_URL environment variable is not set');
	}

	const url = new URL(process.env.DATABASE_URL);
	url.searchParams.set('schema', schema);

	return url.toString();
}

export default {
	name: 'prisma',
	viteEnvironment: 'ssr',
	async setup() {
		const schema = randomUUID();
		const originalDatabaseUrl = process.env.DATABASE_URL!;
		const databaseUrl = generateDatabaseUrl(schema);

		process.env.DATABASE_URL = databaseUrl;

		execSync('npx prisma db push');

		return {
			async teardown() {
				const pool = new pg.Pool({ connectionString: originalDatabaseUrl });
				await pool.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
				await pool.end();
			},
		};
	},
} satisfies Environment;
