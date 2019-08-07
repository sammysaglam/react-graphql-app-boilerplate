const htmlGenerator = ({
	ssr = '',
	defaultApolloState = {},
	styleTags = '',
} = {}) => `<!DOCTYPE><html>
    <head>
        <meta charset="UTF-8">
		<meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" name="viewport">
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
