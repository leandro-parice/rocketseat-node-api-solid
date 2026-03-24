import type {
	CheckIn,
	CheckInsRepository,
} from '@/repositories/check-ins-repository.js';
import type { GymsRepository } from '@/repositories/gyms-repository.js';
import { ResourceNotFoundError } from './errors/resource-not-found-error.js';
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates.js';
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error.js';
import { MaxDistanceError } from './errors/max-distance-error.js';

interface CheckInUseCaseRequest {
	userId: string;
	gymId: string;
	userLatitude: number;
	userLongitude: number;
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
			throw new MaxNumberOfCheckInsError();
		}

		const distance = getDistanceBetweenCoordinates(
			{
				latitude: userLatitude,
				longitude: userLongitude,
			},
			{
				latitude: gym.latitude,
				longitude: gym.longitude,
			},
		);

		const MAX_DISTANCE_IN_KILOMETERS = 0.1;

		if (distance > MAX_DISTANCE_IN_KILOMETERS) {
			throw new MaxDistanceError();
		}

		const checkIn = await this.checkInsRepository.create({ userId, gymId });

		return { checkIn };
	}
}
