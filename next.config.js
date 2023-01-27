const path = require("path");
const cron = require("node-cron");
const withTM = require("next-transpile-modules", [
  "./src/config/FirebaseFirestore.jsx",
]);
// const { storeViewStatistics } = require("./src/config/FirebaseFirestore");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  images: {
    domains: ["img.pokemondb.net", "firebasestorage.googleapis.com"],
  },
};

cron.schedule("1,15,30,45 * * * *", () => {
  console.log(process.env.NEXT_PUBLIC_DOMAIN);
  fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/generate-hourly-view`).then(
    (r) => {
      console.log("hourly view generated", r);
    }
  );
});

module.exports = nextConfig;
