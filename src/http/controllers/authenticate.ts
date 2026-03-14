import z from 'zod';
import type { FastifyRequest, FastifyReply } from 'fastify';
import { RegisterUseCase } from '@/use-cases/register.js';
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository.js';
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error.js';
import { AuthenticateUseCase } from '@/use-cases/authenticate.js';
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error.js';

export async function authenticate(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const authenticateBodySchema = z.object({
		email: z.email(),
		password: z.string().min(6),
	});

	const { email, password } = authenticateBodySchema.parse(request.body);

	try {
		const userRepository = new PrismaUsersRepository();
		const authenticateUseCase = new AuthenticateUseCase(userRepository);

		await authenticateUseCase.execute({
			email,
			password,
		});
	} catch (err) {
		if (err instanceof InvalidCredentialsError) {
			return reply.status(400).send({ message: err.message });
		}

		throw err;
	}

	return reply.status(200).send();
}
