import type {
	CheckIn,
	CheckInsRepository,
} from '@/repositories/check-ins-repository.js';
import { ResourceNotFoundError } from './errors/resource-not-found-error.js';
import dayjs from 'dayjs';
import { LateCheckInValidationError } from './errors/late-check-in-validation-error.js';

interface ValidateCheckInUseCaseRequest {
	checkinId: string;
}

interface ValidateCheckInUseCaseResponse {
	checkIn: CheckIn;
}

export class ValidateCheckInUseCase {
	constructor(private checkInsRepository: CheckInsRepository) {}

	async execute({
		checkinId,
	}: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse> {
		const checkIn = await this.checkInsRepository.findById(checkinId);

		if (!checkIn) {
			throw new ResourceNotFoundError();
		}

		const distanceInMinutesFromCreation = dayjs(new Date()).diff(
			checkIn.created_at,
			'minutes',
		);

		if (distanceInMinutesFromCreation > 20) {
			throw new LateCheckInValidationError();
		}

		checkIn.validated_at = new Date();

		await this.checkInsRepository.save(checkIn);

		return {
			checkIn,
		};
	}
}
