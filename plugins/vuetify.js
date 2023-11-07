import Vuetify from 'vuetify/lib';

import en from '../locales/en';
import uk from '../locales/uk';
import ru from '../locales/ru';

export default new Vuetify({
  lang: {
    locales: { en, ru, uk },
    current: 'en',
  }
});
