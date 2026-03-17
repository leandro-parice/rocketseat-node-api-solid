import { prisma } from '@/lib/prisma.js';
import type {
	User,
	UserCreateData,
	UsersRepository,
} from '../users-repository.js';

export class PrismaUsersRepository implements UsersRepository {
	async findByEmail(email: string) {
		const user = await prisma.user.findUnique({
			where: {
				email,
			},
		});

		return user ? this.mapToDomain(user) : null;
	}

	async findById(id: string) {
		const user = await prisma.user.findUnique({
			where: {
				id,
			},
		});

		return user ? this.mapToDomain(user) : null;
	}

	async create(data: UserCreateData) {
		const user = await prisma.user.create({
			data,
		});

		return this.mapToDomain(user);
	}

	private mapToDomain(user: User): User {
		return {
			id: user.id,
			name: user.name,
			email: user.email,
			password_hash: user.password_hash,
			created_at: user.created_at,
		};
	}
}
