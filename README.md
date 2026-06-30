# LLWeb — Site vitrine

Site vitrine de **LLWeb**, agence web spécialisée pour les **vignerons et domaines viticoles**.

Base statique, sans framework ni outil de build : trois fichiers, ça s'ouvre dans
n'importe quel navigateur et ça s'héberge partout.

## Fichiers

| Fichier | Rôle |
|---|---|
| `index.html` | Structure et contenu de la page |
| `styles.css` | Design (palette terroir, typographie, responsive) |
| `script.js` | Menu mobile, animations, formulaire |

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

## À faire ensuite (idées)

- Ajouter de vraies photos de domaines et de vignes (format WebP, avec `alt`).
- Page « Réalisations » détaillée et étude de cas par projet.
- Mentions légales et politique de confidentialité (RGPD).
- Données structurées `schema.org` (`LocalBusiness`) pour le référencement.
