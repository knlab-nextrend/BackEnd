const fs = require('fs');

const unlinkFile = (filePath) => new Promise((resolve, reject)=>{
    fs.unlinkSync(filePath,(err)=>{
        if(err){
            resolve(false);
        }else{
            resolve(true);
        }
   }); 
});

module.exports={
    unlinkFile:unlinkFile
}