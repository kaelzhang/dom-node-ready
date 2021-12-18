// const {join} = require('path')

const puppeteer = require('puppeteer')

const log = exports.log = (...args) => {
  // eslint-disable-next-line no-console
  console.log(...args)
}

exports.create_page = async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36')

  page.on('response', async response => {
    const status = response.status()

    if (status !== 200 && status !== 206) {
      log('response', status, response.url())

      try {
        log('response json', await response.json())
      } catch (error) {
        log('response no json')
      }
    }
  })

  return page
}
