import env from 'node-env-file'
import PokeAPI from '../src'

import geolib from 'geolib'

env(__dirname + '/.env');


var username = process.env.PGO_USERNAME || 'USER'
var password = process.env.PGO_PASSWORD || 'PASS'
var provider = process.env.PGO_PROVIDER || 'ptc'
var latitude = process.env.PGO_LATITUDE || 40.759211
var longitude = process.env.PGO_LONGITUDE || -73.984472

//Set environment variables or replace placeholder text

const Poke = new PokeAPI()

async function init() {
  //yep, we do need to login..

  Poke.player.location = {
    latitude: 55.70000932453345,
    longitude: 12.524757385253906,
  }

  const api = await Poke.login(username, password, provider)


  // just update the profile...
  let player = await Poke.GetPlayer()
  let player = await Poke.GetInvetory()

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
  //   await new Promise(resolve => setTimeout(resolve, 3000))
  // }
}

init().catch(console.log)
