import en from './en/en';
import es from './es/es';
import ar from './ar/ar';
import de from './de/de';
import fr from './fr/fr';
import id from './id/id';
import it from './it/it';
import ja from './ja/ja';
import ko from './ko/ko';
import nl from './nl/nl';
import pl from './pl/pl';
import pt from './pt/pt';
import ru from './ru/ru';
import sv from './sv/sv';
import th from './th/th';
import zhHans from './zh-Hans/zh-Hans';
import zhHant from './zh-Hant/zh-Hant';

import _ from 'lodash';

const locale = Object.freeze(_.merge({},
  en,
  es,
  ar,
  de,
  fr,
  id,
  it,
  ja,
  ko,
  nl,
  pl,
  pt,
  ru,
  sv,
  th,
  zhHans,
  zhHant
));

export default locale;