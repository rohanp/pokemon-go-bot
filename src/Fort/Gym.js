import Fort from './Fort'

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
    let {latitude, longitude} = this.parent.player.location

    return this.parent.Call([{
      request: 'ATTACK_GYM',
      message: {
        gym_id: this.id,
        battle_id: battle_id,
        attack_actions: attackActions,
        last_retrieved_actions: lastRetrievedAction,
        player_latitude: latitude,
        player_longitude: longitude,
      }
    }])
  }

}

export default Gym