import { prisma } from "~/lib/prisma";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url); // Extract query parameters
    const id = searchParams.get("id"); // Get the "id" parameter
    console.log(id, "id");
    if (!id) {
        return new Response(JSON.stringify({ error: "Product ID is required" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    const product = await prisma.product.findUnique({
        where: {
            id: id
        },
        include:
        {
            productFiles: true,
        }

    });


    console.log(product, "product");
    return new Response(JSON.stringify(product));
}