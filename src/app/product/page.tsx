"use client";
import React from "react";
import dynamic from "next/dynamic";

const ProductList = dynamic(() => import("~/components/ProductList"), {
  ssr: false,
});

// const getProducts = async () => {
//   const products = await prisma.product.findMany({
//     orderBy: {
//       createdAt: "desc",
//     },
//   });
//   console.log(products);
//   return products;
// };

const page = () => {
  return (
    <div>
      <ProductList products={[]} />
    </div>
  );
};

export default page;
