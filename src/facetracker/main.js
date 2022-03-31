import { AUPredictor } from "@quarkworks-inc/avatar-webkit"

console.log("hello")

/**
 * @typedef {import("@quarkworks-inc/avatar-webkit").AvatarPrediction} AvatarPrediction
 */

/**
 * BroadcastChannel
 */
const bc = new BroadcastChannel("facetracker_channel")
bc.postMessage({ type: "log", payload: "hello from facetracker" })

/**
 * @typedef {(
 *    {type: 'log', payload: string} |
 *    {type: 'results', payload: AvatarPrediction}
 * )} FacetrackerAction
 */

/**
 * Hallway SDK
 */
const videoEl = document.createElement("video")
let videoStream = await navigator.mediaDevices.getUserMedia({
  audio: false,
  video: {
    width: { ideal: 640 },
    height: { ideal: 360 },
    facingMode: "user",
  },
})
videoEl.srcObject = videoStream
videoEl.autoplay = true

let predictor = new AUPredictor({
  apiToken: import.meta.env.VITE_AVATAR_WEBKIT_AUTH_TOKEN,
})

const FPS = 30

/**
 *
 * @param {import("@quarkworks-inc/avatar-webkit").AvatarPrediction} results
 */
predictor.onPredict = (results) => {
  console.log(results.actionUnits.jawOpen)
  bc.postMessage({ type: "results", payload: results.actionUnits.jawOpen })
  setTimeout(predict, 1000 / FPS)
}

function predict() {
  predictor.predict(videoEl)
}

// Start prediction loop
predict()

// await predictor.start({ stream: videoStream })
// console.log("Predictor started...")