import { AvatarPreview } from "./AvatarPreview"
import "./style.css"

// Three.js
const preview = new AvatarPreview()
document.body.appendChild(preview.domElement)

// BroadcastChannel

const bc = new BroadcastChannel("facetracker_channel")

/**
 * @param {{ data: { type: string, payload: any } }}
 */
function onMessage({ data: action }) {
  switch (action.type) {
    case "log":
      console.log(action.payload)
      break
    case "results":
      /** @type {import("@quarkworks-inc/avatar-webkit").AvatarPrediction} */
      const results = action.payload
      preview.setBlendShapes(results.actionUnits)
  }
}

bc.addEventListener("message", onMessage)

// Button

function onClick() {
  window.open("/facetracker/", "_blank", "height=300,width=300")
}

const btn = document.querySelector("#btn")
btn.addEventListener("click", onClick)
