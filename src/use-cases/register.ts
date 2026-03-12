import { prisma } from '@/lib/prisma.js';
import { hash as bcryptHash } from 'bcryptjs';

interface RegisterUseCaseRequest {
	name: string;
	email: string;
	password: string;
}

export async function registerUseCase({
	name,
	email,
	password,
}: RegisterUseCaseRequest) {
	const password_hash = await bcryptHash(password, 6);

	const userWithSameEmail = await prisma.user.findUnique({
		where: {
			email,
		},
	});

	if (userWithSameEmail) {
		throw new Error('Email already in use.');
	}

	await prisma.user.create({
		data: {
			name,
			email,
			password_hash,
		},
	});
}
