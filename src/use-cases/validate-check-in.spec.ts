import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository.js';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository.js';
import { ValidateCheckInUseCase } from './validate-check-in.js';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository.js';
import { ResourceNotFoundError } from './errors/resource-not-found-error.js';
import { LateCheckInValidationError } from './errors/late-check-in-validation-error.js';

let checkInRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let validateCheckInUseCase: ValidateCheckInUseCase;
let usersRepository: InMemoryUsersRepository;

describe('Validate Check In Use Case', () => {
	beforeEach(async () => {
		checkInRepository = new InMemoryCheckInsRepository();
		gymsRepository = new InMemoryGymsRepository();
		usersRepository = new InMemoryUsersRepository();
		validateCheckInUseCase = new ValidateCheckInUseCase(checkInRepository);

		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('should be able to validate the check-in', async () => {
		const user = await usersRepository.create({
			name: 'John Doe',
			email: 'john.doe@example.com',
			password_hash: 'password',
		});

		const gym = await gymsRepository.create({
			name: 'Gym 1',
			latitude: -22.2786705,
			longitude: -48.5487406,
		});

		const createdCheckIn = await checkInRepository.create({
			userId: user.id,
			gymId: gym.id,
		});

		const { checkIn } = await validateCheckInUseCase.execute({
			checkinId: createdCheckIn.id,
		});

		expect(checkIn.validated_at).toEqual(expect.any(Date));
		expect(checkInRepository.items[0].validated_at).toEqual(expect.any(Date));
	});

	it('should not be able to validate an non-existent check-in', async () => {
		await expect(() =>
			validateCheckInUseCase.execute({
				checkinId: 'non-existent-id',
			}),
		).rejects.toBeInstanceOf(ResourceNotFoundError);
	});

	it('should not be able to validate the check-in after 20 minutes of its creation', async () => {
		vi.setSystemTime(new Date(2026, 0, 1, 13, 40));

		const user = await usersRepository.create({
			name: 'John Doe',
			email: 'john.doe@example.com',
			password_hash: 'password',
		});

		const gym = await gymsRepository.create({
			name: 'Gym 1',
			latitude: -22.2786705,
			longitude: -48.5487406,
		});

		const createdCheckIn = await checkInRepository.create({
			userId: user.id,
			gymId: gym.id,
		});

		vi.advanceTimersByTime(21 * 60 * 1000); // 21 minutes

		await expect(() =>
			validateCheckInUseCase.execute({
				checkinId: createdCheckIn.id,
			}),
		).rejects.toBeInstanceOf(LateCheckInValidationError);
	});
});
