import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://www.jointventureassets.com/',
      lastModified: new Date(),
    },
    // add more URLs here
  ];
}
