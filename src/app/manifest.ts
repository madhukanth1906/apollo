import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Apollo Inspection Tool',
    short_name: 'Apollo',
    description: 'Central Inspection Log & Digital Repository for Legal Metrology',
    start_url: '/',
    display: 'standalone',
    background_color: '#0B2852',
    theme_color: '#0B2852',
    icons: [
      {
        src: '/icon-192x192.jpg',
        sizes: '192x192',
        type: 'image/jpeg',
      },
      {
        src: '/icon-512x512.jpg',
        sizes: '512x512',
        type: 'image/jpeg',
      },
    ],
  }
}
