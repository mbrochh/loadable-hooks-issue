import React, { useState } from 'react'
import { Route, Switch } from 'react-router-dom'
import Home from './Home'
import './App.css'

import View2 from './View2'
import NavigationMain from './NavigationMain'

function Foo() {
  const [isLoaded, setIsLoaded] = useState(false)
  return <div>Foo: {`${isLoaded}`}</div>
}

const App = () => (
  <div>
    <Route path="/" component={NavigationMain} />
    <Switch>
      <Route exact={true} path="/" component={Home} />
      <Route exact={true} path="/view2" component={View2} />
    </Switch>
    <Foo />
  </div>
)

export default App
