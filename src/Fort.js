
/**
 * Called if a parameter is missing and
 * the default value is evaluated.
 */
function mandatory() {
    throw new Error('Missing parameter');
}


class Fort{
  constructor(props, parent) {
    Object.assign(this, props)
    delete this.id
    this.parent = parent
  }

  isCheckpoint(){
    if (this.type == 1){
      return true
    }else{
      return false
    }
  }

  isGym(){
    if (this.type == 0){
      return true
    }else{
      return false
    }
  }

  search() {
    return this.parent.Call([{
      request: 'FORT_SEARCH',
      message: {
        fort_id: this.fort.fort_id,
        player_latitude: this.player.playerInfo.latitude,
        player_longitude: this.player.playerInfo.longitude,
        fort_latitude: this.fort.fort_latitude,
        fort_longitude: this.fort.fort_longitude
      }
    }])
  }

  recallPokemon(pokemon_id = mandatory()) {
    return this.parent.Call([{
      request: 'FORT_RECALL_POKEMON',
      message: {
        fort_id: this.fort_id,
        pokemon_id: pokemon_id,
        player_latitude: this.parent.player.playerInfo.latitude,
        player_longitude: this.parent.player.playerInfo.longitude,
      }
    }])
  }

  deployPokemon(pokemon_id = mandatory()) {
    return this.parent.Call([{
      request: 'FORT_DEPLOY_POKEMON',
      message: {
        fort_id: this.fort_id,
        pokemon_id: pokemon_id,
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
export default Fort

