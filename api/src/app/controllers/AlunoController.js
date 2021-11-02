import Aluno from '../models/Aluno';
import Curso from '../models/Curso';
import CursoAluno from '../models/CursoAluno';

class AlunoController {
  async index(req, res) {
    const alunos = await Aluno.findAll({
      include: [
        {
          model: Curso,
          as: 'curso',
          through: { attributes: [] },
        },
      ],
    });
    res.json(alunos);
  }

  async read(req, res) {
    const aluno = await Aluno.findByPk(req.params.id, {
      include: [
        {
          model: Curso,
          as: 'curso',
          through: { attributes: [] },
        },
      ],
    });
    if (!aluno) {
      return res.status(404).send('O Aluno não foi encontrado')
    }
    res.json(aluno);
  }

  async create(req, res) {
    const aluno = await Aluno.create({
      nome: req.body.data.nome,
      email: req.body.data.email,
      cep: req.body.data.cep,
      cidade: req.body.data.cidade,
      estado: req.body.data.estado
    });
    res.status(201).json(aluno)
  }

  async update(req, res) {
    let aluno = await Aluno.findByPk(req.params.id)
    if (!aluno) {
      return res.status(404).send('O Aluno não foi encontrado')
    }

    const condition = { where: { id: req.params.id } };
    const body = {
      nome: req.body.data.nome,
      email: req.body.data.email,
      cep: req.body.data.cep,
      cidade: req.body.data.cidade,
      estado: req.body.data.estado
    }
    aluno = await Aluno.update(body, condition)
      .then(res.status(200).json('Aluno atualizado com sucesso!'))
      .catch(function (error) {
        res.status(400).json('Erro: ' + error)
      })
  }

  async delete(req, res) {
    let aluno = await Aluno.findByPk(req.params.id)
    if (!aluno) {
      return res.status(404).send('O Aluno não foi encontrado')
    }
    const condition = { where: { id: req.params.id } };
    aluno = await Aluno.destroy(condition)
      .catch(error => res.status(400).send(error))

    await CursoAluno.destroy({ where: { id_pessoa: req.params.id } })
      .then(res.status(204).json(aluno))
      .catch(error => res.status(400).send(error))
  }
}

export default new AlunoController();
