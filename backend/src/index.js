const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')
const fs = require('fs')

const requests = require('./requests')
const scraper = require('./scraper')
const projectSettings = require('../../project-settings')

const urlencodedParser = bodyParser.urlencoded({ extended: false })

const app = express()
app.use(cors())
process.setMaxListeners(0)
scraper.startTracking()


app.get('/', function (req, res) {
  res.header('Content-Type', 'application/json')
  res.send(JSON.stringify(requests, null, 4))
})

app.post('/add', urlencodedParser, function (req, res) {
  fs.readFile('src/requests.json', 'utf8', function readFileCallback(err, data){
    if (err) {
      console.log(err)
    }
    else {
      obj = JSON.parse(data)
      obj.push({
        'url' : req.body.url,
        'price' : parseFloat(req.body.price).toFixed(2),
        'email' : req.body.email
      })
      json = JSON.stringify(obj, null, '\t')
      fs.writeFile('src/requests.json', json, 'utf8', function(err) {
        if (err) {
          console.log(err)
        }
        else {
          console.log('JSON saved to src/requests.json')
        }
      })
    }
  })
  res.redirect('back')
})

app.post('/delete', urlencodedParser, function (req, res) {
  fs.readFile('src/requests.json', 'utf8', function readFileCallback(err, data){
    if(err) {
      console.log(err)
    }
    else {
      obj = JSON.parse(data)
      if (req.body.index > -1) {
        obj.splice(req.body.index, 1)
      }
      json = JSON.stringify(obj, null, '\t')
      fs.writeFile('src/requests.json', json, 'utf8', function(err) {
        if (err) {
          console.log(err)
        } 
        else {
          console.log('JSON saved to src/requests.json')
        }
      })
    }
  })
  res.redirect('back')
})

app.listen(projectSettings.port, '0.0.0.0', () => {
  console.log('Example app listening at http://' + projectSettings.ip + ':' + projectSettings.port)
})