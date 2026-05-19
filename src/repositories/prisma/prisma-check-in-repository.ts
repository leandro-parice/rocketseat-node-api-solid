import { prisma } from '@/lib/prisma.js';
import type {
	CheckIn,
	CheckInCreateData,
	CheckInsRepository,
} from '../check-ins-repository.js';
import dayjs from 'dayjs';
import type { CheckIn as PrismaCheckIn } from 'generated/prisma/client.js';

export class PrismaCheckInsRepository implements CheckInsRepository {
	async findByUserIdOnDate(userId: string, date: Date) {
		const startOfTheDay = dayjs(date).startOf('date').toDate();
		const endOfTheDay = dayjs(date).endOf('date').toDate();

		const checkIn = await prisma.checkIn.findFirst({
			where: {
				user_id: userId,
				created_at: {
					gte: startOfTheDay,
					lte: endOfTheDay,
				},
			},
		});

		return checkIn ? this.toDomain(checkIn) : null;
	}

	async findManyByUserId(userId: string, page: number) {
		const itemsPerPage = 20;
		const checkIns = await prisma.checkIn.findMany({
			where: {
				user_id: userId,
			},
			skip: (page - 1) * itemsPerPage,
			take: itemsPerPage,
		});

		return checkIns.map(this.toDomain);
	}

	async countByUserId(userId: string) {
		return prisma.checkIn.count({
			where: {
				user_id: userId,
			},
		});
	}

	async create(data: CheckInCreateData) {
		const checkIn = await prisma.checkIn.create({
			data: {
				user_id: data.userId,
				gym_id: data.gymId,
				validated_at: data.validated_at ?? null,
			},
		});

		return this.toDomain(checkIn);
	}

	async findById(id: string) {
		const checkIn = await prisma.checkIn.findUnique({
			where: { id },
		});

		return checkIn ? this.toDomain(checkIn) : null;
	}

	async save(data: CheckIn) {
		await prisma.checkIn.update({
			where: { id: data.id },
			data: {
				validated_at: data.validated_at ?? null,
			},
		});
	}

	private toDomain(raw: PrismaCheckIn): CheckIn {
		return {
			id: raw.id,
			userId: raw.user_id,
			gymId: raw.gym_id,
			created_at: raw.created_at,
			validated_at: raw.validated_at,
		};
	}
}
