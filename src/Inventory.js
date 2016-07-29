import "babel-polyfill"

class Item {
  constructor(id){
    this.count = 0
    this.id = id

    // Specifyes the max amount of this
    // item that you want to keep
    this.max = Infinity
  }

  recycle(count){}
}

class useOnEncounter extends Items {
  constructor(id){ super(id) }
  async useOn(pokemon){
    if(!pokemon.isCatching)
      throw new Error('That pokemon already have max HP')
  }
}

class useOnWounded extends Items {
  constructor(id){ super(id) }
  async useOn(pokemon) {
    // Validate that the pokemon needs HP
    if(!pokemon.isWounded)
      throw new Error('That pokemon already have max HP')

    await response
    this.count--
  }
}

class useOnDead extends Items {
  constructor(id){ super(id) }
  async useOn(){
    // Validate that the pokemon needs HP
    if(!pokemon.isDead)
      throw new Error('That pokemon already have max HP')

    await response
    this.count--
  }
}

var usePotion = item_id => pokemon => {
  return this.parent.Call([{
    request: 'USE_ITEM_POTION',
    message: {
      item_id,
      pokemon_id: pokemon.pokemon_id,
    }
  }])
}



/**
 * This will hold an array with items that you have
 */
class Items {
  constructor(){
    Object.assign(this, {
      pokeBall: new useOnEncounter(1),
      greatBall: new useOnEncounter(2),
      ultraBall: new useOnEncounter(3),
      masterBall: new useOnEncounter(4),
      potion: usePotion(101),
      superPotion: usePotion(102),
      hyperPotion: usePotion(103),
      maxPotion: usePotion(104),
      revive: new useOnDead(201),
      maxRevive: new useOnDead(202),
      luckyEgg: new Item(301),
      incenseOrdinary: new Item(401),
      // incenseSpicy: {id: 0}
      // incenseCool: {id: 0}
      // incenseFloral: {id: 0}
      troyDisk: new Item(501),
      // xAttack: {id: 0}
      // xDefense: {id: 0}
      // xMiracle: {id: 0}
      razzBerry: new useOnEncounter(701),
      blukBerry: new useOnEncounter(702),
      nanabBerry: new useOnEncounter(703),
      weparBerry: new useOnEncounter(704),
      pinapBerry: new useOnEncounter(705),
      incubatorBasicUnlimited: new Item(901),
      incubatorBasic: new Item(902)
    })
  }


  /**
   * Gets the best ball you can use
   * agains a pokemon you are trying to catch
   *
   * @return {Item} the poke ball you can use
   */
  get bestBall() {
    // See https://github.com/stoffern/pokemongo-api/blob/b8211baf6235b60a4a40628c83fd2049faf6b9cd/example/example.js#L16
  }



  /**
   * Returns whatever or not the bag is full
   *
   * @return {Boolean} true if the bag is full
   */
  get isFull() {
    return
  }



  /**
   * Returns number of items in the inventory
   *
   * @return {Boolean} true if the bag is full
   */
  get count() {
    return
  }


}



/**
 * This will hold an array with pokemons that you own
 */
class Pokemons extends Array {
  constructor() {
    super()
  }
}



/**
 * This will hold an array with eggs that you own
 */
class Eggs extends Array {
  constructor(){
    super()
  }
}



class Inventory {
  constructor(){
    this.items = new Items
    this.pokemons = new pokemons
    this.eggs = new Eggs
  }



  /**
   * Updates the inventory from the cloud
   * @return {Promise} Resolves to true/false if success
   */
  update() {
  }



  /**
   * Adds the items from a checkpoint in to the Inventory
   */
  add() {
  }

}

export default Inventory
