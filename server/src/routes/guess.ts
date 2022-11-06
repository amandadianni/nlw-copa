import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { authenticate } from "../plugins/authenticate";

export async function guessRoutes(fastify: FastifyInstance) {
    fastify.get('/guesses/count', async () => {
        const count = await prisma.guess.count();
        return { count };
    });

    fastify.post('/pools/:poolId/games/:gameId/guesses', {
        onRequest: [authenticate]
    }, async (request, reply) => {
        const guessParams = z.object({
            poolId: z.string(),
            gameId: z.string(),
        });
        const guessBody = z.object({
            firstTeamPoints: z.number(),
            secondTeamPoints: z.number(),
        });
        const { poolId, gameId } = guessParams.parse(request.params);
        const { firstTeamPoints, secondTeamPoints } = guessBody.parse(request.body);


        const participant = await prisma.participant.findUnique({
            where: {
                userId_poolId: {
                    poolId,
                    userId: request.user.sub,
                },
            },
        });

        if (!participant) {
            return reply.status(400).send({
                message: 'You are not allowed to create a guess inside this pool.'
            });
        }

        const guess = await prisma.guess.findUnique({
            where: {
                participantId_gameId: {
                    participantId: participant.id,
                    gameId,
                },
            },
        });

        if (guess) {
            return reply.status(400).send({
                message: 'You already have a guess for this game on this pool.'
            });
        }

        const game = await prisma.game.findUnique({
            where: {
                id: gameId,
            },
        });

        if (!game) {
            return reply.status(404).send({
                message: 'Game not found.'
            });
        }

        if (game.date < new Date()) {
            return reply.status(400).send({
                message: 'You cannot create a guess after the game date.'
            });
        }

        await prisma.guess.create({
            data: {
                gameId,
                participantId: participant.id,
                firstTeamPoints,
                secondTeamPoints,
            },
        });


        return reply.status(201).send();
    });
}