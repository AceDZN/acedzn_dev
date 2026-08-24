import { MetadataRoute } from "next";
import { getAllProjectSlugs } from "../lib/projects";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_MAIN_APP_URL || "https://www.acedzn.dev";
  const lastModified = new Date();

  const basePages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${baseUrl}/en`,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${baseUrl}/he`,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];

  // Projects listing pages
  const projectListingPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/en/projects`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/he/projects`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
  ];

  // Individual project pages
  const slugs = await getAllProjectSlugs();
  const individualProjectPages: MetadataRoute.Sitemap = slugs.flatMap(
    (slug) => [
      {
        url: `${baseUrl}/en/projects/${slug}`,
        lastModified,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/he/projects/${slug}`,
        lastModified,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      },
    ],
  );

  // Blog pages
  const blogPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/en/blog`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/he/blog`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
  ];

  return [
    ...basePages,
    ...projectListingPages,
    ...individualProjectPages,
    ...blogPages,
  ];
}
