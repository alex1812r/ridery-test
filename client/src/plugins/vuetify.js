import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import { es } from 'vuetify/locale';

export default createVuetify({
  components,
  directives,
  locale: {
    locale: 'es',
    fallback: 'en',
    messages: { es }
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi
    }
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#3bd4ae', // Color principal
          secondary: '#2a9d8f', // Verde más oscuro para secundario
          accent: '#48cae4', // Cyan claro para acentos
          error: '#e63946', // Rojo para errores
          info: '#219ebc', // Azul para información
          success: '#06d6a0', // Verde claro para éxito
          warning: '#ffb703', // Amarillo/naranja para advertencias
          background: '#f8f9fa', // Fondo claro
          surface: '#ffffff', // Superficie blanca
          'on-primary': '#ffffff', // Texto sobre color primario
          'on-secondary': '#ffffff', // Texto sobre color secundario
          'on-surface': '#212529', // Texto sobre superficie
          'on-background': '#212529' // Texto sobre fondo
        }
      }
    }
  }
});
