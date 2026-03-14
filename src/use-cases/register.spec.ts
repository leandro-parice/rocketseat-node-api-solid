import { describe, expect, it } from 'vitest';
import { RegisterUseCase } from './register.js';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository.js';
import { compare } from 'bcryptjs';
import { UserAlreadyExistsError } from './errors/user-already-exists-error.js';

describe('Register Use Case', () => {
	it('should hash user password upon registration', async () => {
		const usersRepository = new InMemoryUsersRepository();
		const registerUseCase = new RegisterUseCase(usersRepository);

		const password = 'password123';

		const { user } = await registerUseCase.execute({
			name: 'John Doe',
			email: 'john.doe@example.com',
			password,
		});

		const isPasswordCorrectlyHashed = await compare(
			password,
			user.password_hash,
		);

		expect(isPasswordCorrectlyHashed).toBe(true);
	});

	it('should not allow registration with an email that already exists', async () => {
		const usersRepository = new InMemoryUsersRepository();
		const registerUseCase = new RegisterUseCase(usersRepository);

		const email = 'john.doe@example.com';

		await registerUseCase.execute({
			name: 'John Doe',
			email,
			password: 'password123',
		});

		await expect(() =>
			registerUseCase.execute({
				name: 'Jane Doe',
				email,
				password: 'password456',
			}),
		).rejects.toBeInstanceOf(UserAlreadyExistsError);
	});

	it('should be able to register a new user', async () => {
		const usersRepository = new InMemoryUsersRepository();
		const registerUseCase = new RegisterUseCase(usersRepository);

		const { user } = await registerUseCase.execute({
			name: 'John Doe',
			email: 'john.doe@example.com',
			password: 'password123',
		});

		expect(user.id).toEqual(expect.any(String));
	});
});
