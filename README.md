# LLWeb — Site vitrine

Site vitrine de **LLWeb**, agence web pour les **artisans, commerces et producteurs**
(Strasbourg & toute la France).

Construit avec **[Astro](https://astro.build)** : composants partagés (header,
footer) définis une seule fois, sortie 100 % statique déployée sur Vercel.

## Structure

| Chemin | Rôle |
|---|---|
| `src/layouts/Base.astro` | `<head>` SEO + header + footer + scripts communs |
| `src/layouts/Legal.astro` | Gabarit des pages légales |
| `src/components/` | `Header`, `Footer`, `CalScript` (RDV) |
| `src/pages/` | Les 8 pages (accueil, offres, portfolios, réalisations, contact, légales, 404) |
| `src/styles/global.css` | Design (palette bordeaux/or, typographie, responsive) |
| `public/script.js` | Menu mobile, animations, lightbox démo, formulaire |
| `public/` | Images, robots.txt, sitemap.xml |

Les URLs générées gardent l'extension `.html` (`build.format: "file"`), à
l'identique de l'ancien site : canonicals et sitemap inchangés.

## Lancer le site

```bash
npm install        # première fois seulement
npm run dev        # développement → http://localhost:4321
npm run build      # génère le site final dans dist/
npm run preview    # sert dist/ en local
```

Vercel détecte Astro automatiquement : un `git push` suffit pour déployer.

## Personnaliser

- **Couleurs** : variables `--wine-*`, `--gold`, `--cream`… en haut de `styles.css`.
- **Polices** : Cinzel (titres) + Josefin Sans (texte), chargées via Google Fonts dans `index.html`.
- **Textes** : tout est dans `index.html`, en français, prêt à être adapté.
- **Coordonnées** : e-mail officiel `contact@llweb.fr` ; mettez à jour le téléphone et l'adresse
  (présents dans la section Contact **et** le pied de page).
- **Réalisations** : remplacez les blocs « Aperçu du site » par vos captures d'écran
  (`<img src="..." alt="...">`) dans la section `#realisations`.
- **Logos clients** : section « Ils nous font confiance ».

## Prise de rendez-vous

Intégrée via **Cal.com** (`cal.com/llweb/appel-decouverte`) en popup : boutons
« Réserver un appel » dans la section Contact et le pied de page. Les RDV
atterrissent dans l'agenda Google partagé de l'équipe. Personnalisation du
widget : bloc `Cal.ns["appel-decouverte"]("ui", …)` en bas d'`index.html`.

## Formulaire de contact

Branché sur [Web3Forms](https://web3forms.com) (gratuit, 250 messages/mois) :
les demandes arrivent sur `contact@llweb.fr`. La clé d'accès se règle dans
`script.js` (constante `WEB3FORMS_ACCESS_KEY`). Un piège anti-spam (honeypot
`botcheck`) est intégré au formulaire.

## Mise en ligne

Site 100 % statique : déposez les trois fichiers sur n'importe quel hébergeur —
**Netlify**, **Vercel**, **Cloudflare Pages**, **GitHub Pages**, ou un hébergement
classique (OVH, o2switch…) par FTP.

## SEO — à faire au moment de la mise en ligne

Le site est optimisé (title/meta, Open Graph + image de partage, Twitter Cards,
JSON-LD `ProfessionalService`, robots.txt, sitemap.xml, favicon + apple-touch-icon).
Toutes les URLs pointent vers le domaine définitif **https://llweb.fr/** (sans www).

Checklist de mise en ligne :

1. **Vercel → Settings → Domains** : définir `llweb.fr` comme domaine principal
   et `www.llweb.fr` en redirection vers celui-ci (ajouter l'enregistrement DNS
   du `www` si Vercel le demande) ;
2. `git push` → Vercel redéploie ;
3. Vérifier que `https://llweb.fr/` répond en 200 (sans redirection), ainsi que
   `/robots.txt`, `/sitemap.xml` et `/images/og-image.png` ;
4. **Google Search Console** : ajouter la propriété `llweb.fr`, soumettre
   `sitemap.xml`, puis « Inspection d'URL » → *Demander une indexation* ;
5. Créer une fiche **Google Business Profile** (Strasbourg) — levier n°1 du
   référencement local ;
6. Vérifier l'aperçu de partage avec [opengraph.xyz](https://www.opengraph.xyz).

## À faire ensuite (idées)

- Ajouter de vraies photos (format WebP, avec `alt` descriptifs).
- Page « Réalisations » détaillée quand les premiers clients arrivent.
- Mentions légales et politique de confidentialité (RGPD).
