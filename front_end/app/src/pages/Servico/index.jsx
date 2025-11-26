import { useState, useMemo, useEffect } from "react";
import Modal from "../../components/Modal";
import axios from "axios";
import { get, getDados, post, dele, put } from "../../controller";
import { useNavigate, useOutletContext} from "react-router-dom";
import md5 from "md5";

const tamPagina = 6;

export default function ServicoPage() {
  const {logado, setLogado, userType, setUserType, logadoID, setLogadoID, message, setMessage} = useOutletContext();
  const navigate = useNavigate();

  const [servicos, setServicos] = useState([]);
  const [selected, setSelected] = useState(null);

  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState(1);

  // fetch data
  const fetchData = async () => {
    const response = await get("servico");
    if (response.data.type == "success") {
      setServicos(JSON.parse(response.data.data));
    }
  }

  const checarTipo = () => {
    if (userType != 0){
      setMessage("É necessario ser um adm para acessar essa pagina");
      navigate("/");
    }
  }

  //🔍 Filtragem por busca
  const servicosFiltrados = useMemo(() => {
    return servicos.filter(
      (s) => s.nome.includes(search) || s.preco.toString().includes(search)
    );
  }, [search, servicos]);

  // 🔢 Paginação
  const totalPaginas = Math.ceil(servicosFiltrados.length / tamPagina);
  const servicosAtual = useMemo(() => {
    const start = (paginaAtual - 1) * tamPagina;
    return servicosFiltrados.slice(start, start + tamPagina);
  }, [paginaAtual, servicosFiltrados]);

  const submitForm = async (event) => {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    var response;

    const servico = {
      nome: formData.get("nome"),
      descricao: formData.get("descricao"),
      preco: parseFloat(formData.get("preco")),
      modificador: logadoID,
    };

    if (selected){
      response = await put("servico", servico, selected.id);
    }else{
      response = await post("servico", servico);
    }

    if (response.data.type == "success") {
      setMessage(response.data.message);
      setOpenModal(false);
      fetchData(); 

    } else {
      setMessage(response.data.message);
    }

    form.reset();
  };

  const deleteForm = async (event) => {
    if (selected){
      const response = await dele("servico", selected.id);
      if (response.data.type == "success") {
        setMessage(response.data.message);
        setOpenModal(false);
        fetchData(); 
      } else {
        setMessage(response.data.message);
      }

    }else{
      setMessage("É necessario selecionar um servico para ser apagado");
    }
  };

  const selecionarLinha = async (servico) => {
    const response = await getDados("servico", servico.id);
    if (response.data) {
      setSelected(JSON.parse(response.data));
      setOpenModal(true);
    }
  };

  // atualiza a tabela usuarios se a pesquisa for alterada
  useEffect(() => {
    var timeout = setTimeout(() => {
      fetchData();
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [search, selected]);

  useEffect(() => {
    checarTipo();
  }, []);

  useEffect(() => {
    checarTipo();
  }, [logado]);

  return (
    <div className="main">
      <header className="pagamento-header">
        <h1>Gerenciamento de Servicos</h1>
        <p>Visualize, edite e adicione Usuários de forma simples e rápida.</p>
      </header>
      <div className="form">
        <input
          type="text"
          className="search"
          placeholder="Buscar por Nome ou Preço...."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn-search">
          <i className="fa-solid fa-magnifying-glass"></i>
        </button>
      </div>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Id</th>
              <th>Nome</th>
              <th>Preço</th>
            </tr>
          </thead>
          <tbody>
            {servicosAtual.length > 0 ? (
              servicosAtual.map((servico) => (
                <LinhaServico
                  key={servico.id}
                  servico={servico}
                  onClick={() => selecionarLinha(servico)}
                ></LinhaServico>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="empty">
                  Nenhum Servico encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="criar-boleto">
        <button
          className="btn-criar"
          onClick={() => {
            setSelected(null);
            setOpenModal(true);
          }}
        >
          <i className="fa-solid fa-square-plus"></i> Novo Servico
        </button>
      </div>
      {/* 📄 Paginação */}
      {totalPaginas > 1 && (
        <div className="pagination">
          <button
            onClick={() => setPaginaAtual((p) => Math.max(p - 1, 1))}
            disabled={paginaAtual === 1}
          >
            ←
          </button>
          {[...Array(totalPaginas)].map((_, idx) => {
            const page = idx + 1;
            return (
              <button
                key={page}
                className={page === paginaAtual ? "active" : ""}
                onClick={() => setPaginaAtual(page)}
              >
                {page}
              </button>
            );
          })}
          <button
            onClick={() => setPaginaAtual((p) => Math.min(p + 1, totalPaginas))}
            disabled={paginaAtual === totalPaginas}
          >
            →
          </button>
        </div>
      )}

      {/* 🪟 Modal do formulario */}
      <Modal open={openModal}>
        <form className="modal-form" onSubmit={submitForm}>
          <h2>{selected ? "Editar Servico" : "Novo Servico"}</h2>
          <div className="input-group">
            <label>Nome</label>
            <input
              defaultValue={selected?.nome || ""}
              type="text"
              name="nome"
              required
            />
          </div>
          <div className="input-group">
            <label>Descrição:</label>
            <textarea defaultValue={selected?.descricao} rows="3" cols="85" required name="descricao"></textarea>
          </div>
          <div className="input-group">
            <label>Preço</label>
            <input defaultValue={selected?.preco || ""} type="number" name="preco" required step="0.01" min="0" onWheel={(e) => e.target.blur()} />
          </div>

          {/* botoes do modal */}
          <div className="modal-actions">
            <button type="submit" className="btn-secondary">
              <i className="fa-solid fa-pen-to-square"></i>
            </button>
            <BotaoExcluir onDelete={() => deleteForm()}/>
            <button
              type="reset"
              className="btn-close"
              onClick={() => {
                setOpenModal(false), setSelected(null);
              }}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function BotaoExcluir({ onDelete }) {
    const [confirmando, setConfirmando] = useState(false);
    const {message, setMessage} = useOutletContext();

    function handleClick() {
        if (!confirmando) {
            setConfirmando(true);
            setMessage("Tem certeza que deseja apagar esse servico?");

            // volta ao estado normal depois de 3 segundos
            setTimeout(() => setConfirmando(false), 5000);
        } else {
            onDelete(); // aqui apaga de verdade
        }
    }

    return (
        <button type="button" className="btn-danger" onClick={handleClick}>
          <i className="fa-solid fa-trash"></i>
        </button>
    );
}

function LinhaServico({ servico, onClick }) {
  return (
    <tr key={servico.id} onClick={onClick}>
      <td>{servico.id}</td>
      <td>{servico.nome}</td>
      <td>
        {Number(servico.preco).toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
        })}
      </td>
    </tr>
  );
}
