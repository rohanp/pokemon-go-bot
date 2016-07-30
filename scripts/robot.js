import env from 'node-env-file'
import PokeAPI from '../src'

env(__dirname + '/.env');
var _ = require('underscore')

var accntNum = process.argv[2]
if (accntNum == 1 || accntNum == null)
	accntNum = ""
else
	accntNum = String(accntNum)

var map = {	"RTC" : {latitude: 38.9585702, longitude: -77.3591328},
						"FAIRFAX" : {latitdue: 38.85837, longitude: -77.3587088},
						"MOSAIC" : {latitude: 38.872152, longitude: -77.229107},
						"VA_BEACH" : {latitude: 36.850808, longitude: -75.9816083},
						"DALLAS" : {latitude: 32.7809567, longitude: -96.7987411},
						"LA" : {latitude: 34.0518942, longitude: -118.149217},
						"CHICAGO" : {latitude: 41.7904461, longitude: -87.7251684},
						"ZURICH" : {latitude: 47.3766364, longitude: 8.5401631}
					}

var location = process.argv[3]
if (location == null)
	location = _.sample(Object.keys(map))

console.log("Location: " + location)

var username = 'notabotyo' + accntNum
var password = 'apple28'
var provider = 'ptc'
var origin = map[location]

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

	var cutoff = 100
	var count = 0

	while (count < 50){
		for (let pokemon of inventory.pokemons){
			if (pokemon.cp < cutoff){
				let resp = await pokemon.release()
				await new Promise(resolve => setTimeout(resolve, 2000))
				count += 1
			}
		}
		cutoff += 20
	}
	console.log(`Released ${count} pokemon`)
}

async function init() {

  //set player location
  Poke.player.location = map[location]

  //login
  const api = await Poke.login(username, password, provider)

	await new Promise(resolve => setTimeout(resolve, 3000))

  // just update the profile...
  let player = await Poke.GetPlayer()
	await new Promise(resolve => setTimeout(resolve, 3000))
	await updateInventory()
	await new Promise(resolve => setTimeout(resolve, 3000))

	while( true ) {

		var today = new Date();
		var minutes = today.getUTCMinutes();
		if (minutes == 58){
			return // exit script
		}

    let objects = await Poke.GetMapObjects()

		if (Math.random() < 0.1) {
				await new Promise(resolve => setTimeout(resolve, 2000))
				await updateInventory()
		}

		if (pokemon.length >= 235){
			console.log("[!][!][!] Poke-Inventory Full")
			console.log("Attempting to Auto-Release Pokemon")
			await releaseWeakPokemon()
		}

    // catchable pokemons from here?
		if (items.poke_ball.count || items.great_ball.count)
	    for (let pokemon of objects.catchable_pokemons) {
				await new Promise(resolve => setTimeout(resolve, 1000))
	      let resp = await pokemon.encounterAndCatch(items)

				if (resp == null){
					await releaseWeakPokemon()
				}
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

		if (items.poke_ball.count + items.great_ball.count < 70){
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
		} else {
			 //just walk a little (1 - 15 meters..)
			 console.log("[i] Walking around...")
			 await Poke.player.walkAround(origin)
		}


    await new Promise(resolve => setTimeout(resolve, 3000))
  }
}

init().catch(console.log)
