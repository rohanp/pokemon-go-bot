import API from './API'

class Fort{
  constructor(props) {
    Object.assign(this, props)
    delete this.id
    this.api = new API()
  }

  recallPokemon(fort_id, pokemon_id = mandatory()) {
    return this.Call([{
      request: 'FORT_RECALL_POKEMON',
      message: {
        fort_id: fort_id,
        pokemon_id: pokemon_id,
        player_latitude: this.player.playerInfo.latitude,
        player_longitude: this.player.playerInfo.longitude,
      }
    }])
  }

  deployPokemon(fort_id, pokemon_id = mandatory()) {
    return this.Call([{
      request: 'FORT_DEPLOY_POKEMON',
      message: {
        fort_id: fort_id,
        pokemon_id: pokemon_id,
        player_latitude: this.player.playerInfo.latitude,
        player_longitude: this.player.playerInfo.longitude,
      }
    }])
  }

  details(fort = mandatory()) {
    return this.Call([{
      request: 'FORT_DETAILS',
      message: {
        fort_id: fort.fort_id,
        latitude: fort.latitude,
        longitude: fort.longitude,
      }
    }])
  }

  search(fort = mandatory()) {
    return this.Call([{
      request: 'FORT_SEARCH',
      message: {
        fort_id: fort.fort_id,
        player_latitude: this.player.playerInfo.latitude,
        player_longitude: this.player.playerInfo.longitude,
        fort_latitude: fort.fort_latitude,
        fort_longitude: fort.fort_longitude
      }
    }])
  }
}
export default Fort

