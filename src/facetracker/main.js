import { AUPredictor } from "@quarkworks-inc/avatar-webkit"

import SleepWorker from "./worker?worker"

const FPS = 30

const statusEl = document.querySelector("#status")

statusEl.textContent = "Initializing camera..."

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

const worker = new SleepWorker()

worker.onmessage = () => {
  predictor.predict(videoEl)
}

/**
 * @param {import("@quarkworks-inc/avatar-webkit").AvatarPrediction} results
 */
predictor.onPredict = (results) => {
  bc.postMessage({ type: "results", payload: results })
  worker.postMessage(1000 / FPS)
}

statusEl.textContent = "Initializing model..."

// Start prediction loop
predictor.predict(videoEl).then(() => {
  statusEl.textContent = "Tracking started"
  console.log("initialized")
})
