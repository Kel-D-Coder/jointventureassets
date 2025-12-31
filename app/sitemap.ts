 import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://www.jointventureassets.com',
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1
    },
    {
      url: 'https://www.jointventureassets.com/contact',
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8
    }
    // add more URLs here
  ];
}
