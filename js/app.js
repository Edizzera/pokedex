let baseDados = [] 
const button = document.querySelector('button')

button.onclick = () => alert("ola")

//Obj
let activeRegions = {
    'kanto': { active: false, startIndex: 0, finalIndex: 151 },
    'Johto': { active: false, startIndex: 151, finalIndex: 251 },
    'Hoenn': { active: false, startIndex: 252, finalIndex: 386 },
    'Sinnoh': { active: false, startIndex: 387, finalIndex: 491},
    'Unova': { active: false, startIndex: 494, finalIndex: 694 }
}

const regionCheckboxClicked = region => {
    activeRegions[region].active = !activeRegions[region].active 
    let filteredActiveRegions = filterActiveRegions(activeRegions)
    let activePokemons = []
    Object.values(filteredActiveRegions).forEach(regionDetails => {
        let {startIndex,finalIndex} = regionDetails // Object Destructure
        activePokemons = activePokemons.concat(baseDados.slice(startIndex, finalIndex))
    })
    document.getElementById('container').innerHTML = ''
    activePokemons.forEach(pokemon => {
        createPokemonCard(pokemon)
        modalPokemon()
    })
}

const filterActiveRegions = (regions) => {
    let filtered = {}
    Object.keys(regions).forEach(region => {
        if (regions[region].active) {
            filtered[region] = regions[region]
        }        
    })
    return filtered
   
}

const getPokemon = async id => { //Função para pegar o pokemon da API
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`  // Armazena o endereço de onde a função deve pegar as informações
    const res = await fetch(url) // Armazena a promesa da Api que vem como Objeto
    const pokemon = await res.json()// Retorna um objeto Json    
    baseDados.push(pokemon)// Guarda os pokemons em um Array para serem usados depois

    
}

//Chama a função de carregamento x vezes
const loadAllPokemon = async () => {
    for(let i=1; i<= 150; i++) { // Arrumar! Carrega o numero de poquemon
      await  getPokemon(i)
    
    }
    baseDados.sort((p1,p2) => {
        
       return p1.id < p2.id
   })
   document.getElementById('container').innerHTML = ''
   baseDados.forEach((p) => {    
       createPokemonCard(p) 
      
   }) 
   //Chamada de Modal
   modalPokemon()   

}
 loadAllPokemon()

 const checkIfFavorite = pokemonId => {
    let favorites = JSON.parse(localStorage.getItem("favoritePokemons")) 
    if(favorites && favorites.includes(pokemonId)) {
        return true
    } 
    return false
 }

 const addPokemonToFavorite = pokemonId => {
     let favorites = JSON.parse(localStorage.getItem("favoritePokemons"))  || []  
     if(favorites && !checkIfFavorite(pokemonId)) {
         
         
         favorites.push(pokemonId)
         localStorage.setItem("favoritePokemons", JSON.stringify(favorites))
         
        } else if(!favorites){
            localStorage.setItem("favoritePokemons", JSON.stringify([pokemonId]))
        }
    }

//Cria e renderiza no html o card individual de cada pokemon
const createPokemonCard = pokemon => { 
    let pokemonCard =
    `<div class="poke-container ${pokemon.types[0].type.name}">
        <img src="https://pokeres.bastionbot.org/images/pokemon/${pokemon.id}.png" alt="foto ${pokemon.name}"> 
        <p class=${pokemon.id}>${pokemon.id}#</p>
        <p>${pokemon.types[0].type.name}</p>
        <h2>${pokemon.name}</h2>
        <button class="fav-open">Favorite pokemon </button>
        <button class="modal-open" data-modal="modal${pokemon.id}">Open Pokemon Info</button>
    </div>    
    <!-- Modals -->
  <div class="modal " id="modal${pokemon.id}">
    <div class="modal-content ${pokemon.types[0].type.name} ">
      <div class="modal-header"><h1> ${pokemon.name}</h1>
    
      </div>
      <div class="modal-body ">
      <img src="https://pokeres.bastionbot.org/images/pokemon/${pokemon.id}.png" alt="foto ${pokemon.name}width="42" height="30">
        <ul>
            <li>Weight: ${pokemon.weight}</li>
            <li>Height: ${pokemon.height}</li>
            <li>Speed: ${pokemon.stats[5].base_stat}</li>
            <li>Defense: ${pokemon.stats[2].base_stat}</li>
            <li>Attack: ${pokemon.stats[1].base_stat}</li>
            <li>Hp: ${pokemon.stats[0].base_stat}</li>            
        </ul>
       
      </div>
      <div class="modal-footer">
        <button class="link modal-close">Fechar</button>
      </div>
    </div>
  </div>`       

    document.getElementById('container').innerHTML += pokemonCard // Adiciona o novo elemento PokemonCardElement na página html
   
}
 //Filtro de Pokemons
 const searchPokemon = document.forms['pokemonSearchBar'].querySelector('input')
    searchPokemon.addEventListener('keyup', e => {
    const searchedPokemon  = e.target.value.toLowerCase()
    const filteredPokemons = baseDados.filter( pokemon => {
        return (
            pokemon.name.includes(searchedPokemon) ||
            pokemon.types[0].type.name.includes(searchedPokemon)
            )
        })
     document.getElementById('container').innerHTML = ''
     filteredPokemons.forEach(pokemon => {
         createPokemonCard(pokemon)
         modalPokemon()
  
     })
 })

//  MODALS 
 const modalPokemon = () => {
    let modalBtns = document.querySelectorAll(".modal-open")
    let closeBtns = document.querySelectorAll(".modal-close")
 
    modalBtns.forEach( btn => {
     btn.onclick = () => {
         let modal = btn.getAttribute("data-modal")
         document.getElementById(modal).style.display = "block"
     }
 }) 
 closeBtns.forEach(btn => {
     btn.onclick = () => {
         let modal =(btn.closest(".modal").style.display = "none")
     }
 })

 }   
 

 
