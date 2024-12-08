"use client";
import React from "react";
import dynamic from "next/dynamic";

const ProductPage = dynamic(() => import("~/components/ProductPage"), {
  ssr: false,
});

const page = () => {
  return (
    <div>
      <ProductPage />
    </div>
  );
};

export default page;
