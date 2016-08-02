# pokemongo-api ![](https://img.shields.io/npm/v/pokemongo-api.svg) [![npm](https://img.shields.io/npm/dt/pokemongo-api.svg)]() ![Travis](https://img.shields.io/travis/stoffern/pokemongo-api.svg) [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/) [![Gitter](https://img.shields.io/gitter/room/nwjs/nw.js.svg?maxAge=2592000)](https://gitter.im/pokemongo-api/Lobby)

Pokemon Go API for nodejs


Query the Pokemon database for what you want..
This library covers all functions available in the api through `Call()`
We are also working on porting all calls into functions,

## Install
```
npm i -S pokemongo-api
```

## Example
See /example folder for more complex examples

```js
const Poke = new PokeAPI()

Poke.player.location = {
  latitude: parseFloat(lat),
  longitude: parseFloat(lng)
}

const api = await Poke.login(username, password, provider)

let player = await Poke.GetPlayer()
let inventory = await Poke.GetInventory()
let {items} = inventory

while( true ) {
  let objects = await Poke.GetMapObjects()

  // catchable pokemons from here?
  for (let pokemon of objects.catchable_pokemons) {
    await pokemon.encounter()
    await pokemon.catch()
  }

  // Gym's (are sorted by distance)
  for (let gym of objects.forts.gyms) {
    // We have a gym
    if (gym.withinRange) {
      // Do something with the gym
    }
  }

  // Checkpoint's (aka: pokestop) (are sorted by distance)
  for (let checkpoint of objects.forts.checkpoints) {
    if (!checkpoint.cooldown && checkpoint.withinRange) {
      // Collect pokestop rewards
      let res = await checkpoint.search()
    }
  }

  //just walk a little (1 - 15 meters..)
  await Poke.player.walkAround()
  await new Promise(resolve => setTimeout(resolve, 3000))
}

```


# To-Do:
- [x] Login as pokemon trainer + token
- [x] Login over google + token
- [x] API connector
- [X] Make all calls available in functions
- [ ] Add proxy options to requests
- [X] Run to pokestops
- [X] Farm specific area for pokestops
- [X] Human walking logic
- [X] Catch Pokemon automatically
- [ ] Drop items when bag is full
- [ ] Scan your inventar for XYZ CP pokemon and release them
- [X] Pokemon catch filter
- [ ] Hatch eggs
- [X] Incubate eggs
- [X] Evolve pokemons
- [X] Use candy
- [x] Clean code
- [ ] Fully automate this script



## Player Object
```
{
  accessToken
  username
  password
  debug
  latitude
  longitude
  altitude
  provider
  sessionData
}
```
#### Available functions
```
player.provider()
player.profileDetails()
player.location()
player.location()
player.profile()
player.createdDate()
player.pokeStorage()
player.itemsStorage()
player.currency()
player.Login()
player.walkAround()
player.walkToPoint()
player.hatchedEggs()
player.levelUpRewards()
player.checkAwardBadges()
player.collectDailyBonus()
player.collectDailyBonus()
player.settings()
player.itemTemplates()
player.remoteConfigVersion()
player.remoteConfigVersion()
```

## Available functions (more to come)

## Pokemon object
```
{
  id
  pokemon_id
  cp
  stamina
  stamina_max
  move_1
  move_2
  deployed_fort_id
  owner_name
  is_egg
  egg_km_walked_target
  egg_km_walked_start
  origin
  height_m
  weight_kg
  individual_attack
  individual_defense
  individual_stamina
  cp_multiplier
  pokeball
  captured_cell_id
  battles_attacked
  battles_defended
  egg_incubator_id
  creation_time_ms
  num_upgrades
  additional_cp_multiplier
  favorite
  nickname
  from_fort
}
```
#### Available functions
```
pokemon.encounter()
pokemon.catch()
pokemon.encounterAndCatch()
pokemon.release()
pokemon.envolve()
pokemon.upgrade()
pokemon.setFavorite()
pokemon.nickname()
```

## Fort object (Checkpoint and Gym)
```
{
  fort_id
  team_color
  pokemon_data
  name
  image_urls
  fp
  stamina
  max_stamina
  type
  latitude
  longitude
  description
  modifiers
}
```
#### Available functions
```
fort.isCheckpoint
fort.isGym
fort.search()
fort.recallPokemon(Pokemon Object)
fort.deployPokemon(Pokemon Object)
fort.details()
fort.addModifier()
```



## Poke.GetPlayer()
- Returns the Player Object.

```js
profile{
  creation_time: {Number}
  username: {String}
  team: {Number}
  tutorial: {Number/Boolean}
  poke_storage: {String}
  item_storage: {String}
  daily_bonus{
    NextCollectTimestampMs: {Number}
    NextDefenderBonusCollectTimestampMs: {Number}
  }
  currency{
    type: {String}
    amount: {Number}
  }
}
```


## Poke.GetInventory()
- Retrives the inventory object.

```js
  inventory_delta{
    pokemon_data : {object}
    item : {object}
    pokedex_entry : {object}
    player_stats : {object}
    player_currency : {object}
    player_camera : {object}
    inventory_upgrades : {object}
    applied_items : {object}
    egg_incubators : {object}
    pokemon_family : {object}

  }
```
