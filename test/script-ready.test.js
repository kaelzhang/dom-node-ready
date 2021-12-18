// const test = require('ava')
// // const log = require('util').debuglog('script-ready')
// const {
//   is,
//   when
// } = require('../src')

// test('description', t => {
//   t.is(true, true)
// })

const PORT = 8889
const LOG = 'log'

const puppeteer = require('puppeteer')
const chalk = require('chalk')
const delay = require('delay')

const {
  listen,
  close
} = require('./server')

// eslint-disable-next-line no-console
const log = (type, ...args) => console[type](...args)

const run = async () => {
  await listen(PORT)

  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  const logs = []

  let has_error = false

  page
  .on('console', message => {
    logs.push({
      type: message.type(),
      text: message.text()
    })
  })
  .on('pageerror', ({message}) => {
    has_error = true

    logs.push({
      type: 'error',
      text: chalk.red(message)
    })
  })

  await page.coverage.startJSCoverage()

  await page.goto(`http://localhost:${PORT}/index.html`)

  // Retrive the coverage objects
  const coverage = await page.coverage.stopJSCoverage()

  await delay(5000)
  await browser.close()
  await close()

  log(LOG, chalk.bold('Test outputs:'))

  if (logs.length) {
    for (const {type, text} of logs) {
      log(type, text)
    }
  } else {
    log(LOG, chalk.gray('no outputs'))
  }

  if (has_error) {
    return
  }

  for (const {url, ranges, text} of coverage) {
    if (!/ready\.js/.test(url)) {
      continue
    }

    let used = 0
    let result = ''

    let last = 0

    for (const {start, end} of ranges) {
      used += end - start - 1

      const uncovered = text.slice(last, start)

      if (uncovered) {
        result += chalk.red(uncovered)
      }

      const covered = text.slice(start, end)

      if (covered) {
        result += chalk.green(covered)
      }

      last = end
    }

    const cov = used / text.trim().length

    log(LOG, chalk.bold('\nCoverage:'))

    log(
      LOG,
      url,
      'coverage:', `${parseInt(cov * 10000, 10) / 100}%`
    )

    if (cov === 1) {
      return
    }

    log(LOG, result)
  }
}

run()

// listen(PORT)
