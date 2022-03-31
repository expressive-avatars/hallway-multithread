import { defineConfig } from "vite"
import { resolve } from "path"

export default defineConfig({
  root: resolve(__dirname, "src"),
  envDir: resolve(__dirname),
})
