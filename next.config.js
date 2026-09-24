const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: path.join(__dirname),

  webpack: (config) => {
    config.context = __dirname;
    return config;
  },
};

module.exports = nextConfig;
