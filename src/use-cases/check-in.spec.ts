import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository.js';

import { CheckInUseCase } from './check-in.js';

let checkInRepository: InMemoryCheckInsRepository;
let checkInUseCase: CheckInUseCase;

describe('Check In Use Case', () => {
	beforeEach(() => {
		checkInRepository = new InMemoryCheckInsRepository();
		checkInUseCase = new CheckInUseCase(checkInRepository);
	});

	it('should be able to check in', async () => {
		const userId = 'user-1';
		const gymId = 'gym-1';

		const { checkIn } = await checkInUseCase.execute({
			userId,
			gymId,
		});

		expect(checkIn.id).toEqual(expect.any(String));
	});
});
