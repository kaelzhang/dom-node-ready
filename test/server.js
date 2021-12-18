const {
  createServer
} = require('http')

const {
  parse
} = require('url')

const {createReadStream} = require('fs')

const {
  join
} = require('path')

const delay = require('delay')

const create_stream = (...files) => {
  const filepath = join(__dirname, ...files)
  return createReadStream(filepath)
}

const server = createServer((req, res) => {
  const {url} = req
  const parsed = parse(url, true)

  const {
    pathname
  } = parsed

  if (pathname === '/index.html' || pathname === '/') {
    create_stream('index.html').pipe(res)
    return
  }

  if (pathname === '/spec.js') {
    create_stream('spec.js').pipe(res)
    return
  }

  if (pathname === '/ready.js') {
    create_stream('..', 'src', 'index.js').pipe(res)
    return
  }

  if (pathname === '/favicon.ico') {
    res.writeHead(204)
    res.end()
    return
  }

  const {
    variable,
    value,
    delay: d = '200'
  } = parsed.query

  delay(Number(d)).then(() => {
    res.writeHead(200, {
      'Cache-Control': 'no-cache,must-revalidate'
    })
    res.write(`
console.log("${url}")
host.${variable} = ${value}
`)
    res.end()
  })
})

module.exports = {
  listen (port) {
    return new Promise(resolve => {
      server.listen(port, resolve)
    })
  },

  close () {
    return new Promise(resolve => {
      server.close(resolve)
    })
  }
}

// module.exports.listen(8889)
