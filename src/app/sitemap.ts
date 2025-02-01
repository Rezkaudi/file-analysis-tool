import { MetadataRoute } from 'next';

// baseUrl
import { baseUrl } from '@/utils/baseUrl';

export default function sitemap(): MetadataRoute.Sitemap {
    // Static URLs
    const staticUrls: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date().toISOString(),
            changeFrequency: "daily",
            priority: 1.0,
        },
        {
            url: `${baseUrl}/analysis`,
            lastModified: new Date().toISOString(),
            changeFrequency: "daily",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/analysis-old`,
            lastModified: new Date().toISOString(),
            changeFrequency: "daily",
            priority: 0.8,
        },
    ];

    return [
        ...staticUrls
    ];
}
