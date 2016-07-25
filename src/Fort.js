
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
   * TODO: description
   * is this when you search pokestop and
   * get pokeball among other things?
   * Then this should only be in the Checkpoint class...?
   *
   * [search description]
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



  /**
   * TODO: description
   * TODO should only be in Gym class?
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
   * TODO should only be in Gym class?
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
}

export default (fort, parent) => {
  switch (fort.type) {
    case 0: return new Gym(fort, parent); break
    case 1: return new Checkpoint(fort, parent); break
  }
}
