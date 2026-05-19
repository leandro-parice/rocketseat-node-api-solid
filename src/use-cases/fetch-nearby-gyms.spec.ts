import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository.js';
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms.js';

let gymRepository: InMemoryGymsRepository;
let fetchNearbyGymsUseCase: FetchNearbyGymsUseCase;

describe('Fetch Nearby Gyms Use Case', () => {
	beforeEach(async () => {
		gymRepository = new InMemoryGymsRepository();
		fetchNearbyGymsUseCase = new FetchNearbyGymsUseCase(gymRepository);
	});

	it('should be able to fetch nearby gyms', async () => {
		const gym1 = await gymRepository.create({
			name: 'Gym 1',
			latitude: -22.2798486,
			longitude: -48.1230795,
		});

		const gym2 = await gymRepository.create({
			name: 'Gym 2',
			latitude: -22.2786779,
			longitude: -48.5516723,
		});

		const { gyms } = await fetchNearbyGymsUseCase.execute({
			userLatitude: -22.2786705,
			userLongitude: -48.5487406,
		});

		expect(gyms).toHaveLength(1);
		expect(gyms).toEqual(
			expect.arrayContaining([expect.objectContaining({ name: 'Gym 2' })]),
		);
	});
});
