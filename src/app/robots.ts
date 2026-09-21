export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/"],
    },
    sitemap:
      "https://ai-agent-app-first-7dk46qtlt-xywihis-projects.vercel.app/sitemap.xml",
  };
}
