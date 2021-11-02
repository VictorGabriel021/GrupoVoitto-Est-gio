import { Model } from 'sequelize';

class CursoAluno extends Model {
  static init(sequelize) {
    super.init(
      {
      },
      {
        sequelize,
        timestamps: false,
        tableName: 'curso_pessoa'
      },
      CursoAluno.associate = (models) => {
        models.Aluno.belongsToMany(models.Curso, {
          through: 'CursoAluno',
          as: 'curso',
          foreignKey: 'id_pessoa'
        });
        models.Curso.belongsToMany(models.Aluno, {
          through: 'CursoAluno',
          as: 'aluno',
          foreignKey: 'id_curso'
        });
      }
    );

    return this;
  }
}

export default CursoAluno;
