import Player from '~/Player'
import API from '~/API'
import Pokemon from '~/Pokemon'
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
    this.player = new Player()
    this.api = new API()
    this.map = new PlayerMap()
    this.logged = false
    this.debug = true
    this.useHartBeat = false
  }

  async login(username, password, location, provider) {

    if (provider !== 'ptc' && provider !== 'google') {
      throw new Error('Invalid provider')
    }

    this.player.provider = provider

    await this.player.setLocation(location)
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
    this._loopHartBeat()
    return this.useHartBeat
  }

  async _loopHartBeat() {
    while(this.useHartBeat){
      setInterval(() => {
        var area = this.GetMapObjects()
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
    }

    return cells
  }

  EncounterPokemon(pokemon = mandatory()) {
    this.isCatching=true
    console.log('[warning] this is deprecated, use pokemon.Encounter()')
    return this.Call([{
      request: 'ENCOUNTER',
      message: {
        encounter_id: pokemon.encounter_id,
        spawn_point_id: pokemon.spawn_point_id,
        player_latitude: this.player.playerInfo.latitude,
        player_longitude: this.player.playerInfo.longitude,
      }
    }])
  }

  CatchPokemon(pokemon = mandatory()) {
    console.log('[warning] this is deprecated, use pokemon.Catch()')
    var res = this.Call([{
      request: 'CATCH_POKEMON',
      message: {
        encounter_id: pokemon.encounter_id,
        pokeball: 1,
        normalized_reticle_size: Math.min(1.95, rand.rnorm(1.9, 0.05)),
        spawn_point_guid: pokemon.spawn_point_id,
        hit_pokemon: true,
        spin_modifier: Math.min(0.95, rand.rnorm(0.85, 0.1)),
        normalized_hit_position: 1.0,
      }
    }])
    this.isCatching=false
    return res
  }
  UseItemPotion(item_id, pokemon_id = mandatory()) {
    return this.Call([{
      request: 'USE_ITEM_POTION',
      message: { item_id, pokemon_id }
    }])
  }


}

export default PokemonGOAPI
