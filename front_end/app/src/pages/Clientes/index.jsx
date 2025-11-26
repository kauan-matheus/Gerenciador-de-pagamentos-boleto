import { useState, useMemo, useEffect, useReducer } from "react";
import Modal from "../../components/Modal";
import axios from "axios";
import { get, getDados, post, dele, put } from "../../controller";
import { useOutletContext} from "react-router-dom";
import md5 from "md5";

const tamPagina = 6;

export default function ClientePage() {
  const {logado, setLogado, logadoID, setLogadoID, message, setMessage} = useOutletContext();

  const [clientes, setClientes] = useState([]);
  const [selected, setSelected] = useState(null);

  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState(1);

  const [cnpj, setCnpj] = useReducer(
    (oldValue, newValue) => {
      if (newValue) {
        const apenasDigitos = newValue.replace(/[^\d]/g, "").substr(-14);
        const valorMascarado = apenasDigitos
          .replace(/^(\d{2})(\d)/, "$1.$2")
          .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
          .replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3/$4")
          .replace(/(\d{4})(\d{2})$/, "$1-$2");
        return valorMascarado;
      }
      return "";
    }, "");

  const [contato, setContato] = useReducer(
    (oldValue, newValue) => {
      if (newValue) {
        const apenasDigitos = newValue.replace(/[^\d]/g, "").substr(-11);
        const valorMascarado = apenasDigitos
          .replace(/^(\d{2})(\d)/, "($1) $2")      // adiciona DDD
          .replace(/(\d{5})(\d)/, "$1-$2")         // adiciona hífen
          .slice(0, 15);                           // limita tamanho final
        return valorMascarado;
      }
      return "";
    }, "");

  // fetch data
  const fetchData = async () => {
    const response = await get("cliente");
    if (response.data.type == "success") {
      setClientes(JSON.parse(response.data.data));
    }
  }

  //🔍 Filtragem por busca
  const clientesFiltrados = useMemo(() => {
    return clientes.filter(
      (c) => c.nome.includes(search) || c.cnpj.toString().includes(search) || c.email.toString().includes(search)
    );
  }, [search, clientes]);

  // 🔢 Paginação
  const totalPaginas = Math.ceil(clientesFiltrados.length / tamPagina);
  const clientesAtual = useMemo(() => {
    const start = (paginaAtual - 1) * tamPagina;
    return clientesFiltrados.slice(start, start + tamPagina);
  }, [paginaAtual, clientesFiltrados]);

  const submitForm = async (event) => {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    var response;

    const cliente = {
      cnpj: formData.get("cnpj"),
      nome: formData.get("nome"),
      email: formData.get("email"),
      contato: formData.get("contato"),
      modificador: logadoID,
    };

    if (selected){
      response = await put("cliente", cliente, selected.id);
    }else{
      response = await post("cliente", cliente);
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
      const response = await dele("cliente", selected.id);
      if (response.data.type == "success") {
        setMessage(response.data.message);
        setOpenModal(false);
        fetchData(); 
      } else {
        setMessage(response.data.message);
      }

    }else{
      setMessage("É necessario selecionar um cliente para ser apagado");
    }
  };

  const selecionarLinha = async (cliente) => {
    const response = await getDados("cliente", cliente.id);
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
    if (selected) {
        setCnpj(selected.cnpj);
        setContato(selected.contato);
    } else {
        setCnpj("");
        setContato("");
    }
  }, [selected])

  return (
    <div className="main">
      <header className="pagamento-header">
        <h1>Gerenciamento de Clientes</h1>
        <p>Visualize, edite e adicione Usuários de forma simples e rápida.</p>
      </header>
      <div className="form">
        <input
          type="text"
          className="search"
          placeholder="Buscar Nome, CNPJ ou Email...."
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
              <th>CNPJ</th>
              <th>Nome</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {clientesAtual.length > 0 ? (
              clientesAtual.map((cliente) => (
                <LinhaCliente
                  key={cliente.id}
                  cliente={cliente}
                  onClick={() => selecionarLinha(cliente)}
                ></LinhaCliente>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="empty">
                  Nenhum cliente encontrado.
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
          <i className="fa-solid fa-square-plus"></i> Novo Cliente
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
          <h2>{selected ? "Editar Cliente" : "Novo Cliente"}</h2>
          <div className="input-group">
            <label>CNPJ</label>
            <input
              value={cnpj}
              onKeyDown={(e) => {
                if (e.key.length == 1 && !e.key.match(/\d/)) {
                  e.preventDefault();
                }
              }}
              onChange={(e) => setCnpj(e.target.value)}
              required
              type="text"
              name="cnpj"
            />

          </div>
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
            <label>Email</label>
            <input
              defaultValue={selected?.email || ""}
              type="text"
              name="email"
              required
            />
          </div>
          <div className="input-group">
            <label>Contato</label>
            <input
              value={contato}
              onKeyDown={(e) => {
                if (e.key.length == 1 && !e.key.match(/\d/)) {
                  e.preventDefault();
                }
              }}
              onChange={(e) => setContato(e.target.value)}
              required
              type="text"
              name="contato"
            />
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
          setMessage("Tem certeza que deseja apagar esse cliente?");

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

function LinhaCliente({ cliente, onClick }) {
  return (
    <tr key={cliente.id} onClick={onClick}>
      <td>{cliente.id}</td>
      <td>{cliente.cnpj}</td>
      <td>{cliente.nome}</td>
      <td>{cliente.email}</td>
    </tr>
  );
}
