"use client";
import React, { useEffect } from "react";
import sdk from "@farcaster/frame-sdk";
import Link from "next/link";
import { Product } from "../../types/product";
import { ImageUrl } from "~/utils/consts";
import Image from "next/image";

interface ProductListProps {
  products: Product[];
}

const ProductList: React.FC<ProductListProps> = () => {
  const [context, setContext] = React.useState<any>();
  const [isSDKLoaded, setIsSDKLoaded] = React.useState(false);
  const [products, setProducts] = React.useState<Product[]>();

  useEffect(() => {
    const load = async () => {
      setContext(await sdk.context);
      sdk.actions.ready();
    };
    if (sdk && !isSDKLoaded) {
      setIsSDKLoaded(true);
      getProducts();
      load();
    }
  }, [isSDKLoaded]);

  const getProducts = async () => {
    const response = await fetch("/api/products");
    const productsJson = await response.json();
    setProducts(productsJson);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products?.map((product) => (
          <Link
            href={`/product/${product.id}`}
            key={product.id}
            className="group h-full"
          >
            <div className="flex flex-col h-full bg-white shadow-md rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="p-0">
                <div className="w-full md:max-w-[354px] md:max-h-[200px]">
                  <Image
                    src={
                      `${ImageUrl}/${product.coverImage}` ||
                      "/placeholder.svg?height=600&width=450"
                    }
                    alt={product.name}
                    className="object-cover w-full h-full rounded-t-lg transition-transform duration-300 group-hover:scale-105"
                    width={354}
                    height={185}
                  />
                </div>
              </div>
              <div className="flex-grow p-4">
                <h2 className="text-lg font-semibold mb-2 line-clamp-1">
                  {product.name}
                </h2>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {product.description}
                </p>
              </div>
              <div className="p-4 flex justify-between items-center">
                <span
                  className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                    product.price
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {product.price ? `${product.price} Ξ` : "Free"}
                </span>
                <span className="text-sm font-medium text-blue-600 flex items-center gap-1 group-hover:underline">
                  View Details
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 transition-transform group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
export default ProductList;
