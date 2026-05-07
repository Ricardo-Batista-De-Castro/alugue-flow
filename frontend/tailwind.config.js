/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdfa',   // Muito claro - para fundos suaves
          100: '#ccfbf1',  // Claro - para highlights
          200: '#99f6e4',  // Suave
          300: '#5eead4',  // Médio-claro
          400: '#2dd4bf',  // Médio
          500: '#14b8a6',  // Principal - Teal equilibrado
          600: '#0d9488',  // Médio-escuro - para textos/botões
          700: '#0f766e',  // Escuro - para contraste
          800: '#115e59',  // Muito escuro
          900: '#134e4a',  // Profundo
        }
      },
    },
  },
  plugins: [],
}
