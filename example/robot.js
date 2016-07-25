import env from 'node-env-file'
import geolib from 'geolib'
import PokeAPI from '../src'

env(__dirname + '/.env');

//Set environment variables or replace placeholder text
var username = process.env.PGO_USERNAME || 'USER'
var password = process.env.PGO_PASSWORD || 'PASS'
var provider = process.env.PGO_PROVIDER || 'ptc'
var lat = process.env.LATITUDE || 40.759211
var lng = process.env.LONGITUDE || -73.984472



//
// work in progress.. dont use this..
//

const Poke = new PokeAPI()

async function init() {
  //yep, we do need to login..

  Poke.player.location = {
    latitude: parseFloat(lat),
    longitude: parseFloat(lng),
  }

  const api = await Poke.login(username, password, provider)

  // just update the profile...
  let player = await Poke.GetPlayer()



  // // get map objects..
  // while( true ){
  //   let cells = await Poke.GetMapObjects()
  //   for(let cell of cells) {
  //     // catchable pokemons from here?
  //     if (cell.catchable_pokemons.length > 0){
  //       cell.catchable_pokemons.map(pokemon => {
  //         pokemon.encounterAndCatch()
  //       })
  //     }

  //     // wild pokemons
  //     if (cell.wild_pokemons.length > 0){
  //       // we have wild pokemons
  //     }

  //     // forts
  //     if (cell.forts.length > 0){
  //       // we have wild pokemons
  //     }

  //     //Done...
  //     //TODO: We need to move.. like a human..!
  //   }
  //   await Poke.player.walkAround()
  // }
}

init().catch(console.log)
