const neo4j = require('neo4j-driver').v1;
const dbconfig = require('../config/database');

const driver = neo4j.driver(dbconfig.DSN, neo4j.auth.basic(dbconfig.USER, dbconfig.PWD));
const session = driver.session();

async function run(query, params) {
	const queryResult = await session.run(query, params);

	session.close();
	return queryResult;
};

async function getNodes(query, params) {
	const results = [];
	const queryResult = await run(query, params);
	queryResult.records.forEach((rec) => {
		results.push({
			id: rec.get(0).identity && rec.get(0).identity.toNumber(),
			labels: rec.get(0).labels,
			props: rec.get(0).properties
		});
	});
	return results;
}

async function getSpecialNodes(query, params) {
	const queryResult = await run(query, params);
	const results = queryResult.records[0]._fields[0];
	return results;
}

module.exports = {
	execute: async (query, params) => {
		await getNodes(query, params);
	},
	getOneRow: async (query, params) => {
		const results = await getNodes(query, params);
		return results[0];
	},
	getAllRows: async (query, params) => {
		const results = await getNodes(query, params);
		return results;
	},
	getAllSpecialNodes : async (query, params) => {
		const results = await getSpecialNodes(query, params);
		return results;
	},
	rowCount: async (query, params) => {
		const results = await getNodes(query, params);
		return results.length;
	}
};