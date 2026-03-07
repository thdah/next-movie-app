const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org", //allow images from tmdb
        pathname: "/t/p/**" //all image paths under /t/p
      }
    ]
  }
};

export default nextConfig;
