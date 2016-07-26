import env from 'node-env-file'
import PokeAPI from '../src'

env(__dirname + '/.env');

var username = process.env.PGO_USERNAME || 'USER'
var password = process.env.PGO_PASSWORD || 'PASS'
var provider = process.env.PGO_PROVIDER || 'ptc'
var lat = process.env.LATITUDE || 40.759211
var lng = process.env.LONGITUDE || -73.984472


const Poke = new PokeAPI()

// The kind of ball you want to use when captureing
const POKE_BALL = 1;
const GREAT_BALL = 2;
const ULTRA_BALL = 3;
const MASTER_BALL = 4;

async function init() {

  //set player location
  Poke.player.location = {
    latitude: parseFloat(lat),
    longitude: parseFloat(lng),
  }

  //login
  const api = await Poke.login(username, password, provider)

  // just update the profile...
  let player = await Poke.GetPlayer()
  // let inv = await Poke.GetInventory()
  // console.log(inv)
  // get map objects..
  while( true ) {
    let objects = await Poke.GetMapObjects()

    // catchable pokemons from here?
    for (let pokemon of objects.catchable_pokemons) {
      // await pokemon.encounterAndCatch(POKE_BALL).catch(console.error)
    }

    // wild pokemons
    for (let pokemon of objects.wild_pokemons) {
      // we have wild pokemons, you cannot catch these.. need to get closer
      // console.log(`found ${pokemon.name} ${pokemon.distance} meters away`)
      // console.log(pokemon.location)
    }

    // Gym's (are sorted by distance)
    for (let gym of objects.forts.gyms) {
      // We have a gym
      if (gym.withinRange) {
        // Do something with the gym
      }
    }

    // Checkpoint's (aka: pokestop) (are sorted by distance)
    for (let checkpoint of objects.forts.checkpoints) {
      if (!checkpoint.cooldown && checkpoint.withinRange) {
        // Collect pokestop rewards
        // let res = await checkpoint.search()
        // console.log(res)
      }
    }

    // Get the closest checkpoint we can find items from
    let nextCheckpoint = objects.forts.checkpoints.find(point => !point.cooldown)

    if(nextCheckpoint) {
        // Go to next checkpoints
    }

    //just walk a little (1 - 15 meters..)
    await Poke.player.walkAround()
    await new Promise(resolve => setTimeout(resolve, 3000))
  }
}

init().catch(console.log)
