const esDB = require("../../models/es/index").esDB;
const config = require("../../models/es/index").config;
const nationCtrl = require("../nextrend/nation.ctrl");
const codeCtrl = require("../nextrend/subjectCode.ctrl");
const libs = require("../../lib/libs");

const esDetail = (_id) => new Promise(async (resolve, reject) => {
    const query = {
        index: 'politica_service',
        body: {
            query: {
                match: {
                    _id: _id
                }
            }
        }
    };
    try {
        const value = await esDB.search(query);
        resolve(value);
    } catch (e) {
        reject(e);
    }
});

const esSearch = (size, from, stat, filters = {}, prefix = {}) => new Promise(async (resolve, reject) => {
    // filters 내용들을 filter로 담아줌.
    let filter = [];
    for (const [key, value] of Object.entries(filters)) {
        let term = {};
        term[key] = value;
        if ((key === 'dateGte') || (key === 'dateLte') || (value === '') || (key === 'sort') || (key === 'sortType') || (key === 'pageGte') || (key === 'pageLte')) {
        } else {
            filter.push({ term: term });
        }
    }
    // stat은 별개로
    filter.push({ term: { stat: stat } });

    // 기간 range
    let range = {};
    let temp = {};
    if (filters.dateGte !== '*') {
        temp['gte'] = filters.dateGte;
    }
    if (filters.dateLte !== '*') {
        temp['lte'] = filters.dateLte;
    }
    range[filters.sortType] = temp;
    let must = [];
    must.push({range:range});
    if(prefix.length){
        must.push({prefix:prefix});
    }

    // sort by
    let sort = [];
    let sortTemp = {};
    sortTemp[filters.sortType] = filters.sort;
    sort.push(sortTemp);

    const query = {
        from: from,
        size: size,
        index: 'politica_service',
        body: {
            query: {
                bool: {
                    must: must,
                    filter: filter
                },
            },
            sort: sort,
        }
    };

    const value = await esDB.search(query);
    const result = {
        "dcCount": value.body.hits.total.value
    };
    const documents = [];
    for (let document of value.body.hits.hits) {
        doc = libs.convertCrawlDocTo(document._source, 'es');
        doc["_id"] = document._id;
        //국가 표시 조정 단계
        let countrys = [];
        if (doc["dc_country"].length !== 0) {
            for (let countryId of doc["dc_country"]) {
                const countryInfo = await codeCtrl.getInfoById(countryId, 3);
                if (countryInfo[0]) {
                    countrys.push(countryInfo[0]);
                }
            }
            doc["dc_country"] = countrys;
        }

        let countrysPub = [];
        if (doc["dc_country_pub"].length !== 0) {
            for (let countryId of doc["dc_country_pub"]) {
                const countryInfo = await codeCtrl.getInfoById(countryId, 3);
                if (countryInfo[0]) {
                    countrysPub.push(countryInfo[0]);
                }
            }
            doc["dc_country_pub"] = countrysPub;
        }

        //코드 표시 조정 단계
        let codes = [];
        if (doc["dc_code"].length !== 0) {
            for (let code of doc["dc_code"]) {
                // type 1로 코드 나타냄.
                const codeInfo = await codeCtrl.getInfoById(code, 1);
                if (codeInfo[0]) {
                    codes.push(codeInfo[0]);
                }
            }
            doc["dc_code"] = codes;
        }

        documents.push(doc);

    };
    result["docs"] = documents;
    resolve(result);
});

const esIndex = (doc, stat, id = false, ret = false) => new Promise(async (resolve, reject) => {
    let body = libs.nullProcessing(doc);

    body.stat = stat;
    let query = {
        index: 'politica_service',
        refresh: true,
        body: body
    };
    if (id) {
        query["id"] = id;
    }
    const result = await esDB.index(query);
    if (result.statusCode == 200 || result.statusCode == 201) {
        resolve(true);
    } else if (ret) {
        resolve(result._id);
    } else {
        resolve(false);
    }
});

const esKeep = (_id, stat) => new Promise(async (resolve, reject) => {
    let doc = {
        "script": {
            "inline": "ctx._source.stat = " + stat,
            "lang": "painless"
        },
        "query": {
            "match": {
                "_id": _id
            }
        }
    };
    const query = {
        index: 'politica_service',
        refresh: true,
        body: doc
    };
    const result = await esDB.updateByQuery(query);
    if (result.statusCode == 200 || result.statusCode == 201) {
        resolve(true);
    } else {
        resolve(false);
    }
});

module.exports = {
    Search: esSearch,
    Index: esIndex,
    Detail: esDetail,
    Keep: esKeep
}