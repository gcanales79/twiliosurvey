module.exports = function (sequelize, DataTypes) {
    var Result = sequelize.define("Result", {
        celular: DataTypes.STRING,
        pregunta_1: DataTypes.STRING,
        pregunta_2: DataTypes.STRING,
        pregunta_3: DataTypes.STRING,
        preguntas_completas: {
            type: DataTypes.INTEGER,
        
        },
        complete: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });

    Result.associate=function(models){
        Result.belongsTo(models.Example,{
            foreingKey:{
                allonNull:false
            }
        });
    };
    return Result;
};