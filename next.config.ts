import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "**",
      },
    ],
  },
  // Enable caching for better performance and reduced edge requests
  experimental: {
    staleTimes: {
      dynamic: 30, // 30 seconds for dynamic routes
      static: 180, // 3 minutes for static routes
    },
  },
  // Keystatic's reader loads content from the filesystem at runtime.
  // Ensure guide MDX content is included in the Vercel server bundle.
  outputFileTracingIncludes: {
    "/**/*": ["./src/content/guides/**/*"],
  },
}

export default nextConfig
