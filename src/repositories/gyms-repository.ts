import type { Decimal } from '@prisma/client/runtime/index-browser';

export interface Gym {
	id: string;
	name: string;
	description?: string | null;
	phone?: string | null;
	latitude: Decimal;
	longitude: Decimal;
	created_at: Date;
}

export interface GymCreateData {
	name: string;
	description?: string | null;
	phone?: string | null;
	latitude: Decimal;
	longitude: Decimal;
}

export interface GymsRepository {
	findById(id: string): Promise<Gym | null>;
}
