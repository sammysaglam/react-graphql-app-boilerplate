import { useContext } from 'react';
import { ThemeContext, createGlobalStyle, css } from 'styled-components';

const rgba = (red: number, green: number, blue: number) => (
	alpha: number | object,
) =>
	typeof alpha === 'object'
		? `rgb(${red},${green},${blue})`
		: `rgba(${red},${green},${blue},${alpha})`;

type RgbaReturnType = ReturnType<typeof rgba>;

// eslint-disable-next-line func-style
function colorCollection<Collections>(
	collection: { default: RgbaReturnType } & Collections,
) {
	const collectionKeys = Object.keys(collection);
	type CollectionName = keyof Collections;

	return (
		colorVariantNameOrAlpha: CollectionName | number | object,
	): RgbaReturnType => {
		if (collectionKeys.includes(colorVariantNameOrAlpha as string)) {
			const key = colorVariantNameOrAlpha as CollectionName;

			// @ts-ignore
			return collection[key];
		}

		if (typeof colorVariantNameOrAlpha === 'number') {
			// @ts-ignore
			return collection.default(colorVariantNameOrAlpha as number);
		}

		// @ts-ignore
		return collection.default(colorVariantNameOrAlpha as object);
	};
}

export const appTheme = {
	fonts: {
		primary: `
			font-family: Arial;
			font-weight: 300;
		`,
		secondary: `
			font-family: Times New Roman;
			font-weight: 900;
		`,
	},
	colors: {
		primary: rgba(25, 25, 25),
		secondary: rgba(255, 255, 255),
		tertiary: rgba(255, 0, 0),

		grey300: rgba(240, 240, 240),
		grey400: rgba(220, 220, 220),
		grey500: rgba(95, 95, 95),

		text: colorCollection({
			light: rgba(40, 40, 40),
			default: rgba(25, 25, 25),
			'against-light-background': rgba(5, 11, 30),
			'against-dark-background': rgba(255, 255, 255),
		}),
		background: colorCollection({
			default: rgba(255, 255, 255),
			dark: rgba(5, 11, 30),
		}),
	},
	breakpoints: {
		mobile: '768px',
	},
	zindexes: {
		leftnav: 9,
		topnav: 10,
	},
};

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
		${({ theme }) => theme.fonts.primary};
	}

	body {
		font-size: 1.75rem;
	}

	table {
		border-spacing: 0;
		border-collapse: collapse;
	}

	h1,
	h2,
	h3,
	h4,
	h5,
	h6 {
		${({ theme }) => theme.fonts.secondary};
	}

	a {
		text-decoration: none;
	}
`}`;
