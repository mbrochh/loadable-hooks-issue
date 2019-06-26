import App from './App'
import { BrowserRouter } from 'react-router-dom'
import React from 'react'
import { hydrate } from 'react-dom'
import { loadableReady } from '@loadable/component'

const app = (
  <BrowserRouter>
    <App />
  </BrowserRouter>
)

loadableReady(() => {
  const root = document.getElementById('root')
  hydrate(app, root)
})

if (module.hot) {
  module.hot.accept()
}
