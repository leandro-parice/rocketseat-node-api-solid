import type { User, UsersRepository } from '@/repositories/users-repository.js';
import { ResourceNotFoundError } from './errors/resource-not-found-error.js';

interface GetUserProfileRequest {
	userId: string;
}

interface GetUserProfileResponse {
	user: User;
}

export class GetUserProfileUseCase {
	constructor(private usersRepository: UsersRepository) {}

	async execute({
		userId,
	}: GetUserProfileRequest): Promise<GetUserProfileResponse> {
		const user = await this.usersRepository.findById(userId);

		if (!user) {
			throw new ResourceNotFoundError();
		}

		return { user };
	}
}
