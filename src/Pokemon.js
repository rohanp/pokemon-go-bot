import pokedex from '../pokedex.json'
import rand from 'randgen'

var pokedexMap = new Map();

for(let p of pokedex.pokemon)
  pokedexMap.set(p.id, p)


var	getPokedexEntry = function(pokemon_id) {
	   let pokemon = pokedexMap.get(pokemon_id);
	   if (pokemon) {
	     delete pokemon.id;
	   }
	   return pokemon;

	 }

/**
 * [class description]
 */
class Pokemon {
  constructor(props, parent) {
    Object.assign(this, props, getPokedexEntry(props.pokemon_id))
    Object.defineProperty(this, 'parent', {value: parent})

    this.catchable = !props.distance_in_meters
  }



  /**
   * Return the coordinates of the pokemon
   * @return {Object} {latitude, longitude}
   */
  get location() {
    return {
        latitude: this.latitude,
        longitude: this.longitude
    }
  }



  /**
   * [encounter description]
   * @return {[type]} [description]
   */
  async encounter() {
    let {latitude, longitude} = this.parent.player.location

    this.isCatching = true

		const Status = Object.freeze({
	    ERROR: 0,
	    SUCCESS: 1,
			NOT_FOUND: 2,
			CLOSED: 3,
			POKEMON_FLED: 4,
			NOT_IN_RANGE: 5,
			ALREADY_HAPPENED: 6,
			INVENTORY_FULL: 7

		})

    let res = await this.parent.Call([{
      request: 'ENCOUNTER',
      message: {
        encounter_id: this.encounter_id,
        spawn_point_id: this.spawn_point_id,
        player_latitude: latitude,
        player_longitude: longitude,
      }
    }])

		if (res.EncounterResponse.status == Status.INVENTORY_FULL){
			console.log("[!][!][!] Pokemon Inventory Full!!")
		}

    return res
  }

  async catch(items) {

		const Status = Object.freeze({
	    ERROR: 0,
	    SUCCESS: 1,
			ESCAPE: 2,
			FLEE: 3,
			MISSED: 4
		})

		const CATCH_ERROR = 0;
		const CATCH_SUCCESS = 1;
		const CATCH_ESCAPE = 2;
		const CATCH_FLEE = 3;
		const CATCH_MISSED = 4;

		var map = ["CATCH_ERROR", "CATCH_SUCCESS", "CATCH_ESCAPE",
							 "CATCH_FLEE", "CATCH_MISSED"]

    var res;

    for(let i of Array(10)){

        var ball = Math.random() > .25 ? items.poke_ball : items.great_ball

        try{
            res = await this.parent.Call([{
              request: 'CATCH_POKEMON',
              message: {
                encounter_id: this.encounter_id,
                pokeball: ball.item_id,
                normalized_reticle_size: Math.min(1.95, rand.rnorm(1.9, 0.05)),
                spawn_point_guid: this.spawn_point_id,
                hit_pokemon: true,
                spin_modifier: Math.min(0.95, rand.rnorm(0.85, 0.1)),
                normalized_hit_position: 1.0,
              }
            }])
						ball.count -= 1

						var status = res.CatchPokemonResponse.status
						console.log("[i] Catch Response: " + map[status])

						if (status == Status.SUCCESS ||
							  status == Status.FLEE ||
								status == STatus.CATCH_ERROR)
            	break

        } catch (error){
            console.log("[!] Failed to catch. Trying again...")
        }

				if (3 < i){
						console.log("Whipping out the GreatBall")
						ball = items.great_ball // great ball
				}
    }

    this.isCatching = false

    return res
  }



  /**
   * Gives a berry to the pokemon before
   * trying to catch it. Dose making it esier to catch
   *
   * Note that you can only feed it once.
   * Giving it twice don't make any diffrent
   *
   * @return {[type]} [description]
   */
  async feed() { // name the function to something matching the request?
    return console.warn('not done yet')

    if(this.isCatching)
      throw new Error('Can only feed berries to pokemon you have encounter')

    // TODO
    let res = await this.parent.Call([{
      request: '???'
    }])
  }

  /**
   * [encounterAndCatch description]
   * @param  {[type]} pokeball [description]
   * @return {[type]}          [description]
   */
  async encounterAndCatch(items) {
    this.isCatching = true
    let pok = await this.encounter()

		console.log("[!] Encountered a " + pokedexMap.get(this.pokemon_id).name)

		await new Promise(resolve => setTimeout(resolve, 100))

    // TODO: use berry?
    let result = await this.catch(items)
    this.isCatching = false

    return result
  }



  /**
   * [release description]
   * @return {[type]} [description]
   */
  async release() {
    let res = await this.parent.Call([{
      request: 'RELEASE_POKEMON',
      message: {
        pokemon_id: this.id,
      }
    }])

		return res
  }



  /**
   * [envolve description]
   * @return {[type]} [description]
   */
  evolve() {
    return this.parent.Call([{
      request: 'EVOLVE_POKEMON',
      message: {
        pokemon_id: this.pokemon_id,
      }
    }])
  }



  /**
   * [upgrade description]
   * @return {[type]} [description]
   */
  upgrade() {
    return this.parent.Call([{
      request: 'UPGRADE_POKEMON',
      message: {
        pokemon_id: this.pokemon_id,
      }
    }])
  }



  /**
   * [setFavorite description]
   */
  setFavorite() {
    return this.parent.Call([{
      request: 'SET_FAVORITE_POKEMON',
      message: {
        pokemon_id: this.pokemon_id,
        is_favorite: true,
      }
    }])
  }



  /**
   * [nickname description]
   * @param  {[type]} name [description]
   * @return {[type]}      [description]
   */
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
