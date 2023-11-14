import { FormEvent, useEffect, useState } from 'react';
import TopBar from '../../components/TopBar';
import { api } from '../../api/api';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

type TipoSecao = {
  id: String;
  nome: string;
  descricao: string;
  idDivisao: string;
};

export default function EditarSecao() {
  const navegar = useNavigate();

  const { id } = useParams();

  const [secao, setSecao] = useState<TipoSecao>({
    id: '',
    nome: '',
    descricao: '',
    idDivisao: '',
  });

  useEffect(() => {
    // Faz uma chamada para a API para obter dados de funcionários
    api
      .get(`/secao/${id}`)
      .then((response) => {
        // Atualiza o estado com os dados recebidos da API
        setSecao(response.data);
      })
      .catch((error) => {
        console.error('Erro ao buscar dados:', error);
      });
  }, []);

  function handleEditar(e: FormEvent) {
    e.preventDefault();

    console.log(secao);
    Swal.fire({
      title: 'Deseja aplicar alterações?',
      text: 'Todas as alteroções serão aplicadas.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        await api
          .put(`/secao/${id}`, secao)
          .then((data) => {
            navegar('/funcionarios');
            toast.success('Funcionario editado com sucesso!');
          })
          .catch((err) => {
            toast.error('Não foi possível aplicar alterações ao Funcionario.');
          });
        navegar('/funcionarios');
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }

  const handleChange = (fieldName: keyof TipoSecao, value: string) => {
    setSecao((prevSecao) => ({
      ...prevSecao,
      [fieldName]: value,
    }));
  };

  return (
    <div>
      <TopBar />

      <form onSubmit={(e) => handleEditar(e)}>
        <div className="box">
          <div className="create-area">
            <div className="create-area-content">
              <h1 className="title">Cadastrar Seção</h1>
              <div id="msg"></div>
              <div className="input-container">
                <input
                  type="text"
                  className="input-text"
                  name="nome"
                  value={secao.nome}
                  onChange={(e) => handleChange('nome', e.target.value)}
                  required
                />
                <label htmlFor="name" className="input-label">
                  Nome Seção
                </label>
              </div>
              <div className="input-container">
                <input
                  type="text"
                  className="input-text"
                  name="descricao"
                  value={secao.descricao}
                  onChange={(e) => handleChange('descricao', e.target.value)}
                  required
                />
                <label htmlFor="name" className="input-label">
                  Descrição
                </label>
              </div>
              <div className="input-container">
                <input
                  type="text"
                  className="input-text"
                  name="divisaoId"
                  value={secao.idDivisao}
                  onChange={(e) => handleChange('idDivisao', e.target.value)}
                  required
                />
                <label htmlFor="name" className="input-label">
                  ID da Divisão
                </label>
              </div>

              <div className="btns">
                <button
                  type="button"
                  id="cancel-btn"
                  className="cancel-btn"
                  // onClick={handleCancelar}
                  defaultChecked
                >
                  Cancelar
                </button>

                <input
                  type="submit"
                  className="input-submit"
                  id="submit"
                  value="Cadastrar"
                />
              </div>
            </div>
          </div>
          <div className="background-area"></div>
        </div>
      </form>
    </div>
  );
}
