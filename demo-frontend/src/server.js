import App from './App'
import React from 'react'
import { StaticRouter } from 'react-router-dom'
import express from 'express'
import { renderToString } from 'react-dom/server'

// =============================================================================
// Step 1: Insert these Apollo related imports here
// =============================================================================
import { ApolloClient } from 'apollo-client'
import { ApolloLink } from 'apollo-link'
import { ApolloProvider, getDataFromTree } from 'react-apollo'
import {
  ApolloProvider as ApolloProviderHooks,
  getMarkupFromTree,
} from 'react-apollo-hooks'
import { BatchHttpLink } from 'apollo-link-batch-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { setContext } from 'apollo-link-context'
import fetch from 'node-fetch'
import setCookie from 'set-cookie-parser'

import { createHttpLink } from 'apollo-link-http'

import { ChunkExtractor, ChunkExtractorManager } from '@loadable/server'
import path from 'path'

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST)

const server = express()
server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get('/*', (req, res) => {
    // =============================================================================
    // Step 2: Initialize Apollo
    // =============================================================================
    // Step 2.0: Create `clientPath` variable... will be used in middlewareLink
    let clientPath = req.url

    // Step 2.1: Create a batchLink
    const batchLink = new BatchHttpLink({
      uri: process.env.RAZZLE_SERVER_GQL_URL,
      fetch: fetch,
    })

    // Step 2.2: Create a middlewareLink
    const middlewareLink = setContext(() => {
      return {
        headers: {
          // we forward the clientPath to Django, because otherwise all
          // GQL calls during SSR seemingly will come from localhost from this
          // Express instance, but we want the resolvers to know what was the
          // actual URL that the user browsed on
          clientpath: clientPath,
          cookie: req.headers.cookie,
        },
      }
    })

    // Step 2.3: Create an afterwareLink
    // IMPORTANT: Note this `apolloRespCookies` variable here...
    let apolloRespCookies = []
    const afterwareLink = new ApolloLink((operation, forward) => {
      return forward(operation).map(response => {
        const {
          response: { headers },
        } = operation.getContext()
        if (headers) {
          const setCookieHeader = headers.get('set-cookie')
          if (setCookieHeader) {
            // IMPORTANT: ...we are setting this variable asynchronously inside
            // this function here, basically after every GQL request, since
            // this is an afterware. This means, if the Django server added
            // any set-cookies, we keep track of those. Further down, we will
            // make sure that these cookies get forwarded to the user's
            // browser when we return the final response...
            apolloRespCookies = setCookie.parse(setCookieHeader)
          }
        }
        return response
      })
    })

    // Step 2.4: Combine all links into one link object
    const link = afterwareLink.concat(middlewareLink).concat(batchLink)

    // Step 2.5: Instantiate the ApolloClient object
    const client = new ApolloClient({
      cache: new InMemoryCache(),
      link: link,
      queryDeduplication: true,
      ssrMode: true,
    })

    const context = {}
    const statsFile = path.resolve('./build/public/loadable-stats.json')
    const extractor = new ChunkExtractor({
      statsFile,
      entrypoints: ['client'],
    })
    // =========================================================================
    // Step 3: Add `<ApolloProvider>` and `<ApolloProviderHook>
    // =========================================================================
    const app = (
      <ChunkExtractorManager extractor={extractor}>
        <ApolloProvider client={client}>
          <ApolloProviderHooks client={client}>
            <StaticRouter context={context} location={req.url}>
              <App />
            </StaticRouter>
          </ApolloProviderHooks>
        </ApolloProvider>
      </ChunkExtractorManager>
    )
    // =========================================================================
    // Step 4: Add `getDataFromTree(app)`
    // =========================================================================
    getDataFromTree(app)
      .then(async () => {
        if (context.url) {
          status_code = !!context.statusCode ? context.statusCode : 302
          res.redirect(status_code, context.url)
        } else {
          // ===================================================================
          // Step 5: The stuff that was at this place before, gets moved into
          // this `else`-clause here
          // ===================================================================
          const markup = await getMarkupFromTree({
            renderFunction: renderToString,
            tree: app,
          })
          const scriptTags = extractor.getScriptTags()
          // ===================================================================
          // Step 6: Create this new `apolloState` variable
          // ===================================================================
          const apolloState = JSON.stringify(client.cache.extract())
          // ===================================================================
          // Step 7: At this point, all GQL requests have been made and we can
          // iterate over the apolloRespCookies list and attach them to the
          // res (Response) object that we are about to return to the user's
          // browser
          // ===================================================================
          apolloRespCookies.forEach(cookie => {
            res.cookie(cookie.name, cookie.value, cookie)
          })

          res.status(200).send(
            `<!doctype html>
              <html lang="">
              <head>
                  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                  <meta charset="utf-8" />
                  <title>Welcome to Razzle</title>
                  <meta name="viewport" content="width=device-width, initial-scale=1">
                  ${
                    assets.client.css
                      ? `<link rel="stylesheet" href="${assets.client.css}">`
                      : ''
                  }
              </head>
              <body>
                  <div id="root">${markup}</div>
                  <! -- ==================================================== -->
                  <! -- Step 8: Add APOLLO_STATE here -->
                  <! -- ==================================================== -->
                  <script type="application/javascript">window.__APOLLO_STATE__ = ${apolloState};</script>
                  ${scriptTags}
              </body>
          </html>`
          )
        }
      })
      .catch(err => {
        // =====================================================================
        // Step 9: Since `getDataFromTree` is a Promise, we can add error
        // handling here.
        // =====================================================================
        console.log('ERROR: ', err)
      })
  })

export default server
