
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

  search() {
    return this.parent.Call([{
      request: 'FORT_SEARCH',
      message: {
        fort_id: this.id,
        player_latitude: this.parent.player.playerInfo.latitude,
        player_longitude: this.parent.player.playerInfo.longitude,
        fort_latitude: this.latitude,
        fort_longitude: this.longitude
      }
    }])
  }

  // TODO should only be in Gym class?
  recallPokemon(pokemon) {
    return this.parent.Call([{
      request: 'FORT_RECALL_POKEMON',
      message: {
        fort_id: this.id,
        pokemon_id: pokemon.pokemon_id,
        player_latitude: this.parent.player.playerInfo.latitude,
        player_longitude: this.parent.player.playerInfo.longitude,
      }
    }])
  }

  // TODO should only be in Gym class?
  deployPokemon(pokemon) {
    return this.parent.Call([{
      request: 'FORT_DEPLOY_POKEMON',
      message: {
        fort_id: this.id,
        pokemon_id: pokemon.pokemon_id,
        player_latitude: this.player.playerInfo.latitude,
        player_longitude: this.player.playerInfo.longitude,
      }
    }])
  }

  details() {
    return this.parent.Call([{
      request: 'FORT_DETAILS',
      message: {
        fort_id: this.fort.fort_id,
        latitude: this.fort.latitude,
        longitude: this.fort.longitude,
      }
    }])
  }

  addModifier(item_id){
    return this.parent.Call([{
      request: 'FORT_DETAILS',
      message: {
        modifier_type: item_id,
        fort_id: this.fort.fort_id,
        player_latitude: this.parent.player.playerInfo.latitude,
        player_longitude: this.parent.player.playerInfo.longitude,
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
