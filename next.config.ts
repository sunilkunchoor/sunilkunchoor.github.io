import type {NextConfig} from 'next';

const isGithubPages = process.env.GITHUB_ACTIONS === 'true';

const nextConfig: NextConfig = {
  /* config options here */
  output: isGithubPages ? 'export' : undefined,
  
  // Redirect Vercel visitors to the main GitHub Pages site, leaving /api/chat active
  async redirects() {
    if (isGithubPages) return [];
    return [
      {
        source: '/((?!api/chat).*)',
        destination: 'https://sunilkunchoor.github.io/$1',
        permanent: false,
      },
    ];
  },

  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true, // Required for static export on GitHub Pages
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
