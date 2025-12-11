/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    fontFamily: {
      sans: ['Montserrat', 'sans-serif'],
    },
    extend: {
      colors: {
        // Teatro Real - Colores principales
        'teatro': {
          carmesi: '#CF102D',
          'carmesi-dark': '#A00D24',
          'carmesi-light': '#E54D64',
          negro: '#010101',
          'negro-carbon': '#232323',
          'negro-suave': '#080808',
          blanco: '#FFFFFF',
        },
        // Grises corporativos
        'tr-gray': {
          900: '#232323',
          800: '#333333',
          600: '#666666',
          400: '#999999',
          200: '#CCCCCC',
          100: '#F5F5F5',
        },
        // Colores de actividades TEMPO
        'actividad': {
          funcion: '#1E3A5F',
          ensayo: '#2E7D32',
          montaje: '#E57373',
          'pauta-tecnica': '#757575',
          evento: '#AD1457',
          nocturnas: '#EF6C00',
          visitas: '#7B1FA2',
          cargas: '#F9A825',
          escenario: '#FAFAFA',
          cursos: '#EC407A',
          prensa: '#C62828',
          flamenco: '#9C27B0',
        },
        // Estados
        'estado': {
          exito: '#2E7D32',
          error: '#C62828',
          advertencia: '#EF6C00',
          info: '#1565C0',
          neutro: '#757575',
        },
      },
    },
  },
  plugins: [],
}
