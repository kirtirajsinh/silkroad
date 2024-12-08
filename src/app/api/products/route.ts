import { prisma } from "~/lib/prisma";

export async function GET(request: Request) {

    const products = await prisma.product.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });
    console.log(products);
    return new Response(JSON.stringify(products));
}