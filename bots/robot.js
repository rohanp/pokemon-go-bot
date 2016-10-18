import env from 'node-env-file'
import PokeAPI from '../src'
var _ = require('underscore')
import {
	RARE_POKEMON,
	WEAK_POKEMON
} from '../src/settings.js'

env(__dirname + '/.env');

var accntNum = process.argv[2]
if (accntNum == 1 || accntNum == null)
	accntNum = ""
else
	accntNum = String(accntNum)

var map = {
						"DC" : {latitude: 38.895109, longitude: -77.02217},
						"AUSTIN" : {latitude: 30.267524, longitude: -97.73841},
						"STANFORD" : {latitude: 37.4271774, longitude: -122.1687376},
						"OXFORD" : {latitude: 51.7566341, longitude: -1.2568977},
						"UPENN" : {latitude: 39.9522188, longitude: -75.1954077},
						"UMICH" : {latitude: 42.2780436, longitude: -83.7404181},
						"BERKELEY": {latitude: 37.8719034, longitude: -122.2607286},
						"GTECH": {latitude: 33.7756222, longitude: -84.3984737},
						"UCHICAGO": {latitude: 41.7886119, longitude: -87.600902}
					}

var location = process.argv[3]
if (location == null)
	location = _.sample(Object.keys(map))

console.log("Location: " + location)

var username = process.env.PGO_USERNAME + accntNum
var password = process.env.PGO_PASSWORD
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
			if (pokemon.cp < cutoff
					|| (_.indexOf(pokemon.name, WEAK_POKEMON) != -1
					&& pokemon.cp < 3*cutoff)){
				let resp = await pokemon.release()
				await new Promise(resolve => setTimeout(resolve, 2000))
				count += 1
			}
		}
		cutoff += 20
	}
	console.log(`Released ${count} pokemon`)
	await updateInventory()
}

async function init() {

  //set player location
  Poke.player.location = map[location]

	await new Promise(resolve => setTimeout(resolve, 3000))
  //login
  const api = await Poke.login(username, password, provider)

	await new Promise(resolve => setTimeout(resolve, 3000))

  // just update the profile...
  let player = await Poke.GetPlayer()
	await new Promise(resolve => setTimeout(resolve, 3000))
	await updateInventory()
	await new Promise(resolve => setTimeout(resolve, 3000))

	var goto

	while( true ) {

		var today = new Date();
		var minutes = today.getUTCMinutes();

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


			if (items.poke_ball.count + items.great_ball.count > 100){

					if (typeof objects.wild_pokemons.size != 'undefined' && objects.wild_pokemons.size)
						goto = _.max(objects.wild_pokemons, pokemon => pokemon.cp)
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

		if ((items.poke_ball.count + items.great_ball.count < 100)
				|| goto === null){
			console.log("[i] Heading to Pokestop!")
	    // Get the closest checkpoint we can find items from
	    let nextCheckpoint = objects.forts.checkpoints.find(
																	point => !point.cooldown)

	    if(nextCheckpoint && isFinite(nextCheckpoint.latitude)){

				goto = {latitude: nextCheckpoint.latitude,
								longitude: nextCheckpoint.longitude}

	    }
		}


		if (goto != null) {
			 console.log("[i] Walking to point " + goto)
			 await Poke.player.walkToPoint(goto)
		} else {
			 goto = null
			 console.log("[i] Walking around...")
			 await Poke.player.walkAround(origin)
		}


    await new Promise(resolve => setTimeout(resolve, 2000))
  }
}

init().catch(console.log)
