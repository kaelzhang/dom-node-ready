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

const puppeteer = require('puppeteer')
const chalk = require('chalk')

const {
  listen,
  close
} = require('./server')

// eslint-disable-next-line no-console
const log = (...args) => console.log(...args)

const run = async () => {
  await listen(PORT)

  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  await page.coverage.startJSCoverage()

  await page.goto(`http://localhost:${PORT}/index.html`)

  // Retrive the coverage objects
  const coverage = await page.coverage.stopJSCoverage()

  await browser.close()
  await close()

  for (const {url, ranges, text} of coverage) {
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

    log(url, 'coverage:', `${parseInt(used / text.length * 10000, 10) / 100}%:`)
    log(result)
  }
}

run()
