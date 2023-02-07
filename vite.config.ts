import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => {
  return {
    base: process.env.APP_NAME ?
        `${process.env.APP_NAME}/` :
        './',
    ...(command === 'build' ? {} : {}),
    plugins: [react()],
  };
});
