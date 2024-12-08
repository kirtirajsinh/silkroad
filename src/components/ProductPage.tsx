"use client";
import React, { useEffect, useState } from "react";
import sdk from "@farcaster/frame-sdk";
import { usePathname, useSearchParams } from "next/navigation";
import { Product } from "../../types/product";
import Image from "next/image";
import { ImageUrl } from "~/utils/consts";
import { getProduct } from "~/app/api/actions/getproduct";
import { useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import { sendDirectCast } from "~/app/api/actions/senddirectcast";
import { parseEther } from "viem";

const ProductPage = () => {
  const [context, setContext] = React.useState<any>();
  const [isSDKLoaded, setIsSDKLoaded] = React.useState(false);
  const [product, setProduct] = React.useState<Product>();

  const [allImages, setAllImages] = React.useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [txHash, setTxHash] = useState<string | null>(null);
  const pathname = usePathname();
  const id = pathname?.split("/").pop();
  console.log(id, "id");
  const {
    sendTransaction,
    data,
    error: sendTxError,
    isError: isSendTxError,
    isPending: isSendTxPending,
  } = useSendTransaction();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: txHash,
    });

  const handleTransaction = async () => {
    try {
      if (!product?.price) {
        throw new Error("Product price is not available");
      }
      sendTransaction(
        {
          to: (product?.userAddress ||
            "0xUserWalletAddressHere") as `0x${string}`,
          value: BigInt(parseEther(product.price.toString()).toString()),
          chainId: context?.chainId || 84532,
        },
        {
          onSuccess: async (hash) => {
            setTxHash(hash);
            alert("Transaction sent successfully!");
            const sendproduct = await sendDirectCast(
              context.fid,
              "Product bought successfully"
            );
            console.log(sendproduct, "sendproduct");
          },
        }
      );
    } catch (error) {
      console.error("Transaction Error:", error);
    }
  };
  useEffect(() => {
    const load = async () => {
      setContext(await sdk.context);
      sdk.actions.ready();
    };
    if (sdk && !isSDKLoaded) {
      setIsSDKLoaded(true);
      load();
    }
  }, [isSDKLoaded]);

  useEffect(() => {
    if (id) {
      console.log(id, "id from usEfec=");
      getProductdetail(); // Fetch the product only when `id` is available
    }
  }, [id]);

  const getProductdetail = async () => {
    if (!id) return;
    console.log(id, "id from getproduct");

    try {
      const response = await fetch(`/api/getproduct?id=${id}`);
      if (!response.ok) throw new Error("Failed to fetch product details");
      const productJson = await response.json();
      setProduct(productJson);
      const allImages = productJson
        ? [productJson.coverImage, ...productJson.image]
        : [];
      setAllImages(allImages);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  return (
    <div className="container mx-auto p-2 sm:p-4">
      <div className="w-full max-w-4xl mx-auto border rounded-lg shadow-md">
        {/* Header */}
        <div className="space-y-2 p-4 sm:p-6">
          <h1 className="text-xl sm:text-3xl font-bold break-words">
            {product?.name}
          </h1>
          <span className="inline-block px-2 py-1 text-sm sm:text-base font-medium text-white bg-blue-600 rounded">
            ${product?.price} Ξ
          </span>
        </div>

        {/* Carousel */}
        <div className="p-2 sm:p-6">
          <div className="w-full max-w-xl mx-auto relative">
            <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hidden">
              {allImages?.map((image, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 snap-center w-full"
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <div className="p-1">
                    <div className="flex aspect-square items-center justify-center p-2 sm:p-6">
                      <Image
                        src={image ? `${ImageUrl}/${image}` : ""}
                        alt={`Product image ${index + 1}`}
                        className="w-full h-full rounded-lg object-contain"
                        width={500}
                        height={500}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-white p-2 rounded-full shadow hidden sm:block"
              onClick={() =>
                setCurrentImageIndex(
                  (currentImageIndex - 1 + allImages.length) % allImages.length
                )
              }
            >
              &larr;
            </button>
            <button
              className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-white p-2 rounded-full shadow hidden sm:block"
              onClick={() =>
                setCurrentImageIndex((currentImageIndex + 1) % allImages.length)
              }
            >
              &rarr;
            </button>
          </div>
          <div className="flex justify-center mt-2">
            <p className="text-xs sm:text-sm text-gray-500">
              Image {currentImageIndex + 1} of {allImages.length}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="p-2 sm:p-6">
          <div className="w-full">
            <div className="grid grid-cols-2">
              <button
                className={`py-2 text-sm sm:text-base border-b ${
                  currentImageIndex === 0
                    ? "border-blue-600"
                    : "border-gray-300"
                }`}
                onClick={() => setCurrentImageIndex(0)}
              >
                Description
              </button>
              <button
                className={`py-2 text-sm sm:text-base border-b ${
                  currentImageIndex === 1
                    ? "border-blue-600"
                    : "border-gray-300"
                }`}
                onClick={() => setCurrentImageIndex(1)}
              >
                Details
              </button>
            </div>
            <div className="h-[150px] sm:h-[200px] w-full rounded-md border p-2 sm:p-4 mt-2 overflow-y-auto">
              {currentImageIndex === 0 ? (
                <p className="text-sm sm:text-base">{product?.description}</p>
              ) : (
                <ul className="space-y-2 text-sm sm:text-base">
                  <li>
                    <strong>Created:</strong>{" "}
                    {product?.createdAt
                      ? new Date(product.createdAt).toLocaleDateString()
                      : "N/A"}
                  </li>
                  <li>
                    <strong>Wallet Address:</strong>{" "}
                    <span className="break-all">{product?.walletAddress}</span>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between p-4 sm:p-6">
          <button
            className="w-full sm:w-auto text-sm sm:text-base bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={handleTransaction}
            disabled={isSendTxLoading || isConfirming}
          >
            {isSendTxLoading || isConfirming
              ? "Processing..."
              : "Buy the Product"}
          </button>
        </div>
      </div>
    </div>
  );
};
export default ProductPage;
