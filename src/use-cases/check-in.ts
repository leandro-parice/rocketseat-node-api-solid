import type {
	CheckIn,
	CheckInsRepository,
} from '@/repositories/check-ins-repository.js';
import type { GymsRepository } from '@/repositories/gyms-repository.js';
import { ResourceNotFoundError } from './errors/resource-not-found-error.js';
import type { Decimal } from '@prisma/client/runtime/index-browser';
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates.js';

interface CheckInUseCaseRequest {
	userId: string;
	gymId: string;
	userLatitude: Decimal;
	userLongitude: Decimal;
}

interface CheckInUseCaseResponse {
	checkIn: CheckIn;
}

export class CheckInUseCase {
	constructor(
		private checkInsRepository: CheckInsRepository,
		private gymsRepository: GymsRepository,
	) {}

	async execute({
		userId,
		gymId,
		userLatitude,
		userLongitude,
	}: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
		const gym = await this.gymsRepository.findById(gymId);

		if (!gym) {
			throw new ResourceNotFoundError();
		}

		const checkInOnSameDate = await this.checkInsRepository.findByUserIdOnDate(
			userId,
			new Date(),
		);

		if (checkInOnSameDate) {
			throw new Error('User already checked in today.');
		}

		const distance = getDistanceBetweenCoordinates(
			{
				latitude: userLatitude.toNumber(),
				longitude: userLongitude.toNumber(),
			},
			{
				latitude: gym.latitude.toNumber(),
				longitude: gym.longitude.toNumber(),
			},
		);

		const MAX_DISTANCE_IN_KILOMETERS = 0.1;

		if (distance > MAX_DISTANCE_IN_KILOMETERS) {
			throw new Error('User is too far from the gym.');
		}

		const checkIn = await this.checkInsRepository.create({ userId, gymId });

		return { checkIn };
	}
}
