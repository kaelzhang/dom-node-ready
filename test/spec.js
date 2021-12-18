// foo.js?variable=a&value=1&delay=300

const test = async (title, tester) => {
  try {
    await tester()
  } catch (error) {
    error.message = `${title}\n${error.message}`
    throw error
  }

  // eslint-disable-next-line no-console
  console.log(`test "${title}" passed`)
}

const assert = (a, b, message = '') => {
  if (a !== b) {
    throw new Error(`${message}${a} !== ${b}`)
  }
}

// eslint-disable-next-line no-unused-vars
const script = (src, async, parent) => {
  const s = document.createElement('script')
  s.src = src
  if (async) {
    s.async = true
  }

  document[parent].appendChild(s)
}

// eslint-disable-next-line no-unused-vars
const test_script = (js, variable, value, existed, {
  suffix = '',
  wait = true,
  parent,
  loaded: is_loaded = existed
} = {}) => {
  const tester = typeof js === 'string'
    ? `${js}.js`
    : js

  let title = typeof tester === 'string'
    ? tester
    : `${typeof tester} tester`

  if (suffix) {
    title += `, ${suffix}`
  }

  title += parent === document
    ? ', parent: document'
    : parent
      ? `, parent: ${parent}`
      : ', parent: undefined'

  const args = parent
    ? [{parent}]
    : []

  return test(title, async () => {
    assert(exists(tester, ...args), existed, 'exists: ')

    assert(
      host[variable],
      is_loaded
        ? value
        : undefined
    )

    if (!wait) {
      return
    }

    const timeout = setTimeout(() => {
      throw new Error(`${title}: loaded() not resolved within 3s`)
    }, 3000)

    await loaded(tester, ...args)

    clearTimeout(timeout)
    assert(host[variable], value, 'loaded: ')
  })
}

// eslint-disable-next-line no-unused-vars
const throws = async (fn, message = '', label = message) => {
  try {
    await fn()
  } catch (error) {
    if (!message) {
      return
    }

    assert(
      error.message.includes(message),
      true,
      `error message does not match: ${label}`
    )
    return
  }

  throw new Error(`${label}should throw`)
}
