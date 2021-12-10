const OBSERVE_OPTIONS = {
  childList: true,
  attributes: false,
  subtree: true
}

const DOCUMENT = document

const MAKERS = {
  string: tester => node => node.src.includes(tester),
  regexp: tester => node => tester.test(node.src),
  function: tester => tester,
  invalid: tester => {
    throw new TypeError(`invalid tester: ${tester}`)
  }
}

const make_tester = tester => {
  const type = typeof tester
  const maker = type === 'string'
    ? MAKERS.string
    : type === 'function'
      ? MAKERS.function
      : tester && typeof tester.test === 'function'
        ? MAKERS.regexp
        : MAKERS.invalid

  return maker(tester)
}

const BODY = 'body'
const HEAD = 'head'
const SCRIPT = 'script'
const VALID_PARENTS = [BODY, HEAD]

const get_parent = parent => {
  if (parent === DOCUMENT) {
    return parent
  }

  if (!VALID_PARENTS.includes(parent)) {
    throw new TypeError(`invalid parent, expect document, 'body' or 'head', but got ${parent}`)
  }

  return DOCUMENT[parent]
}

const is = (raw_tester, {
  parent: raw_parent = DOCUMENT
}) => {
  const parent = get_parent(raw_parent)

  if (!parent) {
    return false
  }

  const tester = make_tester(raw_tester)

  for (const node of parent.getElementsByTagName(SCRIPT)) {
    if (tester(node)) {
      return true
    }
  }

  return false
}

const tag_ready = async tag => {
  const TAG = tag.toUpperCase()

  if (DOCUMENT[tag]) {
    return DOCUMENT[tag]
  }

  return new Promise(resolve => {
    const observer = new MutationObserver(list => {
      for (const mutation of list) {
        for (const node of mutation.addedNodes) {
          if (node.nodeName === TAG) {
            observer.disconnect()
            resolve(node)
            return
          }
        }
      }
    })

    observer.observe(DOCUMENT.documentElement, OBSERVE_OPTIONS)
  })
}

const WHEN_PARENT_READY = {
  body: () => tag_ready('body'),
  head: () => tag_ready('head')
}

const script_ready = js => promisify((body, callback) => {
  const observer = new MutationObserver(list => {
    for (const mutation of list) {
      for (const node of mutation.addedNodes) {
        if (
          node.nodeName === 'SCRIPT'
          && node.src.includes(js)
        ) {
          observer.disconnect()
          callback(node)
          return
        }
      }
    }
  })

  observer.observe(body, OBSERVE_OPTIONS)
})

const script_node_ready = promisify((node, callback) => {
  const on_load = () => {
    node.removeEventListener('load', on_load)

    callback()
  }

  node.addEventListener('load', on_load)
})

const when = (
  raw_tester, {
    parent: raw_parent = DOCUMENT
  }
) => {

}

module.exports = {
  is,
  when
}
