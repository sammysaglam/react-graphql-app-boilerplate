import RelativeTimeFormat from 'relative-time-format';
import en from 'relative-time-format/locale/en.json';

if (!Intl.RelativeTimeFormat) {
	RelativeTimeFormat.addLocale(en);
	Intl.RelativeTimeFormat = RelativeTimeFormat;
}
