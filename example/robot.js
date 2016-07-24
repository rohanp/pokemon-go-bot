import env from 'node-env-file'
import PokeAPI from '../src'
env(__dirname + '/.env');


var username = process.env.PGO_USERNAME || 'USER'
var password = process.env.PGO_PASSWORD || 'PASS'
var provider = process.env.PGO_PROVIDER || 'ptc'
var latitude = process.env.PGO_LATITUDE || 40.759211
var longitude = process.env.PGO_LONGITUDE || -73.984472

//Set environment variables or replace placeholder text
var location = {
    type: 'coords',
    coords: {
      latitude: 55.732112,
      longitude: 12.580053,
      altitude: 20,
    }
};


const Poke = new PokeAPI()

async function init() {
  //yep, we do need to login..

  const api = await Poke.login(username, password, location, provider)

  // just update the profile...
  let player = await Poke.GetPlayer()

  // get map objects..
  while( true ){
    let cells = await Poke.GetMapObjects()
    for(let cell of cells) {
      // catchable pokemons from here?
      if (cell.catchable_pokemons.length > 0){
        for (var pokemon of cell.catchable_pokemons) {
          // we have wild pokemons
          let encounterResult = await Poke.EncounterPokemon(pokemon);
          console.log(encounterResult)
          throw new Error('encounter..')
        }
      }

      // wild pokemons
      if (cell.wild_pokemons.length > 0){
        // we have wild pokemons
        console.log(cell)
      }

      // forts
      if (cell.forts.length > 0){
        // we have wild pokemons
      }

      //Done...
      //TODO: We need to move.. like a human..!
    }
    await Poke.player.walkAround()
    await new Promise(resolve => setTimeout(resolve, 3000))
  }
}

init().catch(console.log)
