import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository.js';
import { CheckInUseCase } from './check-in.js';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository.js';
import { MaxDistanceError } from './errors/max-distance-error.js';
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error.js';

let checkInRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let checkInUseCase: CheckInUseCase;

describe('Check In Use Case', () => {
	beforeEach(async () => {
		checkInRepository = new InMemoryCheckInsRepository();
		gymsRepository = new InMemoryGymsRepository();
		checkInUseCase = new CheckInUseCase(checkInRepository, gymsRepository);

		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('should be able to check in', async () => {
		const gym = await gymsRepository.create({
			name: 'Gym 1',
			latitude: -22.2786705,
			longitude: -48.5487406,
		});

		const userId = 'user-1';

		const { checkIn } = await checkInUseCase.execute({
			userId,
			gymId: gym.id,
			userLatitude: -22.2786705,
			userLongitude: -48.5487406,
		});

		expect(checkIn.id).toEqual(expect.any(String));
	});

	it('should not be able to check in twice in the same day', async () => {
		vi.setSystemTime(new Date(2026, 0, 20, 8, 0, 0));

		const userId = 'user-1';
		const gym1 = await gymsRepository.create({
			name: 'Gym 1',
			latitude: -22.2786705,
			longitude: -48.5487406,
		});

		const gym2 = await gymsRepository.create({
			name: 'Gym 2',
			latitude: -23.2786705,
			longitude: -48.5487406,
		});

		await checkInUseCase.execute({
			userId,
			gymId: gym1.id,
			userLatitude: -22.2786705,
			userLongitude: -48.5487406,
		});

		await expect(() =>
			checkInUseCase.execute({
				userId,
				gymId: gym2.id,
				userLatitude: -22.2786705,
				userLongitude: -48.5487406,
			}),
		).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
	});

	it('should be able to check in twice but in different days', async () => {
		const userId = 'user-1';
		const gym = await gymsRepository.create({
			name: 'Gym 1',
			latitude: -22.2786705,
			longitude: -48.5487406,
		});

		vi.setSystemTime(new Date(2026, 0, 20, 8, 0, 0));

		await checkInUseCase.execute({
			userId,
			gymId: gym.id,
			userLatitude: -22.2786705,
			userLongitude: -48.5487406,
		});

		vi.setSystemTime(new Date(2026, 0, 21, 8, 0, 0));

		const { checkIn } = await checkInUseCase.execute({
			userId,
			gymId: gym.id,
			userLatitude: -22.2786705,
			userLongitude: -48.5487406,
		});

		expect(checkIn.id).toEqual(expect.any(String));
	});

	it('should not be able to check in on distant gym', async () => {
		gymsRepository.items.push({
			id: 'gym-2',
			name: 'Gym 2',
			description: null,
			latitude: -22.2355427,
			longitude: -48.4494478,
			phone: null,
			created_at: new Date(),
		});

		await expect(() =>
			checkInUseCase.execute({
				userId: 'user-1',
				gymId: 'gym-2',
				userLatitude: -22.2786705,
				userLongitude: -48.5487406,
			}),
		).rejects.toBeInstanceOf(MaxDistanceError);
	});
});
