import geolib from 'geolib'

/**
 * Called if a parameter is missing and
 * the default value is evaluated.
 */
function mandatory() {
    throw new Error('Missing parameter');
}

class Fort {
  constructor(props, parent) {
    Object.defineProperty(this, 'parent', {value: parent})
  }


  /**
   * Return the coordinates of the fort
   * @return {Object} {latitude, longitude}
   */
  get location() {
    let { latitude, longitude } = this
    return { latitude, longitude }
  }

  /**
   * Return the distance in meters from players location
   * to the Checkpoint or Gym`s location
   *
   * @return {Number} meters
   */
  get distance() {
    return geolib.getDistance(this.location, this.parent.player.location)
  }

  /**
   * TODO: description
   *
   * [details description]
   * @return {[type]} [description]
   */
  details() {
    return this.parent.Call([{
      request: 'FORT_DETAILS',
      message: {
        fort_id: this.id,
        latitude: this.latitude,
        longitude: this.longitude,
      }
    }])
  }



  /**
   * TODO: description
   *
   * [addModifier description]
   * @param {[type]} item_id [description]
   */
  addModifier(item_id){
    let {latitude, longitude} = this.parent.player.location

    return this.parent.Call([{
      request: 'FORT_DETAILS',
      message: {
        modifier_type: item_id,
        fort_id: this.id,
        player_latitude: latitude,
        player_longitude: longitude
      }
    }])
  }

}


class Gym extends Fort {
  constructor(props, parent) {
    super(props, parent)

    Object.assign(this, props)
    delete this.type
    delete this.lure_info
    this.isGym = true
  }

  /**
   * TODO: description
   *
   * [recallPokemon description]
   * @param  {[type]} pokemon [description]
   * @return {[type]}         [description]
   */
  recallPokemon(pokemon) {
    let {latitude, longitude} = this.parent.player.location

    return this.parent.Call([{
      request: 'FORT_RECALL_POKEMON',
      message: {
        fort_id: this.id,
        pokemon_id: pokemon.pokemon_id,
        player_latitude: latitude,
        player_longitude: longitude
      }
    }])
  }



  /**
   * TODO: description
   *
   * [deployPokemon description]
   * @param  {[type]} pokemon [description]
   * @return {[type]}         [description]
   */
  deployPokemon(pokemon) {
    let {latitude, longitude} = this.parent.player.location

    return this.parent.Call([{
      request: 'FORT_DEPLOY_POKEMON',
      message: {
        fort_id: this.id,
        pokemon_id: pokemon.pokemon_id,
        player_latitude: latitude,
        player_longitude: longitude
      }
    }])
  }
}

class Checkpoint extends Fort {
  constructor(props, parent) {
    super(props, parent)
    Object.assign(this, props)
    this.isCheckpoint = true
    delete this.type
    delete this.owned_by_team
    delete this.guard_pokemon_id
    delete this.guard_pokemon_cp
    delete this.gym_points
    delete this.is_in_battle
    delete this.sponsor
    delete this.rendering_type
  }

  /**
   * search spins the pokestop
   * you get pokemon balls among other things
   *
   * @return {[type]} [description]
   */
  search() {
    let {latitude, longitude} = this.parent.player.location

    return this.parent.Call([{
      request: 'FORT_SEARCH',
      message: {
        fort_id: this.id,
        player_latitude: latitude,
        player_longitude: longitude,
        fort_latitude: this.latitude,
        fort_longitude: this.longitude
      }
    }])
  }
}

export default (fort, parent) => {
  switch (fort.type) {
    case 0: return new Gym(fort, parent); break
    case 1: return new Checkpoint(fort, parent); break
  }
}
