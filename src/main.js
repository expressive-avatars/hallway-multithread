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
  }
}

bc.addEventListener("message", onMessage)

// Button

function onClick() {
  window.open("/facetracker/")
}

const btn = document.querySelector("#btn")
btn.addEventListener("click", onClick)
