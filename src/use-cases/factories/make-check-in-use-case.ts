import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository.js';
import { CheckInUseCase } from '../check-in.js';
import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-in-repository.js';

export function makeCheckInUseCase() {
	const checkInsRepository = new PrismaCheckInsRepository();
	const gymsRepository = new PrismaGymsRepository();
	const checkInUseCase = new CheckInUseCase(checkInsRepository, gymsRepository);

	return checkInUseCase;
}
