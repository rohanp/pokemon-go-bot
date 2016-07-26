import GeoCoder from 'geocoder'
import moment from 'moment'
import Auth from '~/Auth'
import geolib from 'geolib'


// all floats yo
function randrange(range){
    return Math.random() * range - range/2
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
    var date = new moment((this.playerInfo.sessionData.creation_timestamp_ms.toString() / 100)).format("dddd, MMMM Do YYYY, h:mm:ss a")
    console.log(`[+] You are playing Pokemon Go since: {${date}}`)
    return date
  }

  get pokeStorage() {
    var storage = this.playerInfo.sessionData.max_pokemon_storage
    // console.log(`[+] Poke Storage: {${storage}}`)
    return storage
  }

  get itemsStorage() {
    var storage = this.playerInfo.sessionData.max_item_storage
    console.log(`[+] Item Storage: {${storage}}`)
    return storage
  }

  // TODO use getter
  get currency() {
    var curr = this.playerInfo.sessionData.currencies
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

  walkAround(origin){

    var randlat = randrange(2e-4)
    var randlong = randrange(2e-4)

    let destination = {
      latitude: this.location.latitude + randlat,
      longitude: this.location.longitude + randlong,
    }

    let distance = geolib.getDistance(this.location, origin)

    if (distance > 300){
        console.log("I've wandered off! Heading back to origin...")
        walkToPoint(...origin)
    }

    this.location = destination

    console.log(`[i] We just walked ${distance} meters`)
  }


  async walkToPoint(lat, long){

      if (lat == null || long == null)
        throw new Error('Null lat/long')

      // at 4 m/s
    let stepSize = 8 // meters

    let destination = {
      latitude: lat,
      longitude: long
    }

    var difference = {
                        latitude: destination.latitude - this.location.latitude,
                        longitude: destination.longitude - this.location.longitude
                    }

    var distance = geolib.getDistance(this.location, destination)

    // scale distance to step size
    difference.latitude *= stepSize / distance
    difference.longitude *= stepSize / distance

    var newLocation = {
                    latitude: this.location.latitude + difference.latitude,
                    longitude: this.location.longitude + difference.longitude
                }

    // add bit of randomness
    newLocation.latitude += (Math.random() - 0.5) * 1e-4
    newLocation.longitude += (Math.random() - 0.5) * 1e-4

    //distance less than 10 meters?
    if (distance <= 10){
      console.log(`[i] Walked to specified distance`)
      return true
    } else {

      this.location  = newLocation
      console.log(`[i] Walking closer to [`+lat+`,`+long+`] - distance is: ${distance} meters`)
      await new Promise(resolve => setTimeout(resolve, 2000))
      await this.walkToPoint(lat, long)
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
