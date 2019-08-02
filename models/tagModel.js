const paths = require("../config/paths");
const query = require(paths.LIBRARIES + "/database");

module.exports = {
    getAllTags: async () => {
        return await query.getAllRows('MATCH (n:Tag) RETURN n;');
    },
    getTagByName: async (name) => {
        return await query.getOneRow('MATCH (n:Tag { name: $name }) RETURN n', {
            name: name
        })
    }
};