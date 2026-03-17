import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository.js';
import { hash } from 'bcryptjs';
import { GetUserProfileUseCase } from './get-user-profile.js';
import { ResourceNotFoundError } from './errors/resource-not-found-error.js';

let usersRepository: InMemoryUsersRepository;
let getUserProfileUseCase: GetUserProfileUseCase;

describe('Get User Profile Use Case', () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository();
		getUserProfileUseCase = new GetUserProfileUseCase(usersRepository);
	});

	it('should be able to get a user profile', async () => {
		const name = 'John Doe';
		const email = 'john.doe@example.com';
		const password = 'password123';

		const createdUser = await usersRepository.create({
			name,
			email,
			password_hash: await hash(password, 6),
		});

		const { user } = await getUserProfileUseCase.execute({
			userId: createdUser.id,
		});

		expect(user.email).toEqual(email);
	});

	it('should not be able to get a user profile with non-existing user ID', async () => {
		await expect(() =>
			getUserProfileUseCase.execute({
				userId: 'non-existing-user-id',
			}),
		).rejects.toBeInstanceOf(ResourceNotFoundError);
	});
});
