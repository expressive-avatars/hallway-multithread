import { defineConfig } from "vite"
import { resolve } from "path"

export default defineConfig({
  root: resolve(__dirname, "src"),
  envDir: resolve(__dirname),
  define: {
    AVATAR_WEBKIT_AUTH_TOKEN: `"${process.env.AVATAR_WEBKIT_AUTH_TOKEN}"`,
  },
})
