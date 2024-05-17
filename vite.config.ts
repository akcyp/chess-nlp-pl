import { normalizePath } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy'
import { join } from 'node:path';

export default {
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: normalizePath(join(__dirname, 'node_modules/stockfish.js/stockfish.wasm')),
          dest: 'assets'
        }
      ]
    })
  ]
}
