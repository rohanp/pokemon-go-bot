import GeoCoder from 'geocoder'
import moment from 'moment'
import Auth from '~/Auth'
import geolib from 'geolib'

// Gives a random meters in any direction
function getRandomDirection(){
  let latMorP = Math.random() < 0.5 ? -1 : 1
  let longMorP = Math.random() < 0.5 ? -1 : 1

  let latitude = ((Math.floor((Math.random() * 13) + 1))/100000)*latMorP
  let longitude = ((Math.floor((Math.random() * 13) + 1))/100000)*longMorP

  return {latitude, longitude}
}

class Player {
  constructor(parent) {
    this.parent = parent
    this.playerInfo = {
      accessToken: '',
      username: '',
      password: '',
      debug: true,
      latitude: 0,
      longitude: 0,
      altitude: 0,
      provider: '',
      sessionData: {},
    }
    this.Auth = new Auth()
  }

  set provider(provider) {
    this.playerInfo.provider = provider
  }

  set profileDetails(data) {
    this.playerInfo.sessionData = data
  }

  get location() {
    let { latitude, longitude } = this.playerInfo
    return { latitude, longitude }
  }

  set location(coords) {
    Object.assign(this.playerInfo, coords)
    return coords
  }

  get profile() {
    return this.playerInfo
  }

  // TODO return Date obj
  get createdDate() {
    var date = new moment((this.playerInfo.sessionData.creation_time.toString() / 100)).format("dddd, MMMM Do YYYY, h:mm:ss a")
    console.log(`[+] You are playing Pokemon Go since: {${date}}`)
    return date
  }

  get pokeStorage() {
    var storage = this.playerInfo.sessionData.poke_storage
    console.log(`[+] Poke Storage: {${storage}}`)
    return storage
  }

  get itemsStorage() {
    var storage = this.playerInfo.sessionData.item_storage
    console.log(`[+] Item Storage: {${storage}}`)
    return storage
  }

  // TODO use getter
  get currency() {
    var curr = this.playerInfo.sessionData.currency
    curr.map(obj => {
      console.log(`[+] Currency (${obj.type}): {${storage}}`)
    })
    return curr
  }

  async Login(user, pass) {
    let res = await this.Auth.login(user, pass, this.playerInfo.provider)

    this.playerInfo.username = user
    this.playerInfo.password = pass
    this.playerInfo.accessToken = res

    return this.playerInfo
  }

  walkAround(){
    let random = getRandomDirection()

    let destination = {
      latitude: this.location.latitude + random.latitude,
      longitude: this.location.longitude + random.longitude
    }

    let distance = geolib.getDistance(this.location, destination)

    this.location = destination

    console.log(`[i] We just walked ${distance} meters`)
  }


  async walkToPoint(lat, long){
    let random = getRandomDirection()

    let destination = {
      latitude: this.location.latitude > lat
        ? this.playerInfo.latitude -= random.latitude
        : this.playerInfo.latitude += random.latitude,

      longitude: this.location.longitude > lat
        ? this.playerInfo.longitude -= random.latitude
        : this.playerInfo.longitude += random.latitude
    }

    var distance = geolib.getDistance(this.location, destination)

    //distance less than 10 meters?
    if (distance <= 10){
      return true
    } else {
      this.walkToPoint(lat, long)
      console.log(`[i] Walking closer to [`+lat+`,`+lng+`] - distance is: ${distance} meters`)
      await new Promise(resolve => setTimeout(resolve, 2700))
    }
  }


  hatchedEggs() {
    return this.parent.Call([{
      request: 'GET_HATCHED_EGGS',
    }])
  }



  settings() {
    return this.parent.Call([{
      request: 'DOWNLOAD_SETTINGS',
      message: {
        hash: "05daf51635c82611d1aac95c0b051d3ec088a930",
      }
    }])
  }

  itemTemplates() {
    return this.parent.Call([{
      request: 'DOWNLOAD_ITEM_TEMPLATES',
    }])
  }

  remoteConfigVersion() {
    return this.parent.Call([{
      request: 'DOWNLOAD_REMOTE_CONFIG_VERSION',
      message: {
        platform: 2, //android
        device_manufacturer: "Samsung",
        device_model: "SM-G920F",
        locale: "en-GB",
        app_version: 293,
      }
    }])
  }

  remoteConfigVersion() {
    return this.parent.Call([{
      request: 'GET_PLAYER_PROFILE',
      message: {
        player_name: this.sessionData.username
      }
    }])
  }

}

export default Player
