import type { MetadataRoute } from "next";

const ROUTES = [
  "",
  "/services",
  "/sectors",
  "/about",
  "/careers",
  "/careers/apply",
  "/careers/status",
  "/contact",
  "/legal",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://matsikaprotective.co.za";
  const now = new Date();
  return ROUTES.map((route) => ({
    url: `${base}${route}`,
    lastModified: now,
    changeFrequency: route === "/careers" ? "daily" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
