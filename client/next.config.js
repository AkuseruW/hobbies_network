/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: true,
    },
    images: {
        domains: ["localhost","flowbite.s3.amazonaws.com", "res.cloudinary.com", "via.placeholder.com"],
    },
    reactStrictMode: false,

}

module.exports = nextConfig
