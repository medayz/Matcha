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
	let results = [];
	const queryResult = await run(query, params);
	queryResult.records.forEach((rec) => {
		results.push({
			id: rec.get(0).identity && rec.get(0).identity.toNumber(),
			labels: rec.get(0).labels,
			props: rec.get(0).properties
		});
	});
	results = results.map(obj => propsToInt(obj));
	return results;
}

function propsToInt(obj) {
	let object = Object.assign({}, obj);
	for (const key in object) {
		if (neo4j.isInt(object[key])) {
			object[key] = object[key].toNumber();
		} else if (!(object[key] instanceof Array) && (object[key] instanceof Object)) {
			object[key] = propsToInt(object[key]);
		}
	}
	return object;
}

async function getSpecialNodes(query, params) {
	const	queryResult = await run(query, params);
	let		results = queryResult.records[0]._fields[0];
	try {
		results = results.map(object => {
			return propsToInt(object)
		});
	}
	catch(e) {console.log(e);}
	return results;
}

module.exports = {
	execute: async (query, params) => {
		await run(query, params);
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
	getOneSpecialNodes : async (query, params) => {
		const results = await getSpecialNodes(query, params);
		return results[0];
	},
	rowCount: async (query, params) => {
		const results = await getNodes(query, params);
		return results.length;
	}
};