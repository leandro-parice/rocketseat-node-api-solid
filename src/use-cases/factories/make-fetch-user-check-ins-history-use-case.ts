import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-in-repository.js';
import { FetchUserCheckInHistoryUseCase } from '../fetch-user-check-ins-history.js';

export function makeFetchUserCheckInsHistoryUseCase() {
	const checkInsRepository = new PrismaCheckInsRepository();
	const fetchUserCheckInsHistoryUseCase = new FetchUserCheckInHistoryUseCase(
		checkInsRepository,
	);

	return fetchUserCheckInsHistoryUseCase;
}
