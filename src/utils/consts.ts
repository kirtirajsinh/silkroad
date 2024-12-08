export const ImageUrl = "https://pub-b8acacbdf4c34874a29a2fdaab996f29.r2.dev";
const isProduction = process.env.NODE_ENV === "production";

export const NEXT_PUBLIC_URL = isProduction
    ? "https://silkroad.vercel.app/"
    : "https://msi-1.tail6cd562.ts.net/";

export const redeemImage =
    "https://pub-b8acacbdf4c34874a29a2fdaab996f29.r2.dev/redeem.jpg";

export const notPaidImage =
    "https://pub-b8acacbdf4c34874a29a2fdaab996f29.r2.dev/no%20product%20found.png";
export const errorImage =
    "https://pub-b8acacbdf4c34874a29a2fdaab996f29.r2.dev/error.jpg";

export const messageTemplate =
    "gm. Here goes your Product. Have a good day & dont forgot to follow @randomai for the Alpha";