import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { toast } from 'react-toastify';

// components
import { Table, Button, Popup, Modal, Header, Icon, Form } from 'semantic-ui-react'
import useForm from './useForm';

//services
import api from '../../services/api';

// styles
import { Container, InitialText } from './styles';

const Dashboard = () => {
  const [alunos, setAlunos] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [cursoItem, setCursoItem] = useState([]);
  const [currentInfo, setCurrentInfo] = useState([]);
  const [modalInfos, setModalInfos] = useState(false);
  const [modalAddCurso, setModalAddCurso] = useState(false);
  const [isDisable, setIsDisable] = useState(true);
  const [action, setAction] = useState();
  const form = useForm();

  const getAlunos = useCallback(() => {
    async function fetchData() {
      try {
        const response = await api.get('/alunos');
        setAlunos(response.data);
      } catch {
        alert('Confira a api');
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    getAlunos();
  }, [getAlunos]);

  useEffect(() => {
    async function fetchData() {
      try {
        const responseCurso = await api.get('/cursos');
        setCursos(responseCurso.data);
      } catch {
        alert('Confira a api');
      }
    }
    fetchData();
  }, []);

  const render_modal_info_alunos = () => (
    <Modal open={modalInfos} onClose={() => setModalInfos(false)} closeIcon>
      {action === 'create' ? (
        <Header content='Cadastrar novo aluno' />
      ) : (
        <Header content={`Editando informações de ${currentInfo.nome}`} />
      )}
      <Modal.Content>
        <Form>
          <Form.Group widths='equal'>
            <Form.Input fluid
              value={form.form.nome || ""}
              onChange={form.onChange}
              label='Nome'
              name="nome"
              placeholder='Nome'
            />
            <Form.Input fluid
              value={form.form.email || ""}
              onChange={form.onChange}
              label='Email'
              name="email"
              placeholder='Email'
            />
            <Form.Input fluid
              value={form.form.cep || ""}
              onChange={form.onChange}
              label='CEP'
              name="cep"
              placeholder='CEP'
            />
          </Form.Group>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={() => setModalInfos(false)} color='red'>
          <Icon name='remove' /> Cancelar
        </Button>
        <Button disabled={form.registerFormValid} color='green' onClick={() => createEditAluno()}>
          <Icon name='checkmark' /> Salvar
        </Button>
      </Modal.Actions>
    </Modal>
  )

  const render_modal_add_curso = () => (
    <Modal open={modalAddCurso} onClose={() => { setModalAddCurso(false); setIsDisable(true);}} closeIcon>
      <Header content={`Cadastrar novo curso para ${currentInfo.nome}`} />
      <Modal.Content>
        <Form>
          <Select
            name="curso"
            rules={{ required: true }}
            placeholder='Cursos'
            options={cursos}
            getOptionLabel={option => option.nome}
            getOptionValue={option => option.id}
            onChange={event => {
              setCursoItem(event);
              setIsDisable(false);
            }}
          />
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={() => {
          setModalAddCurso(false);
          setIsDisable(true);
        }} color='red'>
          <Icon name='remove' /> Cancelar
        </Button>
        <Button disabled={isDisable} color='green' onClick={() => addCursoAluno()}>
          <Icon name='checkmark' /> Salvar
        </Button>
      </Modal.Actions>
    </Modal>
  )

  async function addCursoAluno() {
    setIsDisable(true);

    try {
      await api.post(`cursos/aluno/${currentInfo.id}`, {
        data: cursoItem.id
      });
      toast.success("Aluno foi adicionado ao curso", {
        position: toast.POSITION.TOP_RIGHT
      });
      setModalAddCurso(false);
      getAlunos();
    } catch {
      toast.error("Erro ao adicionar o aluno ao curso", {
        position: toast.POSITION.TOP_RIGHT
      });
    }
  }

  function open_info_alunos(data_aluno) {
    form.form.id = data_aluno.id;
    form.form.nome = data_aluno.nome;
    form.form.email = data_aluno.email;
    form.form.cep = data_aluno.cep;
    form.form.estado = data_aluno.estado;
    form.form.cidade = data_aluno.cidade;
    setCurrentInfo(data_aluno)
    setModalInfos(true)
  }

  async function createEditAluno() {
    const viacep = await axios.get(`https://viacep.com.br/ws/${form.form.cep}/json/`);
    form.form.cidade = viacep.data.localidade || '';
    form.form.estado = viacep.data.uf || '';

    if (action === 'create') {
      try {
        await api.post('alunos', {
          data: form.form
        });
        toast.success("Aluno cadastrado com sucesso", {
          position: toast.POSITION.TOP_RIGHT
        });
        setModalInfos(false);
        getAlunos();
      }
      catch {
        toast.error("Erro ao cadastrar o aluno", {
          position: toast.POSITION.TOP_RIGHT
        });
        setModalInfos(false);
      }
    }
    else {
      try {
        await api.put(`alunos/${form.form.id}`, {
          data: form.form
        });
        toast.success("Aluno atualizado com sucesso", {
          position: toast.POSITION.TOP_RIGHT
        });
        setModalInfos(false);
        getAlunos();
      } catch {
        toast.error("Erro ao atualizar o aluno", {
          position: toast.POSITION.TOP_RIGHT
        });
        setModalInfos(false);
      }
    }
  }

  async function delete_aluno(data_aluno) {
    try {
      await api.delete(`alunos/${data_aluno.id}`);
      toast.success("Aluno deletado com sucesso", {
        position: toast.POSITION.TOP_RIGHT
      });
      getAlunos();
    } catch {
      toast.success("Erro ao deletar o aluno", {
        position: toast.POSITION.TOP_RIGHT
      });
    }
  }

  function render_actions(data_aluno) {
    return <center>
      <Popup
        trigger={<Button icon='edit' onClick={() => {
          open_info_alunos(data_aluno)
          setAction('edit');
        }}
        />}
        content="Editar informações"
        basic
      />
      <Popup
        trigger={<Button icon='plus' positive onClick={() => {
          setCurrentInfo(data_aluno)
          setModalAddCurso(true)
        }}
        />}
        content="Adicionar curso para aluno"
        basic
      />
      <Popup
        trigger={<Button icon='close' negative onClick={() => delete_aluno(data_aluno)} />}
        content="Excluir aluno"
        basic
      />
    </center>
  }

  function render_alunos() {
    return alunos.map((v) => <Table.Row>
      <Table.Cell>{v.id}</Table.Cell>
      <Table.Cell>{v.nome}</Table.Cell>
      <Table.Cell>{v.email}</Table.Cell>
      <Table.Cell>{v.cep}</Table.Cell>
      <Table.Cell>{render_actions(v)}</Table.Cell>
    </Table.Row>)
  }

  return (
    <Container>
      <InitialText>Administrador de alunos</InitialText>
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>ID Aluno</Table.HeaderCell>
            <Table.HeaderCell>Nome</Table.HeaderCell>
            <Table.HeaderCell>Email</Table.HeaderCell>
            <Table.HeaderCell>CEP</Table.HeaderCell>
            <Table.HeaderCell>Ações</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {alunos.length > 0 ? render_alunos() : <h2>Nenhum dado registrado </h2>}
        </Table.Body>
      </Table>
      {render_modal_info_alunos()}
      {render_modal_add_curso()}
      <Button primary onClick={() => {
        setAction('create');
        setCurrentInfo({});
        setModalInfos(true);
        form.form.id = '';
        form.form.nome = '';
        form.form.email = '';
        form.form.cep = '';
        form.form.estado = '';
        form.form.cidade = '';
      }
      }>Adicionar aluno</Button>
      <Button href="/" secondary>Ver instruções</Button>
    </Container>
  );
};

export default Dashboard;
