module.exports = function(sequelize, DataTypes) {
  var Example = sequelize.define("Example", {
     cliente: DataTypes.STRING,
     local:DataTypes.STRING,
     fecha_visita:DataTypes.DATE,
     celular: DataTypes.STRING
      });

  Example.associate=function(models){
    Example.hasMany(models.Result,{

    });
  };
  return Example;
};
