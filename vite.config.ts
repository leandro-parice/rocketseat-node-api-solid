import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
			'generated': path.resolve(__dirname, './generated'),
		},
	},
	test: {
		projects: [
			{
				extends: true,
				test: {
					name: 'unit',
					include: ['src/use-cases/**/*.spec.ts'],
				},
			},
			{
				extends: true,
				test: {
					name: 'e2e',
					include: ['src/http/controllers/**/*.spec.ts'],
					environment:
						'./prisma/vitest-environment-prisma/prisma-test-environment.ts',
				},
			},
		],
	},
});
