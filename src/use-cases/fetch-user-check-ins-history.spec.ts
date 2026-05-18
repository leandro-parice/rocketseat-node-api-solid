import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository.js';
import { FetchUserCheckInHistoryUseCase } from './fetch-user-check-ins-history.js';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository.js';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository.js';

let checkInRepository: InMemoryCheckInsRepository;
let userRepository: InMemoryUsersRepository;
let gymRepository: InMemoryGymsRepository;
let checkInHistoryUseCase: FetchUserCheckInHistoryUseCase;

describe('Fetch Check-in History Use Case', () => {
	beforeEach(async () => {
		checkInRepository = new InMemoryCheckInsRepository();
		userRepository = new InMemoryUsersRepository();
		gymRepository = new InMemoryGymsRepository();
		checkInHistoryUseCase = new FetchUserCheckInHistoryUseCase(
			checkInRepository,
		);
	});

	it('should be able to fetch check-in history', async () => {
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

		const { checkIns } = await checkInHistoryUseCase.execute({
			userId: user.id,
			page: 1,
		});

		expect(checkIns).toHaveLength(2);
		expect(checkIns).toEqual([
			expect.objectContaining({
				userId: user.id,
				gymId: gym1.id,
			}),
			expect.objectContaining({
				userId: user.id,
				gymId: gym2.id,
			}),
		]);
	});

	it('should be able to fetch paginated check-in history', async () => {
		const user = await userRepository.create({
			name: 'John Doe',
			email: 'johndoe@example.com',
			password_hash: '123456',
		});

		for (let i = 0; i < 20; i++) {
			const gym = await gymRepository.create({
				name: `Gym ${i + 1}`,
				description: `Description for Gym ${i + 1}`,
				phone: '123456789',
				latitude: 0,
				longitude: 0,
			});

			await checkInRepository.create({
				userId: user.id,
				gymId: gym.id,
			});
		}

		const gym1 = await gymRepository.create({
			name: `Static Gym 1`,
			description: `Description for Static Gym 1`,
			phone: '123456789',
			latitude: 0,
			longitude: 0,
		});

		await checkInRepository.create({
			userId: user.id,
			gymId: gym1.id,
		});

		const gym2 = await gymRepository.create({
			name: `Static Gym 2`,
			description: `Description for Static Gym 2`,
			phone: '123456789',
			latitude: 0,
			longitude: 0,
		});

		await checkInRepository.create({
			userId: user.id,
			gymId: gym2.id,
		});

		const { checkIns } = await checkInHistoryUseCase.execute({
			userId: user.id,
			page: 2,
		});

		expect(checkIns).toHaveLength(2);
		expect(checkIns).toEqual([
			expect.objectContaining({
				userId: user.id,
				gymId: gym1.id,
			}),
			expect.objectContaining({
				userId: user.id,
				gymId: gym2.id,
			}),
		]);
	});
});
