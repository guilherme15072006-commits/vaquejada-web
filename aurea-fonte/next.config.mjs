/** @type {import('next').NextConfig} */
// No GitHub Pages o site fica em /<repo>/; BASE_PATH vem do workflow.
const basePath = process.env.BASE_PATH || '';
const nextConfig = { reactStrictMode: true, output: 'export', images: { unoptimized: true }, trailingSlash: true, basePath, env: { NEXT_PUBLIC_BASE_PATH: basePath } };
export default nextConfig;
