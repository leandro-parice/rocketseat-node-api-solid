import type {
	User,
	UserCreateData,
	UsersRepository,
} from '../users-repository.js';
import { randomUUID } from 'node:crypto';

export class InMemoryUsersRepository implements UsersRepository {
	public items: User[] = [];

	async findByEmail(email: string) {
		const user = this.items.find((item) => item.email === email);
		if (!user) {
			return null;
		}
		return user;
	}

	async create(data: UserCreateData) {
		const user = {
			id: randomUUID(),
			name: data.name,
			email: data.email,
			password_hash: data.password_hash,
			created_at: new Date(),
		};

		this.items.push(user);

		return user;
	}
}
