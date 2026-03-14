import { describe, expect, it } from 'vitest';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository.js';
import { hash } from 'bcryptjs';
import { AuthenticateUseCase } from './authenticate.js';
import { InvalidCredentialsError } from './errors/invalid-credentials-error.js';

describe('Authenticate Use Case', () => {
	it('should be able to authenticate a user with correct credentials', async () => {
		const usersRepository = new InMemoryUsersRepository();
		const authenticateUseCase = new AuthenticateUseCase(usersRepository);

		const email = 'john.doe@example.com';
		const password = 'password123';

		await usersRepository.create({
			name: 'John Doe',
			email,
			password_hash: await hash(password, 6),
		});

		const { user } = await authenticateUseCase.execute({
			email,
			password,
		});

		expect(user.id).toEqual(expect.any(String));
	});

	it('should not be able to authenticate a user with incorrect email', async () => {
		const usersRepository = new InMemoryUsersRepository();
		const authenticateUseCase = new AuthenticateUseCase(usersRepository);

		const email = 'john.doe@example.com';
		const password = 'password123';

		await usersRepository.create({
			name: 'John Doe',
			email,
			password_hash: await hash(password, 6),
		});

		await expect(() =>
			authenticateUseCase.execute({
				email: 'incorrect.email@example.com',
				password,
			}),
		).rejects.toBeInstanceOf(InvalidCredentialsError);
	});

	it('should not be able to authenticate a user with incorrect password', async () => {
		const usersRepository = new InMemoryUsersRepository();
		const authenticateUseCase = new AuthenticateUseCase(usersRepository);

		const email = 'john.doe@example.com';
		const password = 'password123';

		await usersRepository.create({
			name: 'John Doe',
			email,
			password_hash: await hash(password, 6),
		});

		await expect(() =>
			authenticateUseCase.execute({
				email,
				password: 'incorrectPassword',
			}),
		).rejects.toBeInstanceOf(InvalidCredentialsError);
	});
});
