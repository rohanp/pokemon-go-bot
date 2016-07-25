import env from 'node-env-file'
import PokeAPI from '../src'

env(__dirname + '/.env');

//Set environment variables or replace placeholder text
var location = {
    type: 'name',
    name: process.env.PGO_LOCATION || 'Times Square'
};

var username = process.env.PGO_USERNAME || 'USER'
var password = process.env.PGO_PASSWORD || 'PASS'
var provider = process.env.PGO_PROVIDER || 'ptc'

const Poke = new PokeAPI()

async function init() {

  Poke.player.location = {
    latitude: 55.70000932453345,
    longitude: 12.524757385253906,
  }

  const api = await Poke.login(username, password, provider)

  let res = await Poke.GetPlayer()
  console.log(res)
  let res2 = await Poke.GetInventory()
  console.log(res2)
  let res3 = await Poke.GetMapObjects()
  console.log(res3)

  //walk a little..
  Poke.player.WalkAround()
}

init().catch(console.log)
