// Buscar Pokémon aleatório e mostrar na tela
function buscarPokemon() {
  const numero = Math.floor(Math.random() * 151) + 1;
  const url = `https://pokeapi.co/api/v2/pokemon/${numero}`;

  const card = document.getElementById("pokemon");
  card.innerHTML = "<p>Carregando Pokémon... 🌀</p>";

  fetch(url)
    .then(resposta => resposta.json())
    .then(dados => {
      mostrarPokemon(dados);
    })
    .catch(erro => {
      card.innerHTML = "<p>Erro ao buscar Pokémon!</p>";
      console.error(erro);
    });
}

// Função que monta o HTML e mostra o Pokémon na tela, incluindo botão de favorito
function mostrarPokemon(dados) {
  const card = document.getElementById("pokemon");

  const nome = dados.name;
  const imagem = dados.sprites.front_default;
  const tipo = dados.types.map(t => t.type.name).join(", ");
  const numero = dados.id;
  const altura = dados.height / 10;
  const peso = dados.weight / 10;

  const html = `
    <h2>${nome.charAt(0).toUpperCase() + nome.slice(1)} (#${numero})</h2>
    <img src="${imagem}" alt="${nome}">
    <p><strong>Tipo:</strong> ${tipo}</p>
    <p><strong>Altura:</strong> ${altura} m</p>
    <p><strong>Peso:</strong> ${peso} kg</p>
    <button id="fav-btn">⭐ Adicionar aos favoritos</button>
  `;

  card.innerHTML = html;

  // Adiciona evento no botão de favoritos
  document.getElementById("fav-btn").addEventListener("click", () => {
    adicionarFavorito({
      id: numero,
      nome: nome,
      imagem: imagem,
      tipo: tipo
    });
  });
}

// Adicionar Pokémon aos favoritos e salvar no localStorage
function adicionarFavorito(pokemon) {
  let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

  // Verifica se já está na lista
  if (favoritos.some(p => p.id === pokemon.id)) {
    alert("Esse Pokémon já está nos favoritos!");
    return;
  }

  favoritos.push(pokemon);
  localStorage.setItem("favoritos", JSON.stringify(favoritos));
  mostrarFavoritos();
}

// Mostrar a lista de favoritos na tela
function mostrarFavoritos() {
  const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
  const div = document.getElementById("favoritos");

  if (favoritos.length === 0) {
    div.innerHTML = "<p>Nenhum favorito ainda.</p>";
    return;
  }

  div.innerHTML = favoritos.map(p => `
    <div class="favorito-card" onclick="removerFavorito(${p.id})" title="Clique para remover">
      <img src="${p.imagem}" alt="${p.nome}">
      <p>${p.nome.charAt(0).toUpperCase() + p.nome.slice(1)}</p>
    </div>
  `).join("");
}

// Remover Pokémon dos favoritos
function removerFavorito(id) {
  let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
  favoritos = favoritos.filter(p => p.id !== id);
  localStorage.setItem("favoritos", JSON.stringify(favoritos));
  mostrarFavoritos();
}

mostrarFavoritos();
