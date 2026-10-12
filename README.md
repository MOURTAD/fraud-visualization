## Développer votre visualisation

Après avoir cloné le projet et créé votre branche personnelle, vous pouvez commencer à développer votre visualisation.

### 1. Votre dossier personnel

Dans `src/visualizations/`, vous trouverez un dossier portant votre nom.

```text
src/
└── visualizations/
    ├── mourtada/
    ├── membre2/
    ├── membre3/
    ├── membre4/
    └── membre5/
```

**Vous devez travailler uniquement dans votre dossier personnel.**

Cela permet à chaque membre de développer sa visualisation indépendamment, sans modifier le travail des autres.

### 2. Créer votre visualisation

Dans votre dossier, créez au minimum deux fichiers :

- `MaVisualisation.jsx` : le composant React contenant votre visualisation D3.js.
- `maVisualisation.css` : les styles de votre visualisation.

Exemple :

```text
votre-nom/
├── MaVisualisation.jsx
└── maVisualisation.css
```

Vous pouvez également ajouter des fichiers supplémentaires dans votre dossier si nécessaire.

### 3. Règles importantes

- Utilisez **React et D3.js** pour développer votre visualisation.
- Utilisez le jeu de données commun disponible dans `public/data/transactions.csv`.
- N'ajoutez pas une deuxième copie du jeu de données.
- Utilisez des noms de classes CSS spécifiques à votre visualisation pour éviter les conflits.
- Votre composant doit être exporté avec `export default`.
- Ne modifiez pas les dossiers des autres membres.
- Ne modifiez pas `App.jsx`, `App.css` ou les autres fichiers communs sans coordination.

### 4. Tester votre visualisation

Pour tester votre composant dans l'application, vous pouvez temporairement l'importer dans `App.jsx` sur votre branche personnelle, à la place de la visualisation existante.

**Attention :** cette modification sert uniquement aux tests. Ne l'incluez pas dans votre contribution finale sans accord de l'équipe.

Vérifiez que votre visualisation fonctionne correctement et que ses interactions sont opérationnelles.

### 5. Lorsque votre visualisation est terminée

Envoyez les modifications de votre dossier sur votre branche personnelle et créez une demande de fusion sur GitHub.

Nous intégrerons ensuite votre composant à la carte correspondante dans la page principale.

**Objectif : chaque membre développe sa visualisation indépendamment, puis nous réunissons les cinq dans le tableau de bord commun.**









# USELess INFOS 

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
