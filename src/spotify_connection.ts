import fetch from "node-fetch"
import env from "dotenv"
env.config()

const JacobSpitifyURI = "1csF3aXBFJhCXUtn8YJit6"

let token
function setNewToken() {
  const url = "https://accounts.spotify.com/api/token"
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `grant_type=client_credentials&client_id=${process.env.SPOTIFY_CLIENT_ID}&client_secret=${process.env.SPOTIFY_CLIENT_SECRET}`,
  })
    .then((res) => res.json())
    .then((body) => {
      // console.log(`Getting New Spotify Token : ${body["access_token"]}`)
      token = body["access_token"]
    })
    .catch((e) => {
      console.error(e)
    })
}

export async function getJacobsTrack(trackNumber) {
  let trackInfo = {}
  trackInfo["track_num"] = trackNumber

  await setNewToken()
  const albums = await getAlbums()
  const albumId = albums["items"][trackNumber]["id"]

  const tracks = await getTracks(albumId)
  trackInfo["title"] = tracks["tracks"]["items"][0]["name"]
  trackInfo["preview"] = tracks["tracks"]["items"][0]["preview_url"]
  trackInfo["cover"] = tracks["images"][0]["url"]
  trackInfo["release_date"] = tracks["release_date"]
  const trackId = tracks["tracks"]["items"][0]["id"]

  const trackAudioFeatures = await getTrackAudioFeatures(trackId)
  let trackDescriptionInfo = {}
  trackDescriptionInfo["acousticness"] = trackAudioFeatures["acousticness"]
  trackDescriptionInfo["danceability"] = trackAudioFeatures["danceability"]
  trackDescriptionInfo["energy"] = trackAudioFeatures["energy"]
  trackDescriptionInfo["time_signature"] = trackAudioFeatures["time_signature"]
  trackDescriptionInfo["valence"] = trackAudioFeatures["valence"]
  trackInfo["track_description_info"] = trackDescriptionInfo

  return trackInfo
}

function getAlbums() {
  const url = `https://api.spotify.com/v1/artists/${JacobSpitifyURI}/albums`
  return fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((body) => {
      return body
    })
    .catch((error) => console.error(error))
}

function getTracks(albumId) {
  const url = `https://api.spotify.com/v1/albums/${albumId}`
  return fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((jsonRes) => {
      return jsonRes
    })
    .catch((e) => console.error(e))
}
function getTrackAudioFeatures(trackId) {
  const url = `https://api.spotify.com/v1/audio-features/${trackId}`
  return fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((jsonRes) => {
      return jsonRes
    })
    .catch((e) => console.error(e))
}
