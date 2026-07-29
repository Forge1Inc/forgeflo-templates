import { defineConfig } from "vite";
import { ViteMinifyPlugin } from "vite-plugin-minify";
const IN_PRODUCTION = process.env.NODE_ENV === "production";
const IN_DEVELOPMENT = process.env.NODE_ENV === "development";
import cssnano from "cssnano";
import autoprefixer from "autoprefixer";
const bootstrap = "node_modules/bootstrap";
import purgeCSSPlugin from "@fullhuman/postcss-purgecss";
import path from "path";

// Hide Preloader while in development.
const hidePreloader = () => {
  return {
    name: "hide-preloader",
    transformIndexHtml(html) {
      return html.replace(
        `<link rel="stylesheet" href="./src/css/preloader.min.css" type="text/css">`,
        `<!-- <link rel="stylesheet" href="./src/css/preloader.min.css" type="text/css"> -->`
      );
    }
  }
}

export default defineConfig({
  plugins: [
    /* ## Hide Preloader while in Development
    --------------------------------------------- */
    IN_DEVELOPMENT && hidePreloader(),

    /* ## Minify the output HTML files in production
    --------------------------------------------- */
    IN_PRODUCTION && ViteMinifyPlugin({}),
  ],

  resolve: {
    alias: {
      $assets: path.resolve("./src/assets"),
      $components: path.resolve("./src/components"),
      $data: path.resolve("./src/data"),
      $functions: path.resolve("./src/functions"),
      $sections: path.resolve("./src/sections"),
      $styles: path.resolve("./src/styles"),
      $lib: path.resolve("./src/lib"),
    },
  },

  css: {
    postcss: {
      plugins: IN_PRODUCTION
        ? [
            purgeCSSPlugin({
              content: [
                "index.html",
                "./src/**/*.js",
                // --- Import only the required components.
                `${bootstrap}/js/dist/alert.js`,
                // `${bootstrap}/js/dist/base-component.js`,
                // `${bootstrap}/js/dist/button.js`,
                // `${bootstrap}/js/dist/carousel.js`,
                // `${bootstrap}/js/dist/collapse.js`,
                // `${bootstrap}/js/dist/dropdown.js`,
                // `${bootstrap}/js/dist/modal.js`,
                // `${bootstrap}/js/dist/offcanvas.js`,
                // `${bootstrap}/js/dist/popover.js`,
                // `${bootstrap}/js/dist/scrollspy.js`,
                // `${bootstrap}/js/dist/tab.js`,
                // `${bootstrap}/js/dist/toast.js`,
                // `${bootstrap}/js/dist/tooltip.js`,
              ],
              safelist: [/modal-/, /:global/, /data-bs-/, /show/, /fade/, /var/],
              defaultExtractor: (content) =>
                content.match(/[\w-/:]+(?<!:)/g) || [],
              keyframes: true,
              variables: true,
            }),
            cssnano({
              preset: ["default", { discardComments: { removeAll: true } }],
            }),
            autoprefixer(),
          ]
        : [],
    },
  },

  // base: "",
  server: {
    port: 3000,
  },

  build: {
    // outDir: "./docs",
    minify: "terser",
    terserOptions: {
      format: {
        comments: false,
      },
    },
  },
});
