import React from 'react'
import app from 'ampersand-app'
import Router from 'ampersand-router'
import PublicPage from './pages/public'
import ReposPage from './pages/repos'
import RepoDetail from './pages/repo-detail'
import Layout from './layout'
import qs from 'qs'
import secrets from '../secrets'
import xhr from 'xhr'

export default Router.extend({
  renderPage(page, opts = {layout: true}) {
    if (opts.layout) {
      page = (<Layout me={app.me}>{page}</Layout>)
    }
    React.render(page, document.body)
  },

  routes: {
    '': 'public',
    repos: 'repos',
    login: 'login',
    logout: 'logout',
    'repo/:owner/:name' : 'repoDetail',
    'auth/callback?:query': 'authCallback'
  },

  public() {
    this.renderPage(<PublicPage />, {layout: false})

  },

  repos() {
    this.renderPage (<ReposPage repos={app.me.repos}/>)
  },

  repoDetail(owner, name) {
    const model = app.me.repos.getByFullName(owner + '/' + name)
    this.renderPage (<RepoDetail repo={model} />)
  },

  login() {
    window.location = 'https://github.com/login/oauth/authorize?' + qs.stringify({
      client_id: secrets.client_demo,
      redirect_uri: window.location.origin + '/auth/callback',
      scope: 'user, repo'
    })
  },

  logout() {
    window.localStorage.clear()
    window.location = '/'
  },

  authCallback(query) {
    query = qs.parse(query);
    xhr({
      url: 'https://labelr-localhost.herokuapp.com/authenticate/' + query.code,
      json: true
      }, (err, rq, body) => {
        app.me.token = body.token
        this.redirectTo('/repos')
    })
  }
})
