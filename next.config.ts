import type { NextConfig } from "next";

const isStaticExport = "true";

const nextConfig: NextConfig = {
  /* config options here */
  trailingSlash: false,
  env: {
    BUILD_STATIC_EXPORT: isStaticExport,
  },
  modularizeImports: {
    "@mui/icons-material": {
      transform: "@mui/icons-material/{{member}}",
    },
    "@mui/material": {
      transform: "@mui/material/{{member}}",
    },
    "@mui/lab": {
      transform: "@mui/lab/{{member}}",
    },
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  ...(isStaticExport === "true" && {
    output: "export",
  }),
};

export default nextConfig;
