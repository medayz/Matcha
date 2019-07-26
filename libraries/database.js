const neo4j = require('neo4j-driver').v1;

const driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic('neo4j', 'Neo4j123$$'));
const session = driver.session();


async function run(query, params) {
	const   results = [];
	const	queryResult = await session.run(query, params);

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

module.exports.run = run;
