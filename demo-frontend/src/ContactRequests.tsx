import React from 'react'
import { Link } from 'react-router-dom'

// You need these imports
import { useQuery } from 'react-apollo-hooks'
import gql from 'graphql-tag'

// Then you create a query, ideally the name should be `FilenameQuery`
const query = gql`
  query ContactRequestsQuery {
    contactRequests {
      id
      email
      message
      image
    }
  }
`

// Then you create your component
const ContactRequests = () => {
  // here is how you execute the query with a hook
  const { data, error, loading } = useQuery(query)

  // first you render a loading state
  if (!!loading) {
    return <div>Loading</div>
  }

  // then you render an error state
  if (!!error || !data) {
    return <div>Error</div>
  }

  // then you render the actual component
  return (
    <div>
      ContactRequests:
      <div>
        {/* Here is how you can map over items... */}
        {data.contactRequests.map(item => (
          // make sure you assign the item.id as a key on the wrapper element
          <div key={item.id}>
            <Link to={`/view2/${item.id}/`}>
              {item.id} - {item.email}
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ContactRequests
