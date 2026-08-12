import dns from 'node:dns'

// Some networks (common with certain routers/ISPs) have broken or partial IPv6
// connectivity. Node tries IPv6 addresses first by default, which then hangs
// until timeout before falling back to a working IPv4 address. This forces
// Node to prefer IPv4, avoiding that hang for outbound requests (e.g. to Neon).
dns.setDefaultResultOrder('ipv4first')

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig