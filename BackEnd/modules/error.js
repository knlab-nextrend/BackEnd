/*
code {
    420:es,
    421:solr,
    422:nextrend,
    423:poli,
    424:nas
}
*/

const customError = (obj, code) => {
    let error;
    if(obj instanceof Error){
        error = obj;
        error.code = code;
    }else if(obj instanceof String){
        const error = new Error(obj);
        error.code = code;
    }
    return error;
}

module.exports = customError;