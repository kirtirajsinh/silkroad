import { prisma } from "~/lib/prisma";

export async function POST(request: Request) {
    const body = await request.json();

    try {
        const user = await prisma.user.upsert({
            where: {
                address: body.address,
            },
            update: {},
            create: {
                address: body.address,
            },
        });
        return new Response(JSON.stringify(user), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });

    }
    catch (error) {
        console.log(error);
        return new Response(JSON.stringify(error), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
}