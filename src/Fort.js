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
    Object.assign(this, props)
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
   * Tells you if you are close enough to do something with it
   *
   * @return {Boolean} true if you can reach it
   */
  get withinRange() {
    return this.distance < 40
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

    this.modified = new Date(this.last_modified_timestamp_ms.toNumber())
    this.gym_points = this.gym_points.toNumber()
    this.isGym = true

    delete this.type
    delete this.lure_info
    delete this.last_modified_timestamp_ms
  }



  /**
   * @return {Boolean} true if the team is on your team
   */
  get isSameTeam(){
    return this.parent.player.playerInfo.sessionData.team == this.owned_by_team
  }



  /**
   * @return {Boolean} true if no pokemon is assigned to the gym
   */
  get isNeutral(){
    return this.owned_by_team == 0
  }



  /**
   * Gets gym description, suce as members, and gym details
   *
   * @return {GetGymDetailsResponse} [description]
   */
  details() {
    let {latitude, longitude} = this.parent.player.location

    return this.parent.Call([{
      request: 'GET_GYM_DETAILS',
      message: {
        gym_id: this.id,
        player_latitude: latitude,
        player_longitude: longitude,
        gym_latitude: this.latitude,
        gym_longitude: this.longitude,
      }
    }])
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
   * Put a own pokemon from the inventory and put it in a gym
   *
   * @param  {[type]} pokemon The pokemon from your inventory
   * @return {[type]}         [description]
   */
  deployPokemon(pokemon) {
    if(pokemon.stamina_max !== pokemon.stamina)
      throw new Error('Pokémons need to have full HP, before assigning to gym')

    if(!this.isSameTeam && !this.isNeutral)
      throw new Error("Can't set a pokemon on a other team's gym")

    let {latitude, longitude} = this.parent.player.location

    return this.parent.Call([{
      request: 'FORT_DEPLOY_POKEMON',
      message: {
        fort_id: this.id,
        pokemon_id: pokemon.id,
        player_latitude: latitude,
        player_longitude: longitude
      }
    }])
  }


  /**
   * Initiate gym battle
   *
   * @param  {[array]} list of Pokemons that you want to attack the gym with
   * @return {[type]} Returns a list of battle_id and more for the attack.
   */
  startBattle(pokemonIds) {
    let {latitude, longitude} = this.parent.player.location

    return this.parent.Call([{
      request: 'START_GYM_BATTLE',
      message: {
        gym_id: this.id,
        attacking_pokemon_ids: pokemonIds,
        defending_pokemon_id: this.pokemon_data.id,
        player_latitude: latitude,
        player_longitude: longitude,
      }
    }])
  }

  /**
   * the attack phase,
   *
   * @param  {[type]} pokemon The pokemon from your inventory
   * @return {[type]}         [description]
   */
  attack(battle_id, attackActions, lastRetrievedAction) {
    return this.parent.Call([{
      request: 'ATTACK_GYM',
      message: {
        gym_id: this.id,
        battle_id: battle_id,
        attack_actions: attackActions,
        last_retrieved_actions: lastRetrievedAction,
        player_latitude: ,
        player_longitude: ,
      }
    }])
  }

}



/**
 * Checkpoint is a "pokestop" where you can
 * get items from it by spining.
 */
class Checkpoint extends Fort {
  constructor(props, parent) {
    super(props, parent)

    let modified = this.last_modified_timestamp_ms.toNumber()
    let cooldown = this.cooldown_complete_timestamp_ms.toNumber()

    this.isCheckpoint = true
    // The date when you can collect rewards again
    this.cooldown = cooldown ? new Date(cooldown) : null
    this.modified = new Date(modified)

    delete this.type
    delete this.last_modified_timestamp_ms
    delete this.cooldown_complete_timestamp_ms
    delete this.owned_by_team
    delete this.guard_pokemon_id
    delete this.guard_pokemon_cp
    delete this.gym_points
    delete this.is_in_battle
    delete this.sponsor
    delete this.rendering_type
  }



  /**
   * Gets detail about a pokestop
   *
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
   * search spins the pokestop
   * you get pokemon balls among other things
   *
   * @return {Promise} Resolves to items awarded
   */
  async search() {
    let {latitude, longitude} = this.parent.player.location

    if (this.distance > 39){
      this.parent.log.info('[+] To far away, cant search thisone')
      return false
    }

    if (this.cooldown !== null){
      this.parent.log.info('[+] Cooldown active, please wait..')
      return false
    }

    var search = await this.parent.Call([{
      request: 'FORT_SEARCH',
      message: {
        fort_id: this.id,
        player_latitude: latitude,
        player_longitude: longitude,
        fort_latitude: this.latitude,
        fort_longitude: this.longitude
      }
    }])
    this.parent.player.lastCheckpointSearch = search
    this.parent.log.info('[+] Search complete')
    return search
  }
}

export default (fort, parent) => {
  switch (fort.type) {
    case 0: return new Gym(fort, parent); break
    case 1: return new Checkpoint(fort, parent); break
  }
}
