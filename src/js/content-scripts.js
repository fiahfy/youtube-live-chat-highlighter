import Color from 'color'
import { defaultState } from './store'
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
  try {
    return JSON.parse(items['vuex'])
  } catch (e) {
    return defaultState
  }
}

const getColor = (authorType, state) => {
  try {
    if (!state.enabled) {
      return null
    }

    switch (true) {
      case authorType === 'owner' && !!state.ownerColor:
        return Color(state.ownerColor)
      case authorType === 'moderator' && !!state.moderatorColor:
        return Color(state.moderatorColor)
      case authorType === 'member' && !!state.memberColor:
        return Color(state.memberColor)
    }
  } catch (e) {}

  return null
}

const update = async () => {
  logger.log('update')

  const state = await getState()

  const items = Array.from(doc.querySelectorAll('yt-live-chat-text-message-renderer'))
  items.forEach((item) => {
    const author = item.querySelector('#author-name')
    const message = item.querySelector('#message')
    const menu = item.querySelector('#menu')
    const authorType = item.getAttribute('author-type')

    const color = getColor(authorType, state)
    let backgroundColor = null
    let background = null
    let textColor = null
    let hintTextColor = null

    if (color !== null) {
      backgroundColor = color.rgb().string()
      background = 'none'
      const base = color.isLight() ? Color('black') : Color('white')
      textColor = base.rgb().string()
      hintTextColor = base.rgb().alpha(0.7).string()
    }

    item.style.backgroundColor = backgroundColor
    menu.style.background = background
    author.style.color = hintTextColor
    message.style.color = textColor
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
