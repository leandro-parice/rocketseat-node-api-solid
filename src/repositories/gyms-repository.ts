export interface Gym {
	id: string;
	name: string;
	description?: string | null;
	phone?: string | null;
	latitude: number;
	longitude: number;
	created_at: Date;
}

export interface GymCreateData {
	name: string;
	description?: string | null | undefined;
	phone?: string | null | undefined;
	latitude: number;
	longitude: number;
}

export interface GymsRepository {
	findById(id: string): Promise<Gym | null>;
	create(data: GymCreateData): Promise<Gym>;
}
