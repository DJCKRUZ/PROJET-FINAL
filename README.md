# Explorateur de Films — Projet Profil Final

Petit projet statique pour rechercher et explorer des films. Conçu pour être déployé sur GitHub Pages.

Fonctionnalités
- Grille responsive de films (cartes)
- Recherche (locale) et option d'intégration TMDB si vous ajoutez une clé API
- Fenêtre modale pour afficher les détails d'un film

Fichiers créés
- Index.html — page principale
- css/style.css — styles
- js/app.js — logique JS (échantillons + intégration TMDB facultative)
- images/*.svg — posters d'exemple
- SPEC.md — courte spécification

Spécial: utilisation de l'API The Movie Database (TMDB)
1. Créez un compte TMDB et récupérez une clé API (https://www.themoviedb.org/)
2. Ouvrez `js/app.js` et collez votre clé dans la variable `TMDB_API_KEY`

Déploiement (Git & GitHub Pages)
1. Initialiser git localement et commit:

```bash
git init
git add .
git commit -m "Ajout Explorateur de Films - Profil Final"
```

2. Créez un dépôt sur GitHub (par ex. `movie-explorer`) et suivez les instructions pour pousser votre branche `main`:

```bash
git remote add origin https://github.com/<votre-username>/<votre-repo>.git
git branch -M main
git push -u origin main
```

3. Activez GitHub Pages dans les settings du repo: choisissez la branche `main` et le dossier `/ (root)`.

Notes d'optimisation
- Les images présentes sont des SVG optimisés pour faible poids.
- Si vous voulez des affiches réelles, fournissez une clé TMDB dans `js/app.js`.

Besoin d'aide pour pousser et déployer ? Dites-moi si je dois initialiser le repo et créer le commit.
