import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository.js';

import { CheckInUseCase } from './check-in.js';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository.js';
import { Decimal } from '@prisma/client/runtime/index-browser';

let checkInRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let checkInUseCase: CheckInUseCase;

describe('Check In Use Case', () => {
	beforeEach(() => {
		checkInRepository = new InMemoryCheckInsRepository();
		gymsRepository = new InMemoryGymsRepository();
		checkInUseCase = new CheckInUseCase(checkInRepository, gymsRepository);

		gymsRepository.items.push({
			id: 'gym-1',
			name: 'Gym 1',
			description: null,
			latitude: new Decimal(-22.2786705),
			longitude: new Decimal(-48.5487406),
			phone: null,
			created_at: new Date(),
		});

		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('should be able to check in', async () => {
		const userId = 'user-1';
		const gymId = 'gym-1';

		const { checkIn } = await checkInUseCase.execute({
			userId,
			gymId,
			userLatitude: new Decimal(-22.2786705),
			userLongitude: new Decimal(-48.5487406),
		});

		expect(checkIn.id).toEqual(expect.any(String));
	});

	it('should not be able to check in twice in the same day', async () => {
		vi.setSystemTime(new Date(2026, 0, 20, 8, 0, 0));

		const userId = 'user-1';
		const gymId = 'gym-1';

		await checkInUseCase.execute({
			userId,
			gymId,
			userLatitude: new Decimal(-22.2786705),
			userLongitude: new Decimal(-48.5487406),
		});

		await expect(() =>
			checkInUseCase.execute({
				userId,
				gymId,
				userLatitude: new Decimal(-22.2786705),
				userLongitude: new Decimal(-48.5487406),
			}),
		).rejects.toBeInstanceOf(Error);
	});

	it('should be able to check in twice but in different days', async () => {
		const userId = 'user-1';
		const gymId = 'gym-1';

		vi.setSystemTime(new Date(2026, 0, 20, 8, 0, 0));

		await checkInUseCase.execute({
			userId,
			gymId,
			userLatitude: new Decimal(-22.2786705),
			userLongitude: new Decimal(-48.5487406),
		});

		vi.setSystemTime(new Date(2026, 0, 21, 8, 0, 0));

		const { checkIn } = await checkInUseCase.execute({
			userId,
			gymId,
			userLatitude: new Decimal(-22.2786705),
			userLongitude: new Decimal(-48.5487406),
		});

		expect(checkIn.id).toEqual(expect.any(String));
	});

	it('should not be able to check in on distant gym', async () => {
		gymsRepository.items.push({
			id: 'gym-2',
			name: 'Gym 2',
			description: null,
			latitude: new Decimal(-22.2355427),
			longitude: new Decimal(-48.4494478),
			phone: null,
			created_at: new Date(),
		});

		await expect(() =>
			checkInUseCase.execute({
				userId: 'user-1',
				gymId: 'gym-2',
				userLatitude: new Decimal(-22.2786705),
				userLongitude: new Decimal(-48.5487406),
			}),
		).rejects.toBeInstanceOf(Error);
	});
});
