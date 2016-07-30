import env from 'node-env-file'
import PokeAPI from '../src'

env(__dirname + '/.env');

var RTC = {lat: 38.9585702, lng: -77.3591328}
var FAIRFAX = {lat: 38.85837, lng: -77.3587088}
var MOSAIC = {lat: 38.872152, lng: -77.229107}

var username = 'notabotyo2'
var password = 'apple28'
var provider = 'ptc'
var {lat, lng} = RTC
var origin = [lat, lng]

var inventory
var items
var pokemon

const Poke = new PokeAPI()

async function updateInventory(){
		inventory = await Poke.GetInventory()
		items = inventory.items
		pokemon = inventory.pokemons
}

async function releaseWeakPokemon(){
	await updateInventory()

	let count = 0
	for (let pokemon of inventory.pokemons){
		if (pokemon.cp < 100){
			let resp = await pokemon.release()
			count += 1
		}
	}
	console.log(`Released ${count} pokemon`)
}

function ballCount(){
	return items.poke_ball.count + items.great_ball.count + items.ultra_ball.count
}


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
	await updateInventory()
	console.log("Num pokemon: " + pokemon.length)

	while( true ) {
    let objects = await Poke.GetMapObjects()

		if (Math.random() < 0.05) {
				await updateInventory()
		}

		if (pokemon.length >= 235){
			console.log("[!][!][!] Poke-Inventory Full")
			console.log("Attempting to Auto-Release Pokemon")
			await releaseWeakPokemon()
			await updateInventory()
		}

    // catchable pokemons from here?
		if (items.poke_ball.count)
	    for (let pokemon of objects.catchable_pokemons) {
	      let resp = await pokemon.encounterAndCatch(items)
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
      if (gym.withinRange) {
        // Do something with the gym
      }
    }

    // Checkpoint's (aka: pokestop) (are sorted by distance)
    for (let checkpoint of objects.forts.checkpoints) {
      if (!checkpoint.cooldown && checkpoint.withinRange) {
        // Collect pokestop rewards
        let res = await checkpoint.search()
    	}
		}

		if (items.poke_ball.count < 30){
			console.log("[i] Looking for pokeballs!")
	    // Get the closest checkpoint we can find items from
	    let nextCheckpoint = objects.forts.checkpoints.find(
																	point => !point.cooldown)

			let lat = nextCheckpoint.latitude
			let long = nextCheckpoint.longitude

	    if(nextCheckpoint) {
				await Poke.player.walkToPoint(lat, long)
	        // Go to next checkpoints
	    }
			 else{
	    	//just walk a little (1 - 15 meters..)
				console.log("[i] Walking around...")
	    	await Poke.player.walkAround(origin)
			}
		}

    await new Promise(resolve => setTimeout(resolve, 3000))
  }
}

init().catch(console.log)
