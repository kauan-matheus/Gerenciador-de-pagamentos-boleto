import axios from "axios";

export async function get(tabela) {
  const response = await axios.post(
    "http://localhost:80/Gerenciador-de-pagamentos-boleto/back_end/services/get.php",
    {tab: tabela},
    {
      headers: {
        "Content-type": "application/json",
      },
    }
  );

  return response;
}

export async function getDados(tabela, id) {
  const response = await axios.post(
    "http://localhost:80/Gerenciador-de-pagamentos-boleto/back_end/services/getDados.php",
    {
      tab: tabela,
      id: id,
    },
    {
      headers: {
        "Content-type": "application/json",
      },
    }
  );

  return response;
}

export async function dele(tabela, id) {
  const response = await axios.post(
    "http://localhost:80/Gerenciador-de-pagamentos-boleto/back_end/services/delete.php",
    {
      tab: tabela,
      id: id,
    },
    {
      headers: {
        "Content-type": "application/json",
      },
    }
  );

  return response;
}

export async function post(tabela, dados) {
  const response = await axios.post(
    "http://localhost:80/Gerenciador-de-pagamentos-boleto/back_end/services/post.php",
    {
      tab: tabela,
      dados: dados,
    },
    {
      headers: {
        "Content-type": "application/json",
      },
    }
  );

  return response;
}

export async function put(tabela, dados, id) {
  const response = await axios.post(
    "http://localhost:80/Gerenciador-de-pagamentos-boleto/back_end/services/put.php",
    {
      tab: tabela,
      dados: dados,
      id: id,
    },
    {
      headers: {
        "Content-type": "application/json",
      },
    }
  );

  return response;
}


export async function validacao() {
  const response = await axios.get(
    "http://localhost:80/Gerenciador-de-pagamentos-boleto/back_end/usuario/validacao.php",
    {
      withCredentials: true,
      headers: {
        "Content-type": "application/json",
      },
    }
  );
  return response;
}

export async function getId() {
  const response = await axios.get(
    "http://localhost:80/Gerenciador-de-pagamentos-boleto/back_end/usuario/getId.php",
    {
      withCredentials: true,
      headers: {
        "Content-type": "application/json",
      },
    }
  );
  return response;
}
