const sequelize = require("../../models/nextrend/index").sequelize;
sequelize.sync();
sequelize.query("SET NAMES utf8;");

const {
  User_list,
  Sequelize: { Op },
} = require("../../models/nextrend/index");

const userAdd = (req,res) => {
    User_list.create({
        userID : req.body.userID,
        userPW : req.body.userPW,
        Company : req.body.Company,
        Position : req.body.Position,
        Name : req.body.Name,
        Email : req.body.Email,
        Tel : req.body.Tel,
        Category : req.body.Category,
        salt : req.body.salt
    })
    .then( result => {
        res.send(result)
    })
    .catch( err => {
        console.log(err)
        throw err;
    })
}

const userGet = (req,res) => {
    User_list.findAll()
     .then( result => { return res.send(result) })
     .catch( err => { throw err; })
}

const userModify = (req,res) => {
    User_list.update({ 
        userID : req.body.modify.newuserID,
        userPW : req.body.modify.newuserPW,
        Company : req.body.modify.newCompany,
        Position : req.body.modify.newPosition,
        Name : req.body.modify.newName,
        Email : req.body.modify.newEmail,
        Tel : req.body.modify.newTel,
        Category : req.body.modify.newCategory,        
        salt : req.body.modify.newsalt 
    }, {
        where : { id : req.body.modify.id }
    })
    .then( result => { res.send(result) })
    .catch( err => { throw err })
}

const userDelete = (req,res) => {
    User_list.destroy({
        where : { id : req.body.delete.id }
    })
    .then( res.sendStatus(200) )
    .catch( err => { throw err })
}


module.exports = {
  Add: userAdd,
  Get: userGet,
  Modify: userModify,
  Delete:userDelete
};
