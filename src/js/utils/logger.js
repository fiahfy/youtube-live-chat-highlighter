class Logger {
  log (msg, ...args) {
    let message = '[youtube-live-chat-highlighter] '
    let params = args
    if (typeof msg === 'string') {
      message += msg
    } else {
      message += '%o'
      params.unshift(msg)
    }
    console.log(message, ...params)
  }
}

export default new Logger()
