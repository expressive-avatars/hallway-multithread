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
      const { rotation, actionUnits } = results
      preview.setBlendShapes(actionUnits)
      preview.setHeadRotation(-rotation.pitch, rotation.yaw, -rotation.roll)

      const eyeRotationX = actionUnits["eyeLookDownRight"] * 0.5 - actionUnits["eyeLookUpRight"] * 0.5
      const eyeRotationZ = actionUnits["eyeLookOutRight"] - actionUnits["eyeLookOutLeft"]
      preview.setEyeRotation(eyeRotationX, 0, eyeRotationZ)
  }
}

bc.addEventListener("message", onMessage)

// Button

function onClick() {
  window.open("/facetracker/", "_blank", "height=300,width=300")
}

const btn = document.querySelector("#btn")
btn.addEventListener("click", onClick)
