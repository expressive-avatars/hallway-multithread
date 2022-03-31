import { AvatarPreview } from "./AvatarPreview"
import "./style.css"

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
      console.log(action.payload)
  }
}

bc.addEventListener("message", onMessage)

// Button

function onClick() {
  window.open("/facetracker/", "_blank", "height=300,width=300")
}

const btn = document.querySelector("#btn")
btn.addEventListener("click", onClick)

const preview = new AvatarPreview()
document.body.appendChild(preview.domElement)
