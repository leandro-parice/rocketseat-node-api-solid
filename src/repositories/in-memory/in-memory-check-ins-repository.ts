import dayjs from 'dayjs';
import type {
	CheckIn,
	CheckInCreateData,
	CheckInsRepository,
} from '../check-ins-repository.js';
import { randomUUID } from 'node:crypto';

export class InMemoryCheckInsRepository implements CheckInsRepository {
	public items: CheckIn[] = [];

	async findByUserIdOnDate(userId: string, date: Date) {
		const startOfTheDay = dayjs(date).startOf('date');
		const endOfTheDay = dayjs(date).endOf('date');

		const checkInOnSameDate = this.items.find((checkIn) => {
			const isSameUser = checkIn.userId === userId;

			const checkinDate = dayjs(checkIn.created_at);
			const isSameDate =
				checkinDate.isAfter(startOfTheDay) && checkinDate.isBefore(endOfTheDay);

			return isSameUser && isSameDate;
		});
		return checkInOnSameDate || null;
	}

	async findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
		const perPage = 20;
		return this.items
			.filter((checkIn) => checkIn.userId === userId)
			.slice((page - 1) * perPage, page * perPage);
	}

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
