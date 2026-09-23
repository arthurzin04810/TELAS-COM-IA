/* =====================================
   DADOS
===================================== */

let produtos =
  JSON.parse(
    localStorage.getItem("lacProdutos")
  ) || [];


let clientes =
  JSON.parse(
    localStorage.getItem("lacClientes")
  ) || [];


let carrinho =
  JSON.parse(
    localStorage.getItem("lacCarrinho")
  ) || [];


let imagemSelecionada = "";


/* =====================================
   SALVAR
===================================== */

function salvarProdutos() {

  localStorage.setItem(
    "lacProdutos",
    JSON.stringify(produtos)
  );

}


function salvarClientes() {

  localStorage.setItem(
    "lacClientes",
    JSON.stringify(clientes)
  );

}


function salvarCarrinho() {

  localStorage.setItem(
    "lacCarrinho",
    JSON.stringify(carrinho)
  );

}


/* =====================================
   NAVEGAÇÃO ENTRE ABAS
===================================== */

function abrirAba(nomeAba) {

  const abas =
    document.querySelectorAll(".aba");


  const botoes =
    document.querySelectorAll(".menu-btn");


  abas.forEach(aba => {

    aba.classList.remove("ativa");

  });


  botoes.forEach(botao => {

    botao.classList.remove("ativo");

  });


  const aba =
    document.getElementById(nomeAba);


  if (aba) {

    aba.classList.add("ativa");

  }


  const botao =
    document.querySelector(
      `[data-aba="${nomeAba}"]`
    );


  if (botao) {

    botao.classList.add("ativo");

  }


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });


  if (nomeAba === "vendas") {

    renderizarProdutos();

  }


  if (nomeAba === "carrinho") {

    atualizarCarrinho();

  }

}


/* =====================================
   FORMATAÇÃO DE PREÇO
===================================== */

function formatarPreco(valor) {

  return Number(valor).toLocaleString(
    "pt-BR",
    {
      style: "currency",
      currency: "BRL"
    }
  );

}


/* =====================================
   CLIENTES
===================================== */

const formCliente =
  document.getElementById(
    "formCliente"
  );


formCliente.addEventListener(
  "submit",
  function(event) {

    event.preventDefault();


    const dados =
      new FormData(formCliente);


    const cliente = {

      id:
        Date.now(),

      nome:
        dados.get("nome"),

      cpf:
        dados.get("cpf"),

      telefone:
        dados.get("telefone"),

      email:
        dados.get("email"),

      cep:
        dados.get("cep"),

      logradouro:
        dados.get("logradouro"),

      numero:
        dados.get("numero"),

      bairro:
        dados.get("bairro"),

      cidade:
        dados.get("cidade"),

      uf:
        dados.get("uf").toUpperCase()

    };


    clientes.push(cliente);


    salvarClientes();


    formCliente.reset();


    document.getElementById(
      "avisoCliente"
    ).textContent =
      "Cliente cadastrado com sucesso!";


    renderizarClientes();

  }
);


/* =====================================
   MOSTRAR CLIENTES
===================================== */

function renderizarClientes() {

  const corpo =
    document.getElementById(
      "corpoTabelaClientes"
    );


  corpo.innerHTML = "";


  if (clientes.length === 0) {

    corpo.innerHTML = `

      <tr>

        <td colspan="6">

          Nenhum cliente cadastrado.

        </td>

      </tr>

    `;

    return;

  }


  clientes.forEach(cliente => {

    const linha =
      document.createElement("tr");


    linha.innerHTML = `

      <td>
        ${cliente.id}
      </td>

      <td>
        ${cliente.nome}
      </td>

      <td>
        ${cliente.telefone || "-"}
      </td>

      <td>
        ${cliente.email || "-"}
      </td>

      <td>
        ${cliente.cidade || "-"}
        ${cliente.uf || ""}
      </td>

      <td>

        <button
          class="btn-excluir"
          onclick="excluirCliente(${cliente.id})">

          Excluir

        </button>

      </td>

    `;


    corpo.appendChild(linha);

  });

}


/* =====================================
   EXCLUIR CLIENTE
===================================== */

function excluirCliente(id) {

  const confirmar =
    confirm(
      "Deseja excluir este cliente?"
    );


  if (!confirmar) {

    return;

  }


  clientes =
    clientes.filter(
      cliente =>
        cliente.id !== id
    );


  salvarClientes();

  renderizarClientes();

}


/* =====================================
   UPLOAD DE IMAGEM
===================================== */

const inputImagem =
  document.getElementById(
    "imagemProduto"
  );


inputImagem.addEventListener(
  "change",
  function(event) {

    const arquivo =
      event.target.files[0];


    if (!arquivo) {

      imagemSelecionada = "";

      document.getElementById(
        "previewImagem"
      ).innerHTML = "";

      return;

    }


    if (
      !arquivo.type.startsWith("image/")
    ) {

      alert(
        "Selecione um arquivo de imagem."
      );

      inputImagem.value = "";

      return;

    }


    const leitor =
      new FileReader();


    leitor.onload =
      function(e) {

        imagemSelecionada =
          e.target.result;


        document.getElementById(
          "previewImagem"
        ).innerHTML = `

          <img
            src="${imagemSelecionada}"
            alt="Prévia do produto">

        `;

      };


    leitor.readAsDataURL(arquivo);

  }
);


/* =====================================
   CADASTRO DE PRODUTO
===================================== */

const formProduto =
  document.getElementById(
    "formProduto"
  );


formProduto.addEventListener(
  "submit",
  function(event) {

    event.preventDefault();


    const dados =
      new FormData(formProduto);


    const produto = {

      id:
        Date.now(),

      nome:
        dados.get("nome"),

      categoria:
        dados.get("categoria"),

      preco:
        Number(
          dados.get("preco")
        ),

      estoque:
        Number(
          dados.get("estoque")
        ),

      descricao:
        dados.get("descricao"),

      imagem:
        imagemSelecionada

    };


    produtos.push(produto);


    salvarProdutos();


    formProduto.reset();


    imagemSelecionada = "";


    document.getElementById(
      "previewImagem"
    ).innerHTML = "";


    document.getElementById(
      "avisoProduto"
    ).textContent =
      "Produto cadastrado com sucesso!";


    renderizarProdutosTabela();

    renderizarProdutos();

  }
);


/* =====================================
   TABELA DE PRODUTOS
===================================== */

function renderizarProdutosTabela() {

  const corpo =
    document.getElementById(
      "corpoTabelaProdutos"
    );


  corpo.innerHTML = "";


  if (produtos.length === 0) {

    corpo.innerHTML = `

      <tr>

        <td colspan="7">

          Nenhum produto cadastrado.

        </td>

      </tr>

    `;

    return;

  }


  produtos.forEach(produto => {

    const linha =
      document.createElement("tr");


    const imagem =
      produto.imagem

        ? `

          <img
            class="imagem-tabela"
            src="${produto.imagem}"
            alt="${produto.nome}">

        `

        : "⚽";


    linha.innerHTML = `

      <td>
        ${imagem}
      </td>

      <td>
        ${produto.id}
      </td>

      <td>
        ${produto.nome}
      </td>

      <td>
        ${produto.categoria}
      </td>

      <td>
        ${formatarPreco(produto.preco)}
      </td>

      <td>
        ${produto.estoque}
      </td>

      <td>

        <button
          class="btn-excluir"
          onclick="excluirProduto(${produto.id})">

          Excluir

        </button>

      </td>

    `;


    corpo.appendChild(linha);

  });

}


/* =====================================
   EXCLUIR PRODUTO
===================================== */

function excluirProduto(id) {

  const confirmar =
    confirm(
      "Deseja excluir este produto?"
    );


  if (!confirmar) {

    return;

  }


  produtos =
    produtos.filter(
      produto =>
        produto.id !== id
    );


  carrinho =
    carrinho.filter(
      item =>
        item.id !== id
    );


  salvarProdutos();

  salvarCarrinho();

  renderizarProdutosTabela();

  renderizarProdutos();

  atualizarCarrinho();

}


/* =====================================
   VITRINE
===================================== */

function renderizarProdutos() {

  const vitrine =
    document.getElementById(
      "vitrine"
    );


  const busca =
    document.getElementById(
      "buscaProduto"
    ).value
      .toLowerCase();


  const categoria =
    document.getElementById(
      "filtroCategoria"
    ).value;


  vitrine.innerHTML = "";


  const filtrados =
    produtos.filter(produto => {

      const combinaBusca =
        produto.nome
          .toLowerCase()
          .includes(busca);


      const combinaCategoria =
        categoria === "todos" ||
        produto.categoria === categoria;


      return (
        combinaBusca &&
        combinaCategoria
      );

    });


  if (filtrados.length === 0) {

    vitrine.innerHTML = `

      <div class="painel">

        <h3>
          Nenhum produto encontrado.
        </h3>

        <p>
          Cadastre um produto na aba
          "Produtos" para ele aparecer aqui.
        </p>

      </div>

    `;

    return;

  }


  filtrados.forEach(produto => {

    const card =
      document.createElement("div");


    card.className =
      "produto-card";


    const imagem =
      produto.imagem

        ? `

          <img
            src="${produto.imagem}"
            alt="${produto.nome}">

        `

        : `

          <span class="sem-imagem">
            ⚽
          </span>

        `;


    const semEstoque =
      produto.estoque <= 0;


    card.innerHTML = `

      <div class="produto-imagem">

        ${imagem}

      </div>


      <div class="produto-info">

        <div class="produto-categoria">

          ${produto.categoria}

        </div>


        <div class="produto-nome">

          ${produto.nome}

        </div>


        <div class="produto-descricao">

          ${
            produto.descricao ||
            "Produto de futebol LAC Esportes."
          }

        </div>


        <div class="produto-preco">

          ${formatarPreco(produto.preco)}

        </div>


        <div class="produto-estoque">

          ${
            semEstoque
              ? "Produto esgotado"
              : `${produto.estoque} unidade(s) em estoque`
          }

        </div>


        <button
          class="botao-comprar"
          ${
            semEstoque
              ? "disabled"
              : ""
          }
          onclick="adicionarCarrinho(${produto.id})">

          ${
            semEstoque
              ? "Esgotado"
              : "Adicionar ao carrinho"
          }

        </button>

      </div>

    `;


    vitrine.appendChild(card);

  });

}


/* =====================================
   FILTROS
===================================== */

document
  .getElementById("buscaProduto")
  .addEventListener(
    "input",
    renderizarProdutos
  );


document
  .getElementById("filtroCategoria")
  .addEventListener(
    "change",
    renderizarProdutos
  );


/* =====================================
   ADICIONAR AO CARRINHO
===================================== */

function adicionarCarrinho(id) {

  const produto =
    produtos.find(
      produto =>
        produto.id === id
    );


  if (!produto) {

    return;

  }


  if (produto.estoque <= 0) {

    alert(
      "Este produto está esgotado."
    );

    return;

  }


  const item =
    carrinho.find(
      item =>
        item.id === id
    );


  if (item) {

    if (
      item.quantidade <
      produto.estoque
    ) {

      item.quantidade++;

    } else {

      alert(
        "Você atingiu o limite de estoque."
      );

    }

  } else {

    carrinho.push({

      id: id,

      quantidade: 1

    });

  }


  salvarCarrinho();

  atualizarCarrinho();

  abrirAreaCarrinho();

}


/* =====================================
   ATUALIZAR CARRINHO
===================================== */

function atualizarCarrinho() {

  const quantidade =
    carrinho.reduce(
      (total, item) =>
        total + item.quantidade,
      0
    );


  const contador =
    document.getElementById(
      "contadorCarrinho"
    );


  const contadorMenu =
    document.getElementById(
      "contadorMenuCarrinho"
    );


  const totalCarrinho =
    document.getElementById(
      "totalCarrinho"
    );


  if (contador) {

    contador.textContent =
      quantidade;

  }


  if (contadorMenu) {

    contadorMenu.textContent =
      quantidade;

  }


  if (totalCarrinho) {

    totalCarrinho.textContent =
      quantidade;

  }


  const area =
    document.getElementById(
      "itensCarrinho"
    );


  const areaPagina =
    document.getElementById(
      "itensCarrinhoPagina"
    );


  if (area) {

    area.innerHTML = "";

  }


  if (areaPagina) {

    areaPagina.innerHTML = "";

  }


  let total = 0;


  carrinho.forEach(item => {

    const produto =
      produtos.find(
        produto =>
          produto.id === item.id
      );


    if (!produto) {

      return;

    }


    const subtotal =
      produto.preco *
      item.quantidade;


    total += subtotal;


    /* CARRINHO DA LOJA */

    if (area) {

      const div =
        document.createElement("div");


      div.className =
        "item-carrinho";


      div.innerHTML = `

        ${
          produto.imagem

            ? `

              <img
                src="${produto.imagem}"
                alt="${produto.nome}">

            `

            : `

              <span>
                ⚽
              </span>

            `
        }


        <div class="item-info">

          <strong>
            ${produto.nome}
          </strong>

          <span>

            ${item.quantidade}
            x
            ${formatarPreco(produto.preco)}

          </span>

        </div>


        <strong>

          ${formatarPreco(subtotal)}

        </strong>

      `;


      area.appendChild(div);

    }



    /* PÁGINA DO CARRINHO */

    if (areaPagina) {

      const div =
        document.createElement("div");


      div.className =
        "item-carrinho-pagina";


      const imagem =
        produto.imagem

          ? `

            <img
              src="${produto.imagem}"
              alt="${produto.nome}">

          `

          : `

            <div class="produto-imagem">

              <span class="sem-imagem">
                ⚽
              </span>

            </div>

          `;


      div.innerHTML = `

        ${imagem}


        <div class="item-carrinho-pagina-info">

          <h3>
            ${produto.nome}
          </h3>


          <p>
            ${produto.categoria}
          </p>


          <p>
            ${formatarPreco(produto.preco)}
            por unidade
          </p>


          <div class="quantidade-controle">

            <button
              onclick="alterarQuantidade(
                ${produto.id},
                -1
              )">

              −

            </button>


            <span>
              ${item.quantidade}
            </span>


            <button
              onclick="alterarQuantidade(
                ${produto.id},
                1
              )">

              +

            </button>

          </div>

        </div>


        <div>

          <div class="item-carrinho-pagina-preco">

            ${formatarPreco(subtotal)}

          </div>


          <button
            class="remover-item"
            onclick="removerCarrinho(${produto.id})">

            Remover

          </button>

        </div>

      `;


      areaPagina.appendChild(div);

    }

  });


  /* CARRINHO VAZIO */

  if (
    areaPagina &&
    carrinho.length === 0
  ) {

    areaPagina.innerHTML = `

      <div class="carrinho-vazio">

        <div class="icone">
          🛒
        </div>


        <h3>
          Seu carrinho está vazio
        </h3>


        <p>
          Adicione produtos de futebol
          para começar sua compra.
        </p>


        <button
          class="botao-principal"
          onclick="abrirAba('vendas')">

          Ver produtos

        </button>

      </div>

    `;

  }


  /* VALORES */

  const valorTotal =
    document.getElementById(
      "valorTotal"
    );


  const quantidadeResumo =
    document.getElementById(
      "quantidadeResumo"
    );


  const subtotalResumo =
    document.getElementById(
      "subtotalResumo"
    );


  const totalResumo =
    document.getElementById(
      "totalResumo"
    );


  if (valorTotal) {

    valorTotal.textContent =
      formatarPreco(total);

  }


  if (quantidadeResumo) {

    quantidadeResumo.textContent =
      quantidade;

  }


  if (subtotalResumo) {

    subtotalResumo.textContent =
      formatarPreco(total);

  }


  if (totalResumo) {

    totalResumo.textContent =
      formatarPreco(total);

  }

}


/* =====================================
   ALTERAR QUANTIDADE
===================================== */

function alterarQuantidade(
  id,
  quantidade
) {

  const item =
    carrinho.find(
      item =>
        item.id === id
    );


  const produto =
    produtos.find(
      produto =>
        produto.id === id
    );


  if (!item || !produto) {

    return;

  }


  item.quantidade += quantidade;


  if (item.quantidade <= 0) {

    removerCarrinho(id);

    return;

  }


  if (
    item.quantidade >
    produto.estoque
  ) {

    item.quantidade =
      produto.estoque;


    alert(
      "Você atingiu o limite de estoque disponível."
    );

  }


  salvarCarrinho();

  atualizarCarrinho();

  renderizarProdutos();

}


/* =====================================
   REMOVER DO CARRINHO
===================================== */

function removerCarrinho(id) {

  carrinho =
    carrinho.filter(
      item =>
        item.id !== id
    );


  salvarCarrinho();

  atualizarCarrinho();

  renderizarProdutos();

}


/* =====================================
   ABRIR CARRINHO DA LOJA
===================================== */

function abrirAreaCarrinho() {

  const area =
    document.getElementById(
      "areaCarrinho"
    );


  if (area) {

    area.classList.add("aberto");

  }

}


/* =====================================
   FECHAR CARRINHO
===================================== */

function fecharCarrinho() {

  const area =
    document.getElementById(
      "areaCarrinho"
    );


  if (area) {

    area.classList.remove("aberto");

  }

}


/* =====================================
   FINALIZAR COMPRA
===================================== */

function finalizarCompra() {

  if (carrinho.length === 0) {

    alert(
      "Seu carrinho está vazio."
    );

    return;

  }


  alert(
    "Compra preparada com sucesso! " +
    "O próximo passo será integrar " +
    "a forma de pagamento e o checkout."
  );

}


/* =====================================
   INICIALIZAÇÃO
===================================== */

renderizarClientes();

renderizarProdutosTabela();

renderizarProdutos();

atualizarCarrinho();
