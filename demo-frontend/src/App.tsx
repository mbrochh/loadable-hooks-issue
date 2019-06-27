import React, { useState } from 'react'
import { Route, Switch } from 'react-router-dom'
import loadable from '@loadable/component'
import { ThemeProvider } from 'emotion-theming'

import theme from './theme'

import NavigationMain from './NavigationMain'

const View2 = loadable(() => import('./View2'))
const Home = loadable(() => import('./Home'))
const ContactRequestView = loadable(() => import('./ContactRequestView'))
const ContactRequestCreateView = loadable(() =>
  import('./ContactRequestCreateView')
)

const App = () => (
  <ThemeProvider theme={theme}>
    <div>
      <Route path="/" component={NavigationMain} />
      <Switch>
        <Route exact={true} path="/" component={Home} />
        <Route exact={true} path="/view2" component={View2} />
        <Route
          exact={true}
          path="/view2/:contactRequestId"
          component={ContactRequestView}
        />
        <Route
          exact={true}
          path="/create"
          component={ContactRequestCreateView}
        />
      </Switch>
    </div>
  </ThemeProvider>
)

export default App
