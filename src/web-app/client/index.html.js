const htmlGenerator = ({
	ssr = '',
	defaultApolloState = {},
	styleTags = '',
} = {}) => `<!DOCTYPE><html>
    <head>
        <meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
		<title>App</title>
		${styleTags}
    </head>
    <body>
        <div id="app">${ssr}</div>
        <script
            charSet="UTF-8">
            window.__APOLLO_STATE__ = ${JSON.stringify(defaultApolloState)};
        </script>
        <script src="/bundle.js"></script>
    </body>
</head>`;

module.exports = {
	htmlGenerator,
};
