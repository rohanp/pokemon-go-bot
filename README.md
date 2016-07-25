# pokemongo-api
Pokemon Go API for nodejs


Query the Pokemon database for what you want..
This library covers all functions available in the api throu `Call()`
We are also working now to port all calls into functions,

## Install
```
npm i -S pokemongo-api
```

## Example
See /example folder

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
- [ ] Pokemon catch filter
- [ ] Hatch eggs
- [ ] Incubate eggs
- [ ] Evolve pokemons
- [ ] Use candy
- [x] Clean code
- [ ] Fully automate this script



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
#### available functions
```
pokemon.encounter()
pokemon.catch()
pokemon.encounterAndCatch()
pokemon.release()
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
#### available functions
```
fort.isCheckpoint()
fort.isGym()
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