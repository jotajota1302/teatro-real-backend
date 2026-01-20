/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts,scss,css}'],
  theme: {
    fontFamily: {
      sans: ['Montserrat', 'sans-serif'],
      montserrat: ['Montserrat', 'sans-serif'],
    },
    extend: {
      colors: {
        // Paleta Teatro Real
        'teatro-black': '#010101',
        'teatro-crimson': '#CF102D',
        'teatro-crimson-dark': '#A00D24',
        'teatro-crimson-light': '#E54D64',
        'teatro-white': '#FFFFFF',

        // Grises sistema
        'teatro-gray-900': '#232323',
        'teatro-gray-800': '#333333',
        'teatro-gray-600': '#666666',
        'teatro-gray-400': '#999999',
        'teatro-gray-200': '#CCCCCC',
        'teatro-gray-100': '#F5F5F5',

        // Estados/feedback
        'teatro-success': '#2E7D32',
        'teatro-error': '#C62828',
        'teatro-warning': '#EF6C00',
        'teatro-info': '#1565C0',

        // Actividades TEMPO extendidas
        'tempo-funcion': '#1E3A5F',
        'tempo-ensayo': '#2E7D32',
        'tempo-montaje': '#E57373',
        'tempo-pauta': '#757575',
        'tempo-evento': '#AD1457',
        'tempo-nocturna': '#EF6C00',
        'tempo-visita': '#7B1FA2',
        'tempo-cargas': '#F9A825',
        'tempo-cursos': '#EC407A',
        'tempo-prensa': '#C62828',
        'tempo-flamenco': '#9C27B0',
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '16px',
      },
      boxShadow: {
        'sm': '0 1px 2px rgba(0,0,0,0.05)',
        'md': '0 2px 8px rgba(0,0,0,0.1)',
        'lg': '0 4px 16px rgba(0,0,0,0.15)',
        'xl': '0 8px 32px rgba(0,0,0,0.20)',
        'elevated': '0 10px 40px rgba(0,0,0,0.25)',
      }
    },
  },
  plugins: [],
}
