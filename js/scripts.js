// IIFE pokemonRepository
let pokemonRepository = (function (){
  // array of objects
let pokemonList = [];
let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';
let modalContainer = document.querySelector('#modal-container');

    // allows to add only objects with the add function
    function add(pokemon) { 
        if (
        typeof pokemon === 'object' &&
        'name' in pokemon &&
        'detailsUrl' in pokemon
        ){
        pokemonList.push(pokemon);
      }else {
        console.log("pokemon not found")
      }
    }

      // allows access to the pokemonList from outside the IIFE
    function getAll() { 
        return pokemonList;
      }
      // displays list as ul and something happens when you press each button
    function addListItem(pokemon) { 
      let pokemonList = document.querySelector(".pokemon-list");
      let listPokemon = document.createElement('li');
      let button = document.createElement('button');
      button.innerText = pokemon.name;
      button.addEventListener("click", function () {
        showDetails(pokemon); });
      button.classList.add("button-class");
      listPokemon.appendChild(button);
      pokemonList.appendChild(listPokemon);
    }
    // retrieves the list of pokemons from the api
    function loadList() {
        showLoadingMessage();
      return fetch(apiUrl).then(function (response) {
        return response.json();
      }).then(function (json) {
        json.results.forEach(function (item) {
          let pokemon = {
            name: item.name,
            detailsUrl: item.url
          };
        add(pokemon);
        });
      }).then(function(){
        hideLoadingMessage();
      })  .catch(function (e) {
        console.error (e);
      })
      hideLoadingMessage();
    }

    // loads the details of each pokemon using fetch
    function loadDetails(item) {
      showLoadingMessage();
      let url = item.detailsUrl;
      return fetch(url).then(function (response) {
        return response.json();
    }).then(function (details) {
      // Now we add the details to the item
      item.imageUrl = details.sprites.front_default;
      item.height = details.height;
      item.types = details.types;
    }).then(function (){
      hideLoadingMessage();
    }).catch(function (e) {
      console.error(e);
    });
    hideLoadingMessage();
  }

  
      // displays pokemon details in the console when button is clicked
    function showDetails(item) {
    pokemonRepository.loadDetails(item).then(function () {
      console.log(item);
    });
  } 
    // shows loading img
    function showLoadingMessage() {
    loadImage = document.querySelector(".loadingImage");
    loadImage.classList.add("show");
  }

  // hides loading img
    function hideLoadingMessage() {
    loadImage = document.querySelector(".loadingImage");
    loadImage.classList.remove("show");
  }

   function showModal(pokemon) {
    // Clear all existing modal content
    modalContainer.innerHTML = '';
    let modal = document.createElement('div');
    modal.classList.add('modal');
    // Add the new modal content
    let closeButtonElement = document.createElement('button');
    closeButtonElement.classList.add('modal-close');
    closeButtonElement.innerText = 'Close';
    closeButtonElement.addEventListener('click', hideModal);
    let modalTitle = document.createElement('h1');
    modalTitle.innerText = pokemon.name;
    let modalContent = document.createElement('p');
    modalContent.innerText = 'Height: ' + pokemon.height + 'm';
    let pokemonType = document.createElement('p');
    pokemonType.innerText = pokemon.type;
    let pokemonImg = document.createElement('img');
    pokemonImg.src = pokemon.imageUrl;

    modal.appendChild(closeButtonElement);
    modal.appendChild(modalTitle);
    modal.appendChild(modalContent);
    modal.appendChild(pokemonImg);
    modal.appendChild(pokemonType);
    modalContainer.appendChild(modal);
    modalContainer.classList.add('is-visible');
}

    function hideModal() {
      modalContainer.classList.remove('is-visible');
    }

    window.addEventListener('keydown', (e) => {
      let modalContainer = document.querySelector('#modal-container');
      if (e.key === 'Escape' && modalContainer.classList.contains('is-visible')) {
        hideModal();  
      }
    });
    modalContainer.addEventListener('click', (e) => {
      // only closing if the user clicks directly on the overlay
      let target = e.target;
      if (target === modalContainer) {
        hideModal();
      }
    });


     
    return {
      add: add,
      getAll: getAll,
      addListItem: addListItem,
      loadList: loadList,
      loadDetails: loadDetails,
      showDetails: showDetails,
      showLoadingMessage: showLoadingMessage,
      hideLoadingMessage: hideLoadingMessage,
      hideModal: hideModal
    };
})();


pokemonRepository.loadList().then(function () {
  // displays loading img in browser
  pokemonRepository.showLoadingMessage();
  // timer to stimulate data loading time
  setTimeout(function() {
    // data is loaded
    pokemonRepository.getAll().forEach(function (pokemon) {
      // data is  displayed
      pokemonRepository.addListItem(pokemon);
  })
    // loading img hidden 
    pokemonRepository.hideLoadingMessage();
  }, 1000)
});


let pokemons = ["Charmande", "Bulbasaur", "Butterfree", "Pikachu", "Jigglypuff", "Meowth"]
/**
 * Filter array items based on search criteria 
 */
function filterItems(arr, query) {
  return arr.filter(function(el) {
      return el.toLowerCase().indexOf(query.toLowerCase()) !== -1
  })
}

console.log(filterItems(pokemons, 'ch'))  // ['Pikachu', 'Charmande']
console.log(filterItems(pokemons, 'bu'))  // ['Butterfree', 'Bulbasaur']
console.log(filterItems(pokemons, 'ji'))  // ['Jigglypuff']
console.log(filterItems(pokemons, 'me'))  // ['Meowth']

