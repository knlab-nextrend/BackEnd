const testCtrl = require("../controller/test.ctrl")

const ping = async(req,res,next) => {
    try{
        await testCtrl.esPing();
        await testCtrl.nasPing();
        await testCtrl.poliPing();
        await testCtrl.solrPing();
        await testCtrl.nextrendPing();
        next();
    }catch(e){
        if(e.code===420){
            res.status(e.code).send({message:"es not connected"})
        }else if(e.code===421){
            res.status(e.code).send({message:"solr not connected"})
        }else if(e.code===422){
            res.status(e.code).send({message:"nextrend not connected"})
        }else if(e.code===423){
            res.status(e.code).send({message:"poli not connected"})
        }else if(e.code===424){
            res.status(e.code).send({message:"nas not connected"})
        }else{
            res.status(400).json(e);
        }
    }
}

module.exports = ping
