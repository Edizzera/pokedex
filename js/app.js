let baseDados = []

let activeRegions = {
    'kanto': { active: false, startIndex: 0, finalIndex: 151 },
    'Johto': { active: false, startIndex: 152, finalIndex: 251 },
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
    baseDados.push(pokemon)
    
}


const loadAllPokemon = async () => {
    for(let i=1; i<=694; i++) {
      await  getPokemon(i)
    
    }
    baseDados.sort((p1,p2) => {
       return p1.id < p2.id
   })
   
   baseDados.forEach((p) => {
       createPokemonCard(p)
   })
}
 loadAllPokemon()





//Cria e renderiza no html o card individual de cada pokemon
const createPokemonCard = pokemon => { 
    let pokemonCard =
    `<div class="poke-container ${pokemon.types[0].type.name} poke-card" id="poke_container">
        <img src="${pokemon.sprites.front_default}" alt="foto ${pokemon.name}"> 
        <p>${pokemon.id}#</p>
        <p>${pokemon.types[0].type.name}</p>
        <h2>${pokemon.name}</h2>
    </div>`

    document.getElementById('container').innerHTML += pokemonCard // Adiciona o novo elemento PokemonCardElement na página html
  
}

 //Filtro de Pokemons
// Falta deixar tudo em lowercase
 const searchPokemon = document.forms['pokemonSearchBar'].querySelector('input')
    searchPokemon.addEventListener('keyup', e => {
    const searchedPokemon  = e.target.value
    const filteredPokemons = baseDados.filter( pokemon => {
        return (
            pokemon.name.includes(searchedPokemon) ||
            pokemon.types[0].type.name.includes(searchedPokemon)
            )
        })
     document.getElementById('container').innerHTML = ''
     filteredPokemons.forEach(pokemon => {
         createPokemonCard(pokemon)
     })
 })