import type {
	CheckIn,
	CheckInCreateData,
	CheckInsRepository,
} from '../check-ins-repository.js';
import { randomUUID } from 'node:crypto';

export class InMemoryCheckInsRepository implements CheckInsRepository {
	public items: CheckIn[] = [];

	async create(data: CheckInCreateData) {
		const checkIn = {
			id: randomUUID(),
			userId: data.userId,
			gymId: data.gymId,
			created_at: new Date(),
			validated_at: data.validated_at ? new Date(data.validated_at) : null,
		};

		this.items.push(checkIn);

		return checkIn;
	}
}
