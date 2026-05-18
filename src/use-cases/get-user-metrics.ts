import type {
	CheckIn,
	CheckInsRepository,
} from '@/repositories/check-ins-repository.js';

interface GetUserMetricsRequest {
	userId: string;
}

interface GetUserMetricsResponse {
	checkInsCount: number;
}

export class GetUserMetricsUseCase {
	constructor(private checkInsRepository: CheckInsRepository) {}

	async execute({
		userId,
	}: GetUserMetricsRequest): Promise<GetUserMetricsResponse> {
		const checkInsCount = await this.checkInsRepository.countByUserId(userId);

		return { checkInsCount };
	}
}
