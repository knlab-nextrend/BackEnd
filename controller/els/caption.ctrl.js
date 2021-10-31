const elsDB = require("../../models/els/index");

const captionSearch = async (req, res) => {
    let body = {};

    const value = await elsDB.search({
        index: 'politica_service',
        body: {
            query: {
            match: { caption: 'to' }
            }
        }
    });
    res.send(value);
}

module.exports = {
    Search:captionSearch
}