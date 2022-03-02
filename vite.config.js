import { defineConfig } from "vite"
import inject from "@rollup/plugin-inject"

export default defineConfig({
  root: "src",
  plugins: [
    inject({
      process: ["process/browser", "*"],
    }),
  ],
  /**
   * Added because `node_modules/process/browser.js` tries to access module.exports
   */
  define: {
    "module.exports": "{}",
  },
})
