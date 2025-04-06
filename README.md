# 📸 Astro Photography Portfolio Template

A modern, fast, and customizable photography portfolio template built with [Astro](https://astro.build).
Perfect for photographers looking to showcase their work with a professional and performant website.
Check out the [demo](https://rockem.github.io/astro-photography-portfolio/).

## ✨ Features

- Lightning-fast performance with Astro
- Fully responsive design
- Optimized image loading and handling
- Easy to customize
- Easy to organized gallery via a yaml file
- Multiple albums support
- Image zoom capabilities
- Automatic deployment to GitHub pages

## 🚀 Getting Started

### Prerequisites

- Check [AstroJS](https://docs.astro.build/en/install-and-setup/) documentation for prerequisites
- Basic knowledge of Astro and web development

### Installation

1. Choose "Use this template option"

2. Clone your newly created template

3. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Start the development server:

```bash
npm run dev
# or
yarn dev
```

## 📝 Make it your own

### Configuration

Edit the `astro.config.ts` file to update your github pages details:

```typescript
export default defineConfig({
  site: '<github pages domain>',
  base: '<repository name>',
  // ...
};
```

Edit the `site.config.mts` file to update your personal information:

```typescript
export default {
  title: 'SR',
  favicon: 'favicon.ico',
  owner: 'Sara Richard',
  // ... Other configurations
};
```

### Adding Your Photos

1. Place your images in the `src/gallery/<album>` directory
2. Update the gallery data in `src/gallery/gallery.yaml`
3. Images are automatically optimized during build

## 🛠️ Built With

- [Astro](https://astro.build) - The web framework for content-driven websites
- [TypeScript](https://www.typescriptlang.org/) - For type safety
- [TailwindCSS](https://tailwindcss.com) - For styling
- [Sharp](https://sharp.pixelplumbing.com/) - For image optimization
- [GLightbox](https://biati-digital.github.io/glightbox/) - For image lightbox

## Provided GitHub actions

- [Build & Test](./.github/workflows/test.yml) - Verify build & run tests
- [Quality](./.github/workflows/quality.yml) - Run various pre-commit checks
- [Deploy Astroe Site](./.github/workflows/deploy.yml) - Deploy site to GitHub pages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request or an Issue.

## 💖 Support

If you find this template useful, please consider giving it a ⭐️ on GitHub!

## 📧 Contact

- [Instagram](https://www.instagram.com/lesegal/)
- [GitHub](https://github.com/rockem)
