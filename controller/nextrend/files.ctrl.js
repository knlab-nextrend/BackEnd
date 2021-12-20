const fs = require('fs');
const path = require('path');

const unlinkFile = (filePath) => new Promise((resolve, reject)=>{
    fs.unlinkSync(path.resolve(filePath),(err,res)=>{
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