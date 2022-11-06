import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const user = await prisma.user.create({
        data: {
            name: 'John Doe',
            email: 'johndoe@example.com',
            avatarUrl: 'https://github.com/fiego3g.png',
        }
    })

    const pool = await prisma.pool.create({
        data: {
            code: 'POOL123',
            title: 'Example Pool',
            ownerId: user.id,

            participants: {
                create: {
                    userId: user.id
                }
            },
        }
    })

    await prisma.game.create({
        data: {
            date: '2022-11-02T18:00:00.862Z',
            firstTeamCountryCode: 'DE',
            secondTeamCountryCode: 'BR',
        }
    })

    await prisma.game.create({
        data: {
            date: '2022-11-03T18:00:00.862Z',
            firstTeamCountryCode: 'BR',
            secondTeamCountryCode: 'AR',

            guesses: {
                create: {
                    firstTeamPoints: 2,
                    secondTeamPoints: 1,
                    participant: {
                        connect: {
                            userId_poolId: {
                                userId: user.id,
                                poolId: pool.id,
                            }
                        }
                    }
                }
            },
        }
    })
}

main()