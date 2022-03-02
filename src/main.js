import "./style.css"

function onClick() {
  const facetrackerWindow = window.open("/facetracker/")

  /**
   *
   * @param {{ data: { type: string, payload: any } }}
   */
  function onMessage({ data: action }) {
    switch (action.type) {
      case "log":
        console.log(action.payload)
        break
    }
  }

  facetrackerWindow.addEventListener("message", onMessage)
}

const btn = document.querySelector("#btn")
btn.addEventListener("click", onClick)
