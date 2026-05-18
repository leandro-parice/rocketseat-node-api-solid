export interface CheckIn {
	id: string;
	userId: string;
	gymId: string;
	created_at: Date;
	validated_at?: Date | null;
}

export interface CheckInCreateData {
	userId: string;
	gymId: string;
	validated_at?: Date | null;
}

export interface CheckInsRepository {
	findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>;
	findManyByUserId(userId: string, page: number): Promise<CheckIn[]>;
	countByUserId(userId: string): Promise<number>;
	create(data: CheckInCreateData): Promise<CheckIn>;
}
