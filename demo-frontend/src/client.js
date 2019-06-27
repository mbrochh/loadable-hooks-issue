import App from './App'
import { BrowserRouter } from 'react-router-dom'
import React from 'react'
import { hydrate } from 'react-dom'
import { loadableReady } from '@loadable/component'

// =============================================================================
// Step 1: Add Apoolo related imports
// =============================================================================
import { ApolloClient } from 'apollo-client'
import { ApolloProvider } from 'react-apollo'
import { ApolloProvider as ApolloProviderHooks } from 'react-apollo-hooks'
import { BatchHttpLink } from 'apollo-link-batch-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { onError } from 'apollo-link-error'
import { setContext } from 'apollo-link-context'

// =============================================================================
// Step 2: Just like in server.js, initialize the client
// =============================================================================
// Step 2.1: Create a batchLink
const batchLink = new BatchHttpLink({
  uri: process.env.RAZZLE_CLIENT_GQL_URL,
  fetch: fetch,
})

// Step 2.2: Create a middlewareLink
const middlewareLink = setContext(() => {
  return {
    credentials: 'include',
    headers: {
      clientpath: `${window.location.pathname}${window.location.search}`,
    },
  }
})

// Step 2.3: Create an errorLink
const errorLink = onError(({ networkError = {}, graphQLErrors }) => {
  if (networkError) {
    console.log('Network Error:')
    console.log(networkError)
  }
  if (graphQLErrors) {
    graphQLErrors.forEach(gqlError => {
      console.log('GraphQL Errors:')
      console.log(gqlError)
    })
  }
})

// Step 2.4: Combine all the links into one link object
const link = errorLink.concat(middlewareLink).concat(batchLink)

// Step 2.5: Create the ApolloClient object
const client = new ApolloClient({
  cache: new InMemoryCache().restore(window.__APOLLO_STATE__),
  link: link,
  queryDeduplication: true,
  ssrForceFetchDelay: 100,
})

// =============================================================================
// Step 3: Add <ApolloProvider> and <ApolloProviderHooks>
// =============================================================================
hydrate(
  <ApolloProvider client={client}>
    <ApolloProviderHooks client={client}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ApolloProviderHooks>
  </ApolloProvider>,
  document.getElementById('root')
)

loadableReady(() => {
  const root = document.getElementById('root')
  hydrate(app, root)
})

if (module.hot) {
  module.hot.accept()
}
