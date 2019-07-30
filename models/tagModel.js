const query = require('../libraries/database');

module.exports = {
    getAllTags: async () => {
        return await query.run('MATCH (n:Tag) RETURN n;');
    },
    getTagByName: async (name) => {
        return await query.run('MATCH (n:Tag { name: $name }) RETURN n', {
            name: name
        })
    }
};