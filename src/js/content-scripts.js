import storage from './utils/storage'
import logger from './utils/logger'

logger.log('ready')

let doc
let observer1
let observer2

const querySelectorAsync = (selector) => {
  return new Promise((resolve, reject) => {
    const expireMillis = 5000
    const expire = Date.now() + expireMillis
    const timer = setInterval(() => {
      const dom = doc.querySelector(selector)
      if (dom) {
        if (timer) {
          clearInterval(timer)
        }
        resolve(dom)
        return
      }
      if (Date.now() > expire) {
        if (timer) {
          clearInterval(timer)
        }
        reject(new Error(`querySelectorAsync <${selector}> timeout ${expireMillis}ms`))
      }
    }, 100)
  })
}

const getState = async () => {
  const items = await storage.get('vuex')
  const values = JSON.parse(items['vuex'])
  return values
}

const update = async () => {
  logger.log('update')
  const state = await getState()
  const messages = Array.from(doc.querySelectorAll('yt-live-chat-text-message-renderer'))
  messages.forEach((message) => {
    const menu = message.querySelector('#menu')
    message.style.backgroundColor = null
    menu.style.background = null
    if (!state.enabled) {
      return
    }
    const authorType = message.getAttribute('author-type')
    switch (true) {
      case authorType === 'owner' && !!state.ownerColor:
        message.style.backgroundColor = state.ownerColor
        menu.style.background = 'none'
        return
      case authorType === 'moderator' && !!state.moderatorColor:
        message.style.backgroundColor = state.moderatorColor
        menu.style.background = 'none'
        return
      case authorType === 'member' && !!state.memberColor:
        message.style.backgroundColor = state.memberColor
        menu.style.background = 'none'
        return
    }
    // const author = message.querySelector('#author-name')
    // if (author.innerText === 'dummy') {
    message.style.backgroundColor = 'gray'
    menu.style.background = 'none'
    // return
    // }
  })
}

const proceed = async () => {
  logger.log('proceed')
  const items = await querySelectorAsync('#items.yt-live-chat-item-list-renderer')
  if (observer2) {
    observer2.disconnect()
  }
  observer2 = new MutationObserver(() => {
    update()
  })
  observer2.observe(items, { childList: true })
}

const urlChanged = async (data) => {
  const urlString = data.url
  logger.log('url received: %s', urlString)

  const url = new URL(urlString)
  if (!url.pathname.match(/^\/channel\/[^/]*\/live$/) && !url.pathname.match(/^\/watch$/)) {
    logger.log('url not match')
    return
  }

  if (url.host === 'www.youtube.com') {
    // logger.log('waiting for iframe')
    // const iframe = await waitIframe()
    // currentDocument = iframe.contentWindow.document
    // iframe.addEventListener('DOMNodeRemoved', () => {
    //   console.log('removed')
    // })
    // const observer = new MutationObserver(() => {
    //   logger.log('observe')
    //   proceed(currentDocument)
    // })
    // observer.observe(iframe, { childList: true })
  } else if (url.host === 'gaming.youtube.com') {
    doc = document
    const itemList = await querySelectorAsync('#item-list.yt-live-chat-renderer')
    if (observer1) {
      observer1.disconnect()
    }
    observer1 = new MutationObserver(() => {
      proceed()
    })
    observer1.observe(itemList, { childList: true })
    proceed()
  } else {
    logger.log('host not match')
  }
}

const stateChanged = async (data) => {
  update()
}

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  const { id, data } = message
  logger.log('message received: %s', id)
  switch (id) {
    case 'urlChanged':
      urlChanged(data)
      break
    case 'stateChanged':
      stateChanged(data)
      break
  }
})
