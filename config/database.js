const PROTOCOL = 'bolt';
const HOST = 'localhost';
const PORT = 7687;
const USER = 'neo4j';
const PWD = 'Neo4j123$$';

module.exports = {
    DSN: PROTOCOL + '://' + HOST + ':' + PORT,
    USER: USER,
    PWD: PWD
};