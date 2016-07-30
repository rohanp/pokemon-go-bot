import env from 'node-env-file'
import PokeAPI from '../src'

env(__dirname + '/.env');

var username = process.env.PGO_USERNAME || 'notabotyo'
var password = process.env.PGO_PASSWORD || 'apple28'
var provider = process.env.PGO_PROVIDER || 'ptc'
var lat = process.env.LATITUDE || 37.757815
var lng = process.env.LONGITUDE || -122.5076401
var jsonfile = require('jsonfile')
var _ = require("underscore")

var inventory
var items
var pokemon

var today = new Date();
var minutes = today.getUTCMinutes();
console.log(minutes)

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
			if (pokemon.cp < cutoff && 1 < inventory.pokecount[pokemon.id]){
				let resp = await pokemon.release()
				await new Promise(resolve => setTimeout(resolve, 2000))
				count += 1
			} else {
			}
		}
		cutoff += 20
	}
	console.log(`Released ${count} pokemon`)
}

const Poke = new PokeAPI()

async function init() {



  //set player location
  Poke.player.location = {
	latitude: parseFloat(lat),
	longitude: parseFloat(lng),
  }
	await new Promise(resolve => setTimeout(resolve, 3000))

  //login
  const api = await Poke.login(username, password, provider)

	await new Promise(resolve => setTimeout(resolve, 3000))
  // just update the profile...
  let player = await Poke.GetPlayer()

	await new Promise(resolve => setTimeout(resolve, 3000))

  inventory = await Poke.GetInventory()

	await new Promise(resolve => setTimeout(resolve, 3000))

	await releaseWeakPokemon()




	//just walk a little (1 - 15 meters..)
	//await Poke.player.walkToPoint(38.9176263,-77.4105144)

  await new Promise(resolve => setTimeout(resolve, 3000))
}


init().catch(console.log)
