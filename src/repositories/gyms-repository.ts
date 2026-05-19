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
	description?: string | null;
	phone?: string | null;
	latitude: number;
	longitude: number;
}

export interface FindManyNearbyParams {
	latitude: number;
	longitude: number;
}

export interface GymsRepository {
	findById(id: string): Promise<Gym | null>;
	create(data: GymCreateData): Promise<Gym>;
	searchMany(query: string, page: number): Promise<Gym[]>;
	findManyNearby(params: FindManyNearbyParams): Promise<Gym[]>;
}
