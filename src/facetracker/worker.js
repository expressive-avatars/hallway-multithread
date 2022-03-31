onmessage = (e) => {
  setTimeout(() => {
    postMessage(null)
  }, e.data)
}
