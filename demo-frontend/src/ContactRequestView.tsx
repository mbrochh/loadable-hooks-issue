import React from 'react'
import { Link } from 'react-router-dom'
import get from 'lodash/get'

import { useQuery } from 'react-apollo-hooks'
import gql from 'graphql-tag'

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

// we add an export here, so that Docz can import this "dumb" version of
// this component
export const ContactRequest = ({ gqlData, match }) => {
  // we can easily fake this data when we want to hook up this component in
  // Docz. For example if we wanted to test the loading state we could do:
  // <ContactRequest gqlData={{loading: true}} />
  const { data, error, loading } = gqlData

  if (!!loading) {
    return <div>Loading</div>
  }

  if (!!error || !data || !data.contactRequest) {
    return <div>Error</div>
  }

  return (
    <div>
      ContactRequest:
      <div>{data.contactRequest.email}</div>
      <div>{data.contactRequest.message}</div>
      <Link to="/view2">Back</Link>
    </div>
  )
}

// we add this new "smart" version of the component that deals with the
// GQL stuff
const ContactRequestGQL = props => {
  const variables = {
    contactRequestId: get(props.match, 'params.contactRequestId'),
  }
  const gqlData = useQuery(query, { variables })
  return (
    <div>
      <ContactRequest gqlData={gqlData} {...props} />
      <hr />
      {/* Here is an example how we can mount the "dumb" version anywhere we like.
          This way we can mount all kinds of variations of the "dumb" component
          and see how they render at one glance in Docz.
       */}
      <ContactRequest gqlData={{ loading: true }} {...props} />
    </div>
  )
}

// our default export should be the "smart" version of this component
export default ContactRequestGQL
