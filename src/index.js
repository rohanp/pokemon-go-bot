import Player from '~/Player'
import API from '~/API'
import Item from '~/Item'
import Pokemon from '~/Pokemon'
import Fort from '~/Fort'
import PlayerMap from '~/PlayerMap'
import { BANNED_POKEMONS } from './settings'

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
  let sortOrder = 1
  if (property[0] === '-') {
    sortOrder = -1
    property = property.substr(1)
  }
  return (a,b) => {
    let result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0
    return result * sortOrder
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


  /**
   * [login description]
   *
   * @param  {[type]} username [description]
   * @param  {[type]} password [description]
   * @param  {[type]} provider [description]
   * @return {[type]}          [description]
   */
  async login(username, password, provider) {
    if (provider !== 'ptc' && provider !== 'google') {
      throw new Error('Invalid provider')
    }

    this.player.provider = provider

    await this.player.Login(username, password)
    await this.api.setEndpoint(this.player.playerInfo)

    return this
  }



  /**
   * This calls the API direct
   *
   * @param  {[type]} req [description]
   * @return {[type]}     [description]
   */
  Call(req) {
    return this.api.Request(req, this.player.playerInfo)
  }



  /**
   * [GetInventory description]
   * @return {[type]}     [description]
   */
  async GetInventory() {
    let res = await this.Call([{
      request: 'GET_INVENTORY',
      message: {
        last_timestamp_ms: 0
      }
    }])

    let inventory = {
      pokemons: [],
      items: {},
      eggs: [],
      candies: [],
			pokecount: Array.from({ length: 151 }, () => 0)
    }

    var itemData = PokemonGOAPI.POGOProtos.Inventory.ItemId
    itemData = Object.keys(itemData).reduce((obj, key) => {
      obj[ itemData[key] ] = key.toLowerCase().replace('item_', '')

      inventory.items[obj[itemData[key]]] = new PokemonGOAPI.POGOProtos.Inventory.Item
      return obj
    }, {})

    for(let thing of res.GetInventoryResponse.inventory_delta.inventory_items){
      let data = thing.inventory_item_data

      if (data.pokemon_data) {
        let pokemon = new Pokemon(data.pokemon_data, this)

				if (data.pokemon_data.is_egg)
        	inventory.eggs.push(pokemon)
        else{
          inventory.pokemons.push(pokemon)
					inventory.pokecount[pokemon.id] += 1
				}

      } else if (data.item) {
        inventory.items[itemData[data.item.item_id]] = new Item(data.item, this)
      }
      else if (data.pokemon_family) {
        inventory.candies.push(new Item(data.pokemon_family, this))
      }
    }

    return inventory
  }




  /**
   * [GetPlayer description]
   */
  async GetPlayer(s) {
    let res = await this.Call([{ request: 'GET_PLAYER' }])
    this.player.playerInfo.sessionData = res.GetPlayerResponse.player_data
    return res.GetPlayerResponse.player_data
  }



  /**
   * [ToggleWalkToPoint description]
   * @param  {[type]} lat [description]
   * @param  {[type]} lng [description]
   * @return {[type]}     [description]
   */
  async ToggleWalkToPoint(lat,lng) {
    this.walkToPoint = !this.walkToPoint
    this._walkToPoint(lat, lng)
    return this.walkToPoint
  }



  /**
   * [_walkToPoint description]
   *
   * @private
   * @param  {[type]} lat [description]
   * @param  {[type]} lng [description]
   * @return {[type]}     [description]
   */
  async _walkToPoint(lat, lng) {
    while(this.walkToPoint){
      this.player.walkToPoint(lat, lng)
      await new Promise(resolve => setTimeout(resolve, 2700))
    }
  }



  /**
   * [ToggleHeartBeat description]
   */
  async ToggleHeartBeat() {
    this.useHeartBeat = !this.useHeartBeat
    this._loopHeartBeat()
    return this.useHeartBeat
  }



  /**
   * [_loopHeartBeat description]
   * @return {[type]} [description]
   */
  async _loopHeartBeat() {
    while(this.useHeartBeat){
      var area = this.GetMapObjects()
      console.log('[+] Sent out heartbeat: (player.surroundings is updated)')
      await new Promise(resolve => setTimeout(resolve, 2700))
    }
  }



  /**
   * [GetMapObjects description]
   */
  async GetMapObjects() {
    let finalWalk = this.map.getNeighbors(this.player.playerInfo).sort()
    let nullarray = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    let res = await this.Call([{
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
        gyms: []
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
      objects.forts.checkpoints.sort(dynamicSort('distance'))
      objects.forts.gyms.sort(dynamicSort('distance'))
    }

    this.player.surroundings = objects

    return objects
  }

}

PokemonGOAPI.POGOProtos = API.POGOProtos

export default PokemonGOAPI
