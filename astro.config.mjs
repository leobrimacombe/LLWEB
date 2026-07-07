import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://llweb.fr",
  // Génère des fichiers offres.html, contact.html… : les URLs restent
  // identiques à l'ancien site statique (canonicals et sitemap inchangés).
  build: { format: "file" },
  compressHTML: true,
});
