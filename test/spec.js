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

const assert = (a, b) => {
  if (a !== b) {
    throw new Error(`${a} !== ${b}`)
  }
}

const script = (src, async, parent) => {
  const s = document.createElement('script')
  s.src = src
  if (async) {
    s.async = true
  }

  document[parent].appendChild(s)
}

test('01.js', async () => {
  assert(is('01.js'), false)
  assert(host.a, undefined)
  await when('01.js')
  assert(host.a, 1)
})
