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
    this.useHartBeat = false
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
    return this.Call([{ request: 'GET_INVENTORY' }])
  }

  async GetPlayer() {
    let res = await this.Call([{ request: 'GET_PLAYER' }])
    return res.GetPlayerResponse.player_data
  }

  //
  // HeartBeat
  //
  async ToggleHartBeat() {
    this.useHartBeat = !this.useHartBeat
    // this._loopHartBeat()
    return this.useHartBeat
  }

  async _loopHartBeat() {
    while(this.useHartBeat){
      setInterval(() => {
        console.log('hartbeat..')
        // var area = this.GetMapObjects()
      },2000);
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

    return cells
  }

  EncounterPokemon(pokemon = mandatory()) {
    console.log('[warning] this is deprecated, use pokemon.Encounter()')
    return pokemon.Encounter()
  }

  CatchPokemon(pokemon = mandatory()) {
    console.log('[warning] this is deprecated, use pokemon.Catch()')
    return pokemon.Catch()
  }

  UseItemPotion(item_id, pokemon_id = mandatory()) {
    return this.Call([{
      request: 'USE_ITEM_POTION',
      message: { item_id, pokemon_id }
    }])
  }


}

export default PokemonGOAPI
