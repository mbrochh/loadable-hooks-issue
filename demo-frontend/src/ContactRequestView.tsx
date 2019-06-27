import React from 'react'
import { Link } from 'react-router-dom'
import get from 'lodash/get'

// You need these imports
import { useQuery } from 'react-apollo-hooks'
import gql from 'graphql-tag'

// Then you create a query, ideally the name should be `FilenameQuery`
const query = gql`
  query ContactRequestQuery($contactRequestId: String) {
    contactRequest(contactRequestId: $contactRequestId) {
      id
      email
      message
      image
    }
  }
`

// Then you create your component
const ContactRequest = ({ match }) => {
  // here is how you get the item ID from the route param
  const variables = {
    contactRequestId: get(match, 'params.contactRequestId'),
  }
  // here is how you execute the query with variables with a hook
  const { data, error, loading } = useQuery(query, { variables })

  // first you render a loading state
  if (!!loading) {
    return <div>Loading</div>
  }

  // then you render an error state
  if (!!error || !data || !data.contactRequest) {
    return <div>Error</div>
  }

  // then you render the actual component
  return (
    <div>
      ContactRequest:
      <div>{data.contactRequest.email}</div>
      <div>{data.contactRequest.message}</div>
      <Link to="/view2">Back</Link>
    </div>
  )
}

export default ContactRequest
