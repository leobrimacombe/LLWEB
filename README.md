# LLWeb — Site vitrine

Site vitrine de **LLWeb**, agence web pour les **artisans, commerces et producteurs**
(Strasbourg & toute la France).

Base statique, sans framework ni outil de build : ça s'ouvre dans
n'importe quel navigateur et ça s'héberge partout.

## Fichiers

| Fichier | Rôle |
|---|---|
| `index.html` | Structure et contenu de la page (+ SEO : meta, JSON-LD) |
| `styles.css` | Design (palette bordeaux/or, typographie, responsive) |
| `script.js` | Menu mobile, animations, lightbox démo, formulaire |
| `robots.txt` / `sitemap.xml` | Référencement |
| `images/` | Logos, favicon, image Open Graph |

## Lancer le site

Double-cliquez sur `index.html`, ou pour un rendu fidèle (polices, etc.) lancez un
petit serveur local :

```bash
# Python
python -m http.server 8000
# puis ouvrez http://localhost:8000
```

## Personnaliser

- **Couleurs** : variables `--wine-*`, `--gold`, `--cream`… en haut de `styles.css`.
- **Polices** : Cinzel (titres) + Josefin Sans (texte), chargées via Google Fonts dans `index.html`.
- **Textes** : tout est dans `index.html`, en français, prêt à être adapté.
- **Coordonnées** : remplacez `contact@llweb.fr`, le numéro de téléphone et l'adresse
  (présents dans la section Contact **et** le pied de page).
- **Réalisations** : remplacez les blocs « Aperçu du site » par vos captures d'écran
  (`<img src="..." alt="...">`) dans la section `#realisations`.
- **Logos clients** : section « Ils nous font confiance ».

## Formulaire de contact

Le formulaire est en mode démonstration (aucun e-mail n'est envoyé). Pour l'activer,
branchez un service dans `script.js` (voir le `TODO`), par exemple
[Formspree](https://formspree.io), [Web3Forms](https://web3forms.com) ou votre
propre API.

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
