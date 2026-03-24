import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository.js';
import { CreateGymUseCase } from './create-gym.js';

let gymsRepository: InMemoryGymsRepository;
let createGymUseCase: CreateGymUseCase;

describe('Create Gym Use Case', () => {
	beforeEach(() => {
		gymsRepository = new InMemoryGymsRepository();
		createGymUseCase = new CreateGymUseCase(gymsRepository);
	});

	it('should be able to create a gym', async () => {
		const { gym } = await createGymUseCase.execute({
			name: 'Gym Name',
			description: 'Gym Description',
			phone: '123456789',
			latitude: -22.2786705,
			longitude: -48.5487406,
		});

		expect(gym.id).toEqual(expect.any(String));
	});
});
