import pokedex from '../pokedex.json'
import rand from 'randgen'

var pokedexMap = new Map();

for(let p of pokedex.pokemon)
  pokedexMap.set(p.id, p)

class Pokemon {
  constructor(props, parent) {
    Object.assign(this, props, pokedexMap.get(props.pokemon_id))

    delete this.id
    this.catchable = !props.distance_in_meters

    if(this.catchable)
      console.log(`[i] found ${this.name}. Direction: ${this.direction}`)

    this.parent = parent
  }

  get direction() {
    let google = 'https://www.google.com/maps/dir/Current+Location/'
    return google + `${this.latitude},${this.longitude}`
  }

  async encounter() {
    let {latitude, longitude} = this.parent.player.location

    this.isCatching = true

    let res = await this.parent.Call([{
      request: 'ENCOUNTER',
      message: {
        encounter_id: this.encounter_id,
        spawn_point_id: this.spawn_point_id,
        player_latitude: latitude,
        player_longitude: longitude,
      }
    }])

    return res
  }

  async catch() {

    var res;

    for(let i of Array(10)){
        var pokeball_ = 1

        try{
            res = await this.parent.Call([{
              request: 'CATCH_POKEMON',
              message: {
                encounter_id: this.encounter_id,
                pokeball: pokeball_,
                normalized_reticle_size: Math.min(1.95, rand.rnorm(1.9, 0.05)),
                spawn_point_guid: this.spawn_point_id,
                hit_pokemon: true,
                spin_modifier: Math.min(0.95, rand.rnorm(0.85, 0.1)),
                normalized_hit_position: 1.0,
              }
            }])

						var status = res.CatchPokemonResponse.status
						if (status == 1 || status == 3 || status == 0)
            	break
						/* CatchStatus {
							CATCH_ERROR = 0;
							CATCH_SUCCESS = 1;
							CATCH_ESCAPE = 2;
							CATCH_FLEE = 3;
							CATCH_MISSED = 4;
						} */

        } catch (error){
            console.log("Failed to catch. Trying again...")
            if (7 < i){
                console.log("Whipping out the MasterBall")
                pokeball_ = 2
            }
        }
    }

    console.log("Caught!")
    this.isCatching = false

    return res
  }

  async encounterAndCatch(pokeball) {
    this.isCatching = true
    var pok = await this.encounter()
    // todo.. add a little timer here?
    var result = await this.catch(pokeball)
    this.isCatching = false

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
