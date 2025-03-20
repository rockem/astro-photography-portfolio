import { Github, Instagram } from "lucide-astro";

export const siteConfig = {
  title: "Eli Segal's Photography",
  owner: "Eli Segal",
  socialLinks: [
    { name: "GitHub", url: "https://github.com/rockem", icon: Github },
    {
      name: "Instagram",
      url: "https://www.instagram.com/lesegal/",
      icon: Instagram,
    },
  ],
};
