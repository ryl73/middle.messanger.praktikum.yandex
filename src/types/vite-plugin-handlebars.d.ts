declare module 'vite-plugin-handlebars' {
    import { Plugin } from 'vite';

    interface HandlebarsPluginOptions {
        partialDirectory?: string;
        context?: Record<string, any>;
        helpers?: Record<string, (...args: any[]) => any>;
    }

    function handlebarsPlugin(options?: HandlebarsPluginOptions): Plugin;
    export default handlebarsPlugin;
}
