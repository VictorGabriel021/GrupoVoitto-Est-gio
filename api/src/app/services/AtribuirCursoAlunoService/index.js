import Aluno from '../../models/Aluno';
import Curso from '../../models/Curso';
import CursoAluno from '../../models/CursoAluno';

class AtribuirCursoAlunoService {
  async execute(id_aluno, id_curso) {
    const aluno = await Aluno.findByPk(id_aluno)
    if (!aluno) {
      return false
    }
    const curso = await Curso.findByPk(id_curso)
    if (!curso) {
      return false
    }
    const cursoAluno = await CursoAluno.findAll({
      where: {
        id_pessoa: id_aluno,
        id_curso: id_curso
      }
    })
    if (cursoAluno.length != 0) {
      return false
    }

    await CursoAluno.create({
      id_pessoa: id_aluno,
      id_curso: id_curso
    })
    return true;
  }
}

export default new AtribuirCursoAlunoService();
