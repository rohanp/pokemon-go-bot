
/**
 * Called if a parameter is missing and
 * the default value is evaluated.
 */
function mandatory() {
    throw new Error('Missing parameter');
}

class Item{
  constructor(props, parent) {
    Object.assign(this, props)
    delete this.id
    this.parent = parent
  }


  usePotion(pokemon) {
    return this.parent.Call([{
      request: 'USE_ITEM_POTION',
      message: {
        item_id: this.item_id,
        pokemon_id: pokemon.pokemon_id,
      }
    }])
  }

  useCapture(pokemon) {
    return this.parent.Call([{
      request: 'USE_ITEM_CAPTURE',
      message: {
        item_id: this.item_id,
        encounter_id: pokemon.encounter_id,
        spawn_point_guid: pokemon.spawn_point_guid,
      }
    }])
  }

  useRevive(pokemon) {
    return this.parent.Call([{
      request: 'USE_ITEM_REVIVE',
      message: {
        item_id: this.item_id,
        pokemon_id: pokemon.pokemon_id,
      }
    }])
  }

  useGym(fort) {
    return this.parent.Call([{
      request: 'USE_ITEM_GYM',
      message: {
        item_id: this.item_id,
        gym_id: fort.gym_id,
        player_latitude: this.parent.player.playerInfo.latitude,
        player_longitude: this.parent.player.playerInfo.longitude,
      }
    }])
  }

  useIncubator(pokemon) {
    return this.parent.Call([{
      request: 'USE_ITEM_EGG_INCUBATOR',
      message: {
        item_id: this.item_id,
        pokemon_id: pokemon.pokemon_id,
      }
    }])
  }

  useXpBoost() {
    return this.parent.Call([{
      request: 'USE_ITEM_XP_BOOST',
      message: {
        item_id: this.item_id,
      }
    }])
  }

}
export default Item

