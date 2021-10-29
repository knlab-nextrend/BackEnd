module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
      'nt_users_list', // 테이블의 이름 지정
      {
       userID: {
        type: DataTypes.STRING(10),
        allowNull : false,
        unique: true
       },
       userPW: {
        type: DataTypes.STRING(1000),
        allowNull : true
       },
       Name: {
        type: DataTypes.STRING(10),
        allowNull : true
       },
       Company: {
        type: DataTypes.STRING(20),
        allowNull : true
       },
       Position: {
        type: DataTypes.STRING(20),
        allowNull : true
       },
       Email: {
        type: DataTypes.STRING(20),
        allowNull : true,
       },
       Tel: {
        type: DataTypes.STRING(20),
        allowNull : true
       },
       CreateAt: {
        type: DataTypes.DATE,
        allowNull : false,
        defaultValue:sequelize.literal('now()')
       },
       Category: {
        type: DataTypes.STRING(10),
        allowNull : true,
       },
       salt: {
        type: DataTypes.STRING(1000),
        allowNull : true
       },
      },
      {
        charset: 'utf8',
        collate: 'utf8_general_ci',
        mode: '0644',
        timestamps: false,
        freezeTableName: true, //테이블명 뒤에 s 안붙도록
      }
  )};