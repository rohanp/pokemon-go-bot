import pokedex from '../pokedex.json'
import rand from 'randgen'

var pokedexMap = new Map();

for(let p of pokedex.pokemon)
  pokedexMap.set(p.id, p)

class Pokemon{
  constructor(props, parent) {
    Object.assign(this, props, pokedexMap.get(props.pokemon_id))

    delete this.id
    this.catchable = !props.distance_in_meters

    if(this.catchable)
      console.log(`[i] found ${this.name}. Direction: ${this.direction}`)

    this.parent = parent
  }

  get direction(){
    let google = 'https://www.google.com/maps/dir/Current+Location/'
    return google + `${this.latitude},${this.longitude}`
  }

  async encounter() {
    this.isCatching = true
    var res = await this.parent.Call([{
      request: 'ENCOUNTER',
      message: {
        encounter_id: this.encounter_id,
        spawn_point_id: this.spawn_point_id,
        player_latitude: this.parent.player.playerInfo.latitude,
        player_longitude: this.parent.player.playerInfo.longitude,
      }
    }])
    this.encounter_id = res.EncounterResponse.wild_pokemon.encounter_id
    this.spawn_point_id = res.EncounterResponse.wild_pokemon.spawn_point_id
    return res
  }

  async catch() {
    var res = await this.parent.Call([{
      request: 'CATCH_POKEMON',
      message: {
        encounter_id: this.encounter_id,
        pokeball: 1,
        normalized_reticle_size: Math.min(1.95, rand.rnorm(1.9, 0.05)),
        spawn_point_guid: this.spawn_point_id,
        hit_pokemon: true,
        spin_modifier: Math.min(0.95, rand.rnorm(0.85, 0.1)),
        normalized_hit_position: 1.0,
      }
    }])
    this.isCatching = false
    return res
  }

  async encounterAndCatch(){
    this.isCatching=true
    var pok = await this.encounter()
    //todo.. add a little timer here?
    var result = await this.catch()
    this.isCatching=false

    return result
  }

  release() {
    return this.parent.Call([{
      request: 'RELEASE_POKEMON',
      message: {
        pokemon_id: this.pokemon_id,
      }
    }])
  }

  envolve() {
    return this.parent.Call([{
      request: 'EVOLVE_POKEMON',
      message: {
        pokemon_id: this.pokemon_id,
      }
    }])
  }

  upgrade() {
    return this.parent.Call([{
      request: 'UPGRADE_POKEMON',
      message: {
        pokemon_id: this.pokemon_id,
      }
    }])
  }

  setFavorite() {
    return this.parent.Call([{
      request: 'SET_FAVORITE_POKEMON',
      message: {
        pokemon_id: this.pokemon_id,
        is_favorite: true,
      }
    }])
  }

  nickname(name) {
    return this.parent.Call([{
      request: 'NICKNAME_POKEMON',
      message: {
        pokemon_id: this.pokemon_id,
        nickname: name,
      }
    }])
  }


}
export default Pokemon
