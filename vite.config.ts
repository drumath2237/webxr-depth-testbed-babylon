import * as fs from 'fs';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => {
  if (mode === 'development') {
    return {
      server: {
        port: 3000,
        https: {
          key: fs.readFileSync('./key.pem'),
          cert: fs.readFileSync('./cert.pem'),
        },
      },
    };
  }
  return {};
});
