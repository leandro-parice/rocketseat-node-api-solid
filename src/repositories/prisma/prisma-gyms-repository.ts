import { prisma } from '@/lib/prisma.js';
import type {
	FindManyNearbyParams,
	Gym,
	GymCreateData,
	GymsRepository,
} from '../gyms-repository.js';
import type { Gym as PrismaGym } from 'generated/prisma/client.js';

export class PrismaGymsRepository implements GymsRepository {
	async findById(id: string) {
		const gym = await prisma.gym.findUnique({ where: { id } });
		return gym ? this.toDomain(gym) : null;
	}

	async create(data: GymCreateData) {
		const gym = await prisma.gym.create({ data });
		return this.toDomain(gym);
	}

	async searchMany(query: string, page: number) {
		const itemsPerPage = 20;
		const gyms = await prisma.gym.findMany({
			where: { name: { contains: query } },
			skip: (page - 1) * itemsPerPage,
			take: itemsPerPage,
		});
		return gyms.map(this.toDomain);
	}

	async findManyNearby({ latitude, longitude }: FindManyNearbyParams) {
		const gyms = await prisma.$queryRaw<PrismaGym[]>`
      SELECT * from gyms
      WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
    `;

		return gyms.map(this.toDomain);
	}

	private toDomain(raw: PrismaGym): Gym {
		return {
			...raw,
			latitude: raw.latitude.toNumber(),
			longitude: raw.longitude.toNumber(),
		};
	}
}
