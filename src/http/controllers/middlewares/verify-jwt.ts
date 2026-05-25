import type { FastifyReply, FastifyRequest } from 'fastify';

export async function verifyJwt(request: FastifyRequest, reply: FastifyReply) {
	try {
		await request.jwtVerify();
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (err) {
		return reply.status(401).send({ message: 'Unauthorized' });
	}
}
