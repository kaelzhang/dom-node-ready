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

const check_parent = parent => {
  if (!VALID_PARENTS.includes(parent)) {
    throw new TypeError(`invalid parent, expect document, 'body' or 'head', but got ${parent}`)
  }
}

const get_parent = parent => {
  if (parent === DOCUMENT) {
    return parent
  }

  check_parent(parent)

  return DOCUMENT[parent]
}

const exists = (raw_tester, {
  parent: raw_parent = DOCUMENT
} = {}) => {
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

const promisify = fn => (...args) => new Promise(resolve => {
  fn(...args, result => {
    resolve(result)
  })
})

const tag_ready = promisify((tag, callback) => {
  const TAG = tag.toUpperCase()

  check_parent(tag)

  if (DOCUMENT[tag]) {
    callback(DOCUMENT[tag])
    return
  }

  const observer = new MutationObserver(list => {
    for (const mutation of list) {
      for (const node of mutation.addedNodes) {
        if (node.nodeName === TAG) {
          observer.disconnect()
          callback(node)
          return
        }
      }
    }
  })

  observer.observe(DOCUMENT.documentElement, OBSERVE_OPTIONS)
})

const script_ready = promisify((tester, parent, callback) => {
  const observer = new MutationObserver(list => {
    for (const mutation of list) {
      for (const node of mutation.addedNodes) {
        if (
          node.nodeName === 'SCRIPT'
          && tester(node)
        ) {
          observer.disconnect()
          callback(node)
          return
        }
      }
    }
  })

  observer.observe(parent, OBSERVE_OPTIONS)
})

const script_node_ready = promisify((node, callback) => {
  const on_load = () => {
    node.removeEventListener('load', on_load)

    callback()
  }

  node.addEventListener('load', on_load)
})

const when = async (
  raw_tester, {
    parent: raw_parent = DOCUMENT
  } = {}
) => {
  const parent = raw_parent === DOCUMENT
    ? DOCUMENT
    : await tag_ready(raw_parent)

  const tester = make_tester(raw_tester)
  const node = await script_ready(tester, parent)
  await script_node_ready(node)

  return node
}

module.exports = {
  exists,
  when
}
