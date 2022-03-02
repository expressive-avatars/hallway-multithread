const bc = new BroadcastChannel("facetracker_channel")

const action = { type: "log", payload: "hello from facetracker" }
bc.postMessage(action)
console.log(action)
