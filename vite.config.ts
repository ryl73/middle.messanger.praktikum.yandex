import {defineConfig} from "vite";
import {resolve} from 'path';
import handlebars from 'vite-plugin-handlebars';
import {fileURLToPath, URL} from "node:url";

export default defineConfig({
    root: resolve(__dirname, 'src'),
    build: {
        rollupOptions: {
            input: {
                index: resolve(__dirname, 'src/index.html'),
                login: resolve(__dirname, 'src/pages/login.html'),
                registration: resolve(__dirname, 'src/pages/registration.html')
            }
        },
        outDir: resolve(__dirname, 'dist')
    },
    plugins: [
        handlebars({
            partialDirectory: [
                './src/components/Button',
                './src/components/Input',
                './src/components/Modal',
            ]
        }),
    ],
    server: {
        open: './pages/login.html',
        port: 3000
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
})