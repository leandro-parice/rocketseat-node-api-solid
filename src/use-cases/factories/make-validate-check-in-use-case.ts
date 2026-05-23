import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-in-repository.js';
import { ValidateCheckInUseCase } from '../validate-check-in.js';

export function makeValidateCheckInUseCase() {
	const checkInsRepository = new PrismaCheckInsRepository();
	const validateCheckInUseCase = new ValidateCheckInUseCase(checkInsRepository);

	return validateCheckInUseCase;
}
