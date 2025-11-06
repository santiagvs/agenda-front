import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'

// https://vite.dev/config/
export default defineConfig({
    plugins: [vue()],
    base: "/",
    resolve: {
        alias: {
            "@views": resolve(__dirname, "src/views"),
            "@components": resolve(__dirname, "src/components"),
            "@services": resolve(__dirname, "src/services"),
            "@stores": resolve(__dirname, "src/stores"),
            "@interfaces": resolve(__dirname, "src/interfaces"),
            "@utils": resolve(__dirname, "src/utils"),
            "@styles": resolve(__dirname, "src/styles"),
        },
    },
},
)
