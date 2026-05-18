import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository.js';
import { SearchGymsUseCase } from './search-gyms.js';

let gymRepository: InMemoryGymsRepository;
let searchGymsUseCase: SearchGymsUseCase;

describe('Search Gyms Use Case', () => {
	beforeEach(async () => {
		gymRepository = new InMemoryGymsRepository();
		searchGymsUseCase = new SearchGymsUseCase(gymRepository);
	});

	it('should be able to search gyms', async () => {
		const gym1 = await gymRepository.create({
			name: 'Javascript Gym',
			description: 'Description for Gym 1',
			phone: '123456789',
			latitude: 0,
			longitude: 0,
		});

		const gym2 = await gymRepository.create({
			name: 'TypeScript Gym',
			description: 'Description for Gym 2',
			phone: '123456789',
			latitude: 0,
			longitude: 0,
		});

		const { gyms } = await searchGymsUseCase.execute({
			query: 'TypeScript',
			page: 1,
		});

		expect(gyms).toHaveLength(1);
		expect(gyms).toEqual([
			expect.objectContaining({
				id: gym2.id,
				name: gym2.name,
			}),
		]);
	});

	it('should be able to fetch paginated gyms search', async () => {
		for (let i = 1; i <= 22; i++) {
			await gymRepository.create({
				name: `Javascript Gym ${i}`,
				description: `Description for Gym ${i}`,
				phone: '123456789',
				latitude: 0,
				longitude: 0,
			});
		}

		const { gyms } = await searchGymsUseCase.execute({
			query: 'Javascript',
			page: 2,
		});

		expect(gyms).toHaveLength(2);
		expect(gyms).toEqual([
			expect.objectContaining({ name: 'Javascript Gym 21' }),
			expect.objectContaining({ name: 'Javascript Gym 22' }),
		]);
	});
});
