/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: true,
    },
    images: {
        domains: ["localhost", "res.cloudinary.com", "via.placeholder.com"],
    },
    reactStrictMode: false,

}

module.exports = nextConfig
