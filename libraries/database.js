const neo4j = require('neo4j-driver').v1;
const dbconfig = require('../config/database');

const driver = neo4j.driver(dbconfig.DSN, neo4j.auth.basic(dbconfig.USER, dbconfig.PWD));
const session = driver.session();

async function run(query, params) {
	const results = [];
	const queryResult = await session.run(query, params);

	session.close();
	queryResult.records.forEach((rec) => {
		results.push({
			id: rec.get(0).identity.toNumber(),
			labels: rec.get(0).labels,
			props: rec.get(0).properties
		});
	});
	return results;
};

module.exports = {
	execute: async (query, params) => {
		await run(query, params);
	},
	getOneRow: async (query, params) => {
		const results = await run(query, params);
		return results[0];
	},
	getAllRows: async (query, params) => {
		const results = await run(query, params);
		return results;
	},
	rowCount: async (query, params) => {
		const results = await run(query, params);
		return results.length;
	}
};