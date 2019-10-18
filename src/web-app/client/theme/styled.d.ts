import 'styled-components';
import { appTheme } from './theme';

type ThemeType = typeof appTheme;

declare module 'styled-components' {
	// eslint-disable-next-line @typescript-eslint/no-empty-interface
	export interface DefaultTheme extends ThemeType {}
}
