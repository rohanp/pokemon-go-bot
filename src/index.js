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

    for(let cell of cells) {

      cell.catchable_pokemons = cell.catchable_pokemons.map(pokemon =>
        new Pokemon(pokemon, this)
      )

      cell.forts = cell.forts.map(fort =>
        Fort(fort, this)
      )

      cell.nearby_pokemons = cell.nearby_pokemons.map(pokemon =>
        new Pokemon(pokemon, this)
      )

    }
    this.player.surroundings = cells

    return cells
  }

}

export default PokemonGOAPI
