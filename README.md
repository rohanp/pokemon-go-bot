# pokemon-go-api
Pokemon Go API for nodejs


THIS IS A WIP (Work in progress) feed free to help.


## Install
```
npm i -S pokemongo-api-js
```


## Example

```js
import Poke from pokemongo-api-js
```

```js
const Poke = new PokeAPI()
Poke.login(
  'user', 
  'password', {
    type: 'name',
    name: 'Strandboulevarden 89, 2100 København Ø'
  }
  , 'ptc')
.then( res => {
  
  res.Call('PLAYER_UPDATE')
  .then(res = {
    //do something?
  })
  .catch( err => console.log(err))
  
})
.catch(err => console.log(err))
```


Calls:
``` 
METHOD_UNSET = 0;                     // No implementation required
PLAYER_UPDATE = 1;                    // Implemented [R & M]
GET_PLAYER = 2;                       // Implemented [R & M]
GET_INVENTORY = 4;                    // Implemented [R & M]
DOWNLOAD_SETTINGS = 5;                // Implemented [R & M]
DOWNLOAD_ITEM_TEMPLATES = 6;          // Implemented [R & M]
DOWNLOAD_REMOTE_CONFIG_VERSION = 7;   // Implemented [R & M]
FORT_SEARCH = 101;                    // Implemented [R & M]
ENCOUNTER = 102;                      // Implemented [R & M]
CATCH_POKEMON = 103;                  // Implemented [R & M]
FORT_DETAILS = 104;                   // Implemented [R & M]
ITEM_USE = 105;                       // Can't find this one
GET_MAP_OBJECTS = 106;                // Implemented [R & M]
FORT_DEPLOY_POKEMON = 110;            // Implemented [R & M]
FORT_RECALL_POKEMON = 111;            // Implemented [R & M]
RELEASE_POKEMON = 112;                // Implemented [R & M]
USE_ITEM_POTION = 113;                // Implemented [R & M]
USE_ITEM_CAPTURE = 114;               // Implemented [R & M]
USE_ITEM_FLEE = 115;                  // Can't find this one
USE_ITEM_REVIVE = 116;                // Implemented [R & M]
TRADE_SEARCH = 117;                   // Not yet implemented in the game
TRADE_OFFER = 118;                    // Not yet implemented in the game
TRADE_RESPONSE = 119;                 // Not yet implemented in the game
TRADE_RESULT = 120;                   // Not yet implemented in the game
GET_PLAYER_PROFILE = 121;             // Implemented [R & M]
GET_ITEM_PACK = 122;                  // Can't find this one
BUY_ITEM_PACK = 123;                  // Can't find this one
BUY_GEM_PACK = 124;                   // Can't find this one
EVOLVE_POKEMON = 125;                 // Implemented [R & M]
GET_HATCHED_EGGS = 126;               // Implemented [R & M]
ENCOUNTER_TUTORIAL_COMPLETE = 127;    // Implemented [R & M]
LEVEL_UP_REWARDS = 128;               // Implemented [R & M]
CHECK_AWARDED_BADGES = 129;           // Implemented [R & M]
USE_ITEM_GYM = 133;                   // Implemented [R & M]
GET_GYM_DETAILS = 134;                // Implemented [R & M]
START_GYM_BATTLE = 135;               // Implemented [R & M]
ATTACK_GYM = 136;                     // Implemented [R & M]
RECYCLE_INVENTORY_ITEM = 137;         // Implemented [R & M]
COLLECT_DAILY_BONUS = 138;            // Implemented [R & M]
USE_ITEM_XP_BOOST = 139;              // Implemented [R & M]
USE_ITEM_EGG_INCUBATOR = 140;         // Implemented [R & M]
USE_INCENSE = 141;                    // Implemented [R & M]
GET_INCENSE_POKEMON = 142;            // Implemented [R & M]
INCENSE_ENCOUNTER = 143;              // Implemented [R & M]
ADD_FORT_MODIFIER = 144;              // Implemented [R & M]
DISK_ENCOUNTER = 145;                 // Implemented [R & M]
COLLECT_DAILY_DEFENDER_BONUS = 146;   // Implemented [R & M]
UPGRADE_POKEMON = 147;                // Implemented [R & M]
SET_FAVORITE_POKEMON = 148;           // Implemented [R & M]
NICKNAME_POKEMON = 149;               // Implemented [R & M]
EQUIP_BADGE = 150;                    // Implemented [R & M]
SET_CONTACT_SETTINGS = 151;           // Implemented [R & M]
GET_ASSET_DIGEST = 300;               // Implemented [R & M]
GET_DOWNLOAD_URLS = 301;              // Implemented [R & M]
GET_SUGGESTED_CODENAMES = 401;        // Implemented [R & M]
CHECK_CODENAME_AVAILABLE = 402;       // Implemented [R & M] TEST RESPONSE
CLAIM_CODENAME = 403;                 // Implemented [R & M] TEST RESPONSE
SET_AVATAR = 404;                     // Implemented [R & M]
SET_PLAYER_TEAM = 405;                // Implemented [R & M]
MARK_TUTORIAL_COMPLETE = 406;         // Implemented [R & M]
LOAD_SPAWN_POINTS = 500;              // Can't find this one
ECHO = 666;                           // Implemented [R & M]
DEBUG_UPDATE_INVENTORY = 700;
DEBUG_DELETE_PLAYER = 701;
SFIDA_REGISTRATION = 800;             // Not yet released.
SFIDA_ACTION_LOG = 801;               // Not yet released.
SFIDA_CERTIFICATION = 802;            // Not yet released.
SFIDA_UPDATE = 803;                   // Not yet released.
SFIDA_ACTION = 804;                   // Not yet released.
SFIDA_DOWSER = 805;                   // Not yet released.
SFIDA_CAPTURE = 806;                  // Not yet released.
```