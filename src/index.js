import Player from '~/Player'
import API from '~/API'
import Pokemon from '~/Pokemon'
import Fort from '~/Fort'
import PlayerMap from '~/PlayerMap'
import {
  BANNED_POKEMONS
} from './settings'

import rand from 'randgen'

/**
 * Called if a parameter is missing and
 * the default value is evaluated.
 */
function mandatory() {
    throw new Error('Missing parameter');
}


/**
 * Called to sort objects in array by a value
 */
function dynamicSort(property) {
  var sortOrder = 1;
  if(property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function (a,b) {
    var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
    return result * sortOrder;
  }
}


class PokemonGOAPI {

  constructor(props) {
    this.player = new Player(this)
    this.api = new API(this)
    this.map = new PlayerMap()
    this.logged = false
    this.debug = true
    this.useHeartBeat = false
  }



  async login(username, password, provider) {

    if (provider !== 'ptc' && provider !== 'google') {
      throw new Error('Invalid provider')
    }

    this.player.provider = provider

    await this.player.Login(username, password)
    await this.api.setEndpoint(this.player.playerInfo)

    return this
  }

  //
  //This calls the API direct
  //
  Call(req) {
    return this.api.Request(req, this.player.playerInfo)
  }

  GetInventory() {
    return this.Call([{
      request: 'GET_INVENTORY',
      message: {
        last_timestamp_ms: 0
      }
    }])
  }

  async GetPlayer() {
    let res = await this.Call([{ request: 'GET_PLAYER' }])
    this.player.playerInfo.sessionData = res.GetPlayerResponse.player_data
    return res.GetPlayerResponse.player_data
  }


  async ToggleWalkToPoint(lat,lng){
    this.walkToPoint = !this.walkToPoint
    this._walkToPoint(lat,lng)
    return this.walkToPoint
  }
  async _walkToPoint(lat,lng) {
    while(this.walkToPoint){
      this.player.walkToPoint(lat,lng)
      await new Promise(resolve => setTimeout(resolve, 2700))
    }
  }


  //
  // HeartBeat
  //
  async ToggleHeartBeat() {
    this.useHeartBeat = !this.useHeartBeat
    this._loopHeartBeat()
    return this.useHeartBeat
  }

  async _loopHeartBeat() {
    while(this.useHeartBeat){
      var area = this.GetMapObjects()
      console.log('[+] Sent out heartbeat: (player.surroundings is updated)')
      await new Promise(resolve => setTimeout(resolve, 2700))
    }
  }

  async GetMapObjects() {
    var finalWalk = this.map.getNeighbors(this.player.playerInfo).sort()
    var nullarray = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    var res = await this.Call([{
      request: 'GET_MAP_OBJECTS',
      message: {
        cell_id: finalWalk,
        since_timestamp_ms: nullarray,
        latitude: this.player.playerInfo.latitude,
        longitude: this.player.playerInfo.longitude
      }
    }])

    let cells = res.GetMapObjectsResponse.map_cells

    var objects = {
      spawn_points: [],
      deleted_objects: [],
      fort_summaries: [],
      decimated_spawn_points: [],
      wild_pokemons: [],
      catchable_pokemons: [],
      nearby_pokemons: [],
      forts: {
        checkpoints: [],
        gyms: [],
      }
    }

    for(let cell of cells) {
      objects.spawn_points.push(cell.spawn_points)
      objects.deleted_objects.push(cell.deleted_objects)
      objects.fort_summaries.push(cell.fort_summaries)
      objects.decimated_spawn_points.push(cell.decimated_spawn_points)

      cell.wild_pokemons.map(pokemon => {
        pokemon.pokemon_id = pokemon.pokemon_data.pokemon_id,
        objects.wild_pokemons.push(new Pokemon(pokemon, this))
      })

      cell.catchable_pokemons.map(pokemon =>
        objects.catchable_pokemons.push(new Pokemon(pokemon, this))
      )

      cell.nearby_pokemons.map(pokemon =>
        objects.nearby_pokemons.push(new Pokemon(pokemon, this))
      )

      cell.forts.map(fort => {
        fort = Fort(fort, this)

        if (fort.isCheckpoint)
          objects.forts.checkpoints.push(fort)
        else
          objects.forts.gyms.push(fort)
        }
      )

      //sort checkpoints
      objects.forts.checkpoints.sort(dynamicSort("distance"));
      objects.forts.gyms.sort(dynamicSort("distance"));
    }

    this.player.surroundings = objects

    return objects
  }

}

export default PokemonGOAPI
