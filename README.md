# 📸 Astro Photography Portfolio Template

A modern, fast, and customizable photography portfolio template built with [Astro](https://astro.build).
Perfect for photographers looking to showcase their work with a professional and performant website.

## ✨ Features

- Lightning-fast performance with Astro
- Fully responsive design
- Optimized image loading and handling
- Easy to customize
- Easy to organized gallery via a yaml file
- Image zoom capabilities

## 🚀 Getting Started

### Prerequisites

- Check [AstroJS](https://docs.astro.build/en/install-and-setup/) documentation for prerequisites
- Basic knowledge of Astro and web development

### Quick start

1. Click ""

1. Clone this template:

```bash
git clone https://github.com/yourusername/astro-photography-portfolio
cd astro-photography-portfolio
```

2. Install dependencies:

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

Edit the `src/config.ts` file to update your personal information:

```typescript
export const SITE_CONFIG = {
  author: 'Your Name',
  title: 'Photography Portfolio',
  description: 'A showcase of my photography work',
  // ... other configurations
};
```

### Adding Your Photos

1. Place your images in the `public/images` directory
2. Update the gallery data in `src/data/gallery.ts`
3. Images are automatically optimized during build

### Modifying Styles

- Global styles are in `src/styles/global.css`
- Component styles are co-located with their components
- Theme customization in `src/styles/theme.css`

## 📦 Project Structure

```
/
├── public/
│ └── images/
├── src/
│ ├── components/
│ ├── layouts/
│ ├── pages/
│ ├── styles/
│ └── data/
└── package.json
```

## 🛠️ Built With

- [Astro](https://astro.build) - The web framework for content-driven websites
- [TypeScript](https://www.typescriptlang.org/) - For type safety
- [TailwindCSS](https://tailwindcss.com) - For styling
- [Sharp](https://sharp.pixelplumbing.com/) - For image optimization
- [GLightbox](https://biati-digital.github.io/glightbox/) - For image lightbox

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 💖 Support

If you find this template useful, please consider giving it a ⭐️ on GitHub!

## 📧 Contact

Your Name - [@yourtwitter](https://twitter.com/yourtwitter)

Project Link: [https://github.com/yourusername/astro-photography-portfolio](https://github.com/yourusername/astro-photography-portfolio)
