import { useContext } from 'react';
import { createGlobalStyle, css, ThemeContext } from 'styled-components';

const rgba = (red: number, green: number, blue: number) => (
	alpha: number | object,
) =>
	typeof alpha === 'object'
		? `rgb(${red},${green},${blue})`
		: `rgba(${red},${green},${blue},${alpha})`;

export const theme = {
	colors: {
		primary: rgba(25, 25, 25),
		secondary: rgba(255, 255, 255),
		tertiary: rgba(255, 0, 0),

		grey400: rgba(220, 220, 220),
		grey500: rgba(95, 95, 95),
	},
};

export type ThemeType = typeof theme;

export const useTheme = () => {
	const themeFromContext = useContext(ThemeContext);
	return themeFromContext || {};
};

export const GlobalStyle = createGlobalStyle`${css`
	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}
	html {
		font-size: 50%;
	}
	body {
		font-size: 1.75rem;
	}
	a {
		text-decoration: none;
	}
`}`;
