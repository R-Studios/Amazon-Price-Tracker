const CronJob = require('cron').CronJob
const fs = require('fs')
const puppeteer = require('puppeteer')
const nodemailer = require('nodemailer')
const $ = require('cheerio')

const requests = require('./requests')
const projectSettings = require('../../project-settings')


module.exports = {

  configureBrowser: async function(url) {
    // Launch puppeteer
    let browser = undefined
    if (process.platform === 'linux') { // Make sure chromium is installed globally
      browser = await puppeteer.launch({product: 'chrome', executablePath: '/usr/bin/chromium-browser'})
    } else {
      browser = await puppeteer.launch()
    }
    // Navigate to url
    let page = await browser.newPage()
    page.setDefaultNavigationTimeout(0)
    await page.setUserAgent(projectSettings.userAgent)
    await page.goto(url)
    return page
  },

  getProductData: async function(index, page) {

    await page.reload()
    let html = await page.evaluate(() => document.body.innerHTML)

    requests[index].lastUpdate = new Date()

    // Fetch title
    $('#productTitle', html).each(function() {
      requests[index].title = $(this).text().trim()
    })

    let regex = /[+-]?\d+(\.\d+)?/g
    // Fetch price
    $('#priceblock_ourprice', html).each(function() {
      requests[index].currentPrice = $(this).text().replace(',', '.').match(regex).map(function(v) { return parseFloat(v).toFixed(2) })[0]
    })
    $('#priceblock_dealprice', html).each(function() {
      requests[index].currentPrice = $(this).text().replace(',', '.').match(regex).map(function(v) { return parseFloat(v).toFixed(2) })[0]
    })

    // Set lowest price
    if (requests[index].currentPrice < requests[index].lowestPrice || !requests[index].hasOwnProperty('lowestPrice')) {
      requests[index].lowestPrice = requests[index].currentPrice
    }

    // Update backend 
    if (requests[index].currentPrice <= requests[index].price) {
      // Remove request and send notification 
      try {
        await this.sendNotification(index, requests[index].currentPrice)
      } catch(err) {
        this.log(err)
      }
      requests.splice(index, 1)
    }
  },

  startTracking: async function() {
    
    const job = new CronJob('0 */60 * * * *', async function() {

      this.log('Every sixtieth Minute:')
      this.log(new Date())

      // Loop through all products and update product data
      for (let i = 0; i < requests.length; i++) {
        let page = await this.configureBrowser(requests[i].url)
        await this.getProductData(i, page)
      }
      
      fs.readFile('src/requests.json', 'utf8', function(err) {
        if (err) {
          this.log(err)
        }
        else {
          fs.writeFile('src/requests.json', JSON.stringify(requests, null, '\t'), 'utf8', function(err) {
            if (err) {
              this.log(err)
            } 
            else {
              this.log('JSON saved to src/requests.json')
            }
          })
        }
      })

    })

    job.start()

  },

  sendNotification: async function(index, price) {

    // Gmail and app password
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: projectSettings.gmail,
        pass: projectSettings.appPassword
      }
    })

    // Extract first name from the email address
    let fullName = requests[index].email.split('@')[0].split('.')
    let firstName = fullName[0].charAt(0).toUpperCase() + fullName[0].slice(1)

    // Email text
    let htmlText = `
    <h1>Product available for desired price</h1>
    Hi ` + firstName + `,<br><br>
    the product "` + requests[index].title + `" from your wish list<br>
    is now available for ` + requests[index].price + projectSettings.currency + `!<br><br>
    Save ` + (requests[index].price - price).toFixed(2) + projectSettings.currency + ` if you buy the product for ` + price + projectSettings.currency + `!<br><br>
    Your product is available here: <a href="` + requests[index].url + `">Link</a><br><br>
    Have a nice day!</p>`

    // Send email with nodemailer
    let info = await transporter.sendMail({
      from: projectSettings.gmail,
      to: requests[index].email,
      subject: 'Product ' + requests[index].title + ' available for desired price!',
      html: htmlText
    })

    this.log('Message sent:')
    this.log(info.messageId)
  },

  log: function(message) {
    fs.appendFile('../log/log.txt', '[' + new Date().toLocaleTimeString('de-de') + '] - ' + JSON.stringify(message) + '\n', function (err) {
      if (err) throw err
      console.log('Saved!')
    })
  }
}