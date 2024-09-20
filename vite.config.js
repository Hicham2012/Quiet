import restart from 'vite-plugin-restart'
import glsl from 'vite-plugin-glsl'
import { viteSingleFile } from "vite-plugin-singlefile"

const base64Loader = {
    name: "base64-loader",
    async transform(_, id) {
      const [path, query] = id.split("?");
      if (query !== "base64") return null;
  
      const data = await fs.promises.readFile(path);
      const base64 = data.toString("base64");
  
      return `export default 'data:image/png;base64,${base64}';`;
    },
  };
  
export default {
    root: 'src/',
    publicDir: '../public/',
    base: './',
    server:
    {
        host: true, // Open to local network and display URL
        open: !('SANDBOX_URL' in process.env || 'CODESANDBOX_HOST' in process.env) // Open if it's not a CodeSandbox
    },
    build:
    {
        outDir: '../dist', // Output in the dist/ folder
        emptyOutDir: true, // Empty the folder first
        sourcemap: false // Add sourcemap
    },
    plugins:
    [
        restart({ restart: [ '../public/**', ] }), // Restart server on static file change
        viteSingleFile(),
        base64Loader,
        glsl() // Handle shader files
    ]
}