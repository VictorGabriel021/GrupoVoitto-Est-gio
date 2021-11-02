import AtribuirCursoAlunoService from '../services/AtribuirCursoAlunoService';

class CursoAlunoController {

  async create(req, res) {
    const id_aluno = req.params.id;
    const id_curso = req.body.data;
    const curso_aluno = await AtribuirCursoAlunoService.execute(id_aluno, id_curso);
    if (curso_aluno) {
      res.status(201).send('O Aluno foi adicionado ao curso')
    }
    else {
      res.status(400).send('Erro na api')
    }
  }
}

export default new CursoAlunoController();
