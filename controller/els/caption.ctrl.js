const elsDB = require("../../models/els/index");

const captionSearch = async (req, res) => {
    const value = await elsDB.search({
        index: 'caption',
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