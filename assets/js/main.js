// Seleciona o elemento HTML com o ID 'pokemonList' que representa a lista de Pokémon.
const pokemonList = document.getElementById('pokemonList');

// Seleciona o botão "Load More" através do ID 'loadMoreButton'.
const loadMoreButton = document.getElementById('loadMoreButton');

// Número máximo de registros na Pokédex.
const maxRecords = 151;

// Número de Pokémon a serem carregados por vez.
const limit = 10;

// Contador de deslocamento (offset) para a próxima carga de Pokémon.
let offset = 0;

// Função para converter os detalhes de um Pokémon em um elemento de lista HTML.
function convertPokemonToLi(pokemon) {
//funciona de maneira semelhante a um loop for, mas é mais concisa e expressiva. Vamos entender melhor:
//pokemon.types.map(type => ...): Isso está utilizando o método map que é uma função de ordem superior em arrays. Ele percorre cada elemento do array pokemon.types e executa a função passada como argumento para cada elemento. No caso, a função é uma arrow function que cria uma string representando um elemento <li> para cada tipo.
//join(''): Após o map, o método join('') é usado para unir todas essas strings em uma única string. O argumento '' é usado para garantir que não haja separadores entre os elementos. Se você omitir o argumento ou usar ,, haverá vírgulas entre os elementos na string resultante.
//Assim, o resultado dessa expressão é uma única string contendo todos os elementos <li> gerados para cada tipo do Pokémon, prontos para serem incorporados em algum lugar do HTML.
    return `
        <li class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `;
}

// Função para carregar Pokémon na lista HTML.
function loadPokemonItems(offset, limit) {
    // Obtém os Pokémon da API usando a função getPokemons do objeto pokeApi.
    pokeApi.getPokemons(offset, limit)
        .then(pokemons => {
            // Converte os detalhes dos Pokémon em elementos de lista.
            const newHtml = pokemons.map(convertPokemonToLi).join('');
            
            // Adiciona os novos elementos à lista existente no HTML.
            pokemonList.innerHTML += newHtml;
        })
        .catch(error => {
            // Lida com erros, se houver algum.
            console.error('Erro ao carregar Pokémon:', error);
        });
}

// Inicializa o carregamento dos primeiros Pokémon ao carregar a página.
loadPokemonItems(offset, limit);

// Adiciona um ouvinte de eventos para o botão "Load More".
loadMoreButton.addEventListener('click', () => {
    // Atualiza o deslocamento para carregar a próxima página de Pokémon.
    offset += limit;
    const qtdRecordsWithNextPage = offset + limit;

    // Verifica se atingiu ou ultrapassou o número máximo de registros.
    if (qtdRecordsWithNextPage >= maxRecords) {
        const newLimit = maxRecords - offset;
        // Carrega os últimos Pokémon restantes e remove o botão "Load More".
        loadPokemonItems(offset, newLimit);
        loadMoreButton.parentElement.removeChild(loadMoreButton);
    } else {
        // Carrega mais Pokémon se não atingiu o limite máximo.
        loadPokemonItems(offset, limit);
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const pokemons = document.querySelectorAll('.pokemon');

    pokemons.forEach(pokemon => {
        pokemon.addEventListener('mouseover', () => {
            const dialogBox = document.createElement('div');
            dialogBox.classList.add('dialog-box');
            dialogBox.innerHTML = `
                <h2>${pokemon.querySelector('.name').textContent}</h2>
                <p>Type: ${pokemon.classList.contains('type') ? pokemon.classList[1] : 'Unknown'}</p>
                <p>Number: ${pokemon.querySelector('.number').textContent}</p>
                <img src="${pokemon.querySelector('.detail img').src}" alt="${pokemon.querySelector('.name').textContent}">`;

            document.body.appendChild(dialogBox);

            const rect = pokemon.getBoundingClientRect();
            const topPosition = rect.bottom + window.scrollY + 10;
            const leftPosition = rect.left + window.scrollX;

            dialogBox.style.top = `${topPosition}px`;
            dialogBox.style.left = `${leftPosition}px`;

            pokemon.addEventListener('mouseout', () => {
                document.body.removeChild(dialogBox);
            });
        });
    });
});
