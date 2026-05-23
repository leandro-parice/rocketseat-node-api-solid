import { GetUserMetricsUseCase } from '../get-user-metrics.js';
import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-in-repository.js';

export function makeGetUserMetricsUseCase() {
	const checkInsRepository = new PrismaCheckInsRepository();
	const getUserMetricsUseCase = new GetUserMetricsUseCase(checkInsRepository);

	return getUserMetricsUseCase;
}
