const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const npmRun = require('npm-run');
const { importSchema } = require('graphql-import');

/* eslint-disable no-console */
npmRun.exec('graphql-codegen --config ./codegen.config.json', error => {
	if (error) {
		console.error('GraphQL Codegen error');
		console.error(error);
		return;
	}
	console.log('Generated GraphQL types');

	mkdirp(path.join(__dirname, '../build/schema'), () => {
		const schema = importSchema(
			path.join(__dirname, '../src/web-app/server/schema.graphql'),
		);

		fs.writeFile(
			path.join(__dirname, '../build/schema/schema.graphql'),
			schema,
			() => {
				console.log('GraphQL schema built');
			},
		);
	});
});
