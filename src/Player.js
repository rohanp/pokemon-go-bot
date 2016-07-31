import GeoCoder from 'geocoder'
import moment from 'moment'
import Auth from '~/Auth'

var _ = require("underscore")
var geolib = require("geolib")

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
      lastCheckpointSearch: {}
    }

		this.lastDirection = [randrange(1) * 1e-4, randrange(1) * 1e-4]
    this.Auth = new Auth(parent)
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
    this.parent.log.info(`[+] You are playing Pokemon Go since: {${date}}`)
    return date
  }

  get pokeStorage() {
    var storage = this.playerInfo.sessionData.max_pokemon_storage
    this.parent.log.info(`[+] Poke Storage: {${storage}}`)
    return storage
  }

  get itemsStorage() {
    var storage = this.playerInfo.sessionData.max_item_storage
    this.parent.log.info(`[+] Item Storage: {${storage}}`)
    return storage
  }

  // TODO use getter
  get currency() {
    var curr = this.playerInfo.sessionData.currencies
    curr.map(obj => {
      this.parent.log.info(`[+] Currency (${obj.type}): {${storage}}`)
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

  async walkAround(origin){

		function dot(x1, x2, y1, y2){
			return x1*y1 + x2*y2
		}

		do { // make sure dont go in opposite direction as last step
			var randlat = randrange(2e-4)
	    var randlong = randrange(2e-4)

		} while ( dot(randlat, randlong, ...this.lastDirection) < 0)

		if (Math.random() < 0.2)
			this.lastDirection = [randlat, randlong]

		let destination = {
		 latitude: this.location.latitude + randlat,
		 longitude: this.location.longitude + randlong
		 }

		if (isNaN(this.location.latitude)){
			throw Error("Location is undefined")
		}

    let distance = geolib.getDistance(this.location, origin)

		console.log(`[i] Distance from origin: ${distance}`)

    if (distance > 500){
        console.log("I've wandered off! Heading back to origin...")
        await this.walkToPoint(..._.values(origin))

		} else{
			this.location = destination
		}

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
      this.parent.log.info(`[i] Walked to specified distance`)
			this.location  = newLocation
      return true

    } else {
      this.location  = newLocation
      console.log(`[i] Walking to point: ${distance} m away`)
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

}

export default Player
