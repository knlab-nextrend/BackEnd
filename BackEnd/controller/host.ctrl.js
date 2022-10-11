const poliCtrl = require("../service/politica/poliService");
const hostCtrl = require("../service/nextrend/host");
const { docCatViewer } = require("./crawl.ctrl");

const syncHostTables = async (req,res) =>{  
    try{
        const poliHost = await poliCtrl.getHostListInfo();
        const nextHost = await hostCtrl.read();
        let poliArray=[];
        poliHost.forEach((host)=>{
            poliArray.push(host.host)
        })
        let nextArray=[];
        nextHost.forEach((host)=>{
            nextArray.push(host.HOST)
        })
        let deleteList = nextArray.filter(x => !poliArray.includes(x));
        let insertList = poliArray.filter(x => !nextArray.includes(x));
        
        deleteList.forEach(async(host)=>{
            await hostCtrl.delete(host);
        })

        insertList.forEach(async(host)=>{
            await hostCtrl.create(host,null,null,null,null,1);
        })
        res.send({deleted:deleteList.length,inserted:insertList.length});
    }catch(e){
        res.statuts(400).send(e)
    }
}

const getHostListInfo = async (req,res) => {
    try{
        const hostResult = await poliCtrl.getHostListInfo();
        res.send(hostResult);
    }catch(e){
        res.status(400).send(e);
    }
}

const insertTestingHost = async(req,res)=>{
    try{
        let errList = [];
        req.body.list.forEach(async(host)=>{
            try{
                const available = await poliCtrl.availableHost(host);
                const result = host.match(/http/i);
                if(result&&available){
                    await poliCtrl.insertTestingHost(host);
                }else{
                    errList.push(host);
                }
            }catch(e){
                errList.push(host);
            }
        })
        res.send();
    }catch(e){
        res.status(400).send(e)
    }
}

const insertHostInfo = async(req,res) => {
    let errorList = [];
    req.body.list.forEach(async(host)=>{
        try{
            await hostCtrl.create(host.host,host.name,host.category,host.country,host.lang,host.workCycle);
        }catch(e){
            if(e.errno===1062){
                await hostCtrl.update(host.host,host.name,host.category,host.country,host.lang,host.workCycle)
            }else{
                errorList.push(host);
            }
        }
    })
    res.send(errorList);
}

const readHostInfo = async(req,res) => {
    try{
        if(req.query.like){
            const hostResult = await hostCtrl.read(req.query.like)
            res.send(hostResult);
        }else{
            const hostResult = await hostCtrl.read()
            let converted = [];
            for(let host of hostResult){
                doc = await docCatViewer(host);
                converted.push(doc);
            }
            res.send(converted);
        }
    }catch(e){
        res.status(400).send(e);
    }
}

const stageTestingHost = async(req,res) => {
    try{
        //await poliCtrl.deleteTestingHost(req.body.host);
        //await poliCtrl.insertCralwerHost();
        res.send({message:'api 활성화 필요'})
    }catch(e){
        res.status(400).send(e)
    }
}

const deleteTestingHost = async(req,res) => {
    try{
        //await poliCtrl.deleteTestingHost(req.body.host);
        res.send({message:'api 활성화 필요'})
    }catch(e){
        res.status(400).send(e)
    }
}

const getTestingHostList = async(req,res) => {
    try{
        const result = await poliCtrl.getTestingHostList();
        res.send(result)
    }catch(e){
        res.status(400).send(e)
    }
}

module.exports ={
    getHostListInfo:getHostListInfo,
    insertHostInfo,insertHostInfo,
    readHostInfo:readHostInfo,
    syncHostTables:syncHostTables,
    insertTestingHost:insertTestingHost,
    getTestingHostList:getTestingHostList,
    stageTestingHost:stageTestingHost,
    deleteTestingHost:deleteTestingHost
}