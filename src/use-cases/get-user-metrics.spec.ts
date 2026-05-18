import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository.js';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository.js';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository.js';
import { GetUserMetricsUseCase } from './get-user-metrics.js';

let checkInRepository: InMemoryCheckInsRepository;
let userRepository: InMemoryUsersRepository;
let gymRepository: InMemoryGymsRepository;
let getUserMetricsUseCase: GetUserMetricsUseCase;

describe('Get User Metrics Use Case', () => {
	beforeEach(async () => {
		checkInRepository = new InMemoryCheckInsRepository();
		userRepository = new InMemoryUsersRepository();
		gymRepository = new InMemoryGymsRepository();
		getUserMetricsUseCase = new GetUserMetricsUseCase(checkInRepository);
	});

	it('should be able to get checkins count from metrics', async () => {
		const user = await userRepository.create({
			name: 'John Doe',
			email: 'johndoe@example.com',
			password_hash: '123456',
		});

		const gym1 = await gymRepository.create({
			name: 'Gym 1',
			description: 'Description for Gym 1',
			phone: '123456789',
			latitude: 0,
			longitude: 0,
		});

		const gym2 = await gymRepository.create({
			name: 'Gym 2',
			description: 'Description for Gym 2',
			phone: '123456789',
			latitude: 0,
			longitude: 0,
		});

		await checkInRepository.create({
			userId: user.id,
			gymId: gym1.id,
		});

		await checkInRepository.create({
			userId: user.id,
			gymId: gym2.id,
		});

		const { checkInsCount } = await getUserMetricsUseCase.execute({
			userId: user.id,
		});

		expect(checkInsCount).toBe(2);
	});
});
