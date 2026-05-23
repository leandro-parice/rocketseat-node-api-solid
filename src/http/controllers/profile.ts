import type { FastifyRequest, FastifyReply } from 'fastify';

export async function profile(request: FastifyRequest, reply: FastifyReply) {
	await request.jwtVerify();

	console.log('User ID:', request.user.sub);

	return reply.status(200).send();
}
