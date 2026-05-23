import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository.js';
import { GetUserProfileUseCase } from '../get-user-profile.js';

export function makeGetUserProfileUseCase() {
	const userRepository = new PrismaUsersRepository();
	const getUserProfileUseCase = new GetUserProfileUseCase(userRepository);

	return getUserProfileUseCase;
}
