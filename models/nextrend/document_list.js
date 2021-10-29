/*module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
      'document_list',
      {
        board_id: {
         type: DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement: true,
         allowNull : false,
       },

       Title : {
        type: DataTypes.STRING(50),
        allowNull : false
       },

       Contents: {
        type: DataTypes.TEXT,
        allowNull : false
       },

       Date: {
        type: DataTypes.DATE,
        allowNull : false
       },
      },
      {
        charset: 'utf8',
        collate: 'utf8_general_ci',
        timestamps: false,
      }
  )};*/