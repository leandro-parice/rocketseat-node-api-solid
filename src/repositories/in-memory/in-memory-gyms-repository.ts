import { randomUUID } from 'node:crypto';
import type { Gym, GymCreateData, GymsRepository } from '../gyms-repository.js';

export class InMemoryGymsRepository implements GymsRepository {
	public items: Gym[] = [];

	async findById(id: string) {
		const gym = this.items.find((item) => item.id === id);
		if (!gym) {
			return null;
		}
		return gym;
	}

	async create(data: GymCreateData) {
		const gym = {
			id: randomUUID(),
			name: data.name,
			description: data.description ?? null,
			phone: data.phone ?? null,
			latitude: data.latitude,
			longitude: data.longitude,
			created_at: new Date(),
		};

		this.items.push(gym);

		return gym;
	}

	async searchMany(query: string, page: number) {
		const perPage = 20;
		return this.items
			.filter((gym) => gym.name.toLowerCase().includes(query.toLowerCase()))
			.slice((page - 1) * perPage, page * perPage);
	}
}
