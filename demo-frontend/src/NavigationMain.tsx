import React from 'react'
import { Link } from 'react-router-dom'

const NavigationMain = () => {
  return (
    <div>
      <Link to="/">Home</Link> | <Link to="/view2">View2</Link> |{' '}
      <Link to="/create">Create</Link>
    </div>
  )
}

export default NavigationMain
