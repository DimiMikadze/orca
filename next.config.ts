import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['langchain', '@langchain/openai', '@langchain/langgraph', '@langchain/core'],
};

export default nextConfig;
