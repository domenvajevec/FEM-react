import Router from './router'
import styles from './styles/main.styl'
import app from 'ampersand-app'
import Me from './models/me'
import icons from 'octicons/octicons/octicons.css'

window.app = app

app.extend({
  init() {
    this.me = new Me()
    this.me.fetchInitialData()
    this.router = new Router()
    this.router.history.start()
  }
});

app.init()
