import React, { useEffect } from 'react'

import { useMutation } from 'react-apollo-hooks'
import gql from 'graphql-tag'

import get from 'lodash/get'

const mutation = gql`
  mutation ContactRequestCreateViewMutation($email: String, $message: String) {
    createContactRequest(email: $email, message: $message) {
      status
      formErrors
      contactRequest {
        id
      }
    }
  }
`

const ContactRequestCreateView = ({ history }) => {
  const [mutate, { data, loading }] = useMutation(mutation)
  const status = get(data, 'createContactRequest.status')

  useEffect(() => {
    if (status === 200) {
      history.push(`/view2/${data.createContactRequest.contactRequest.id}`)
    }
  }, [status])

  return (
    <div>
      <form
        method="post"
        action="."
        onSubmit={e => {
          e.preventDefault()
          const formData = new FormData(e.target)
          mutate({
            variables: {
              email: formData.get('email'),
              message: formData.get('message'),
            },
            refetchQueries: ['ContactRequestsQuery'],
          })
        }}
      >
        <fieldset disabled={loading}>
          <p>
            <input name="email" placeholder="Email" />
          </p>
          <p>
            <textarea name="message" placeholder="Your message..." />
          </p>
          <button>Submit</button>
        </fieldset>
      </form>
      {!!get(data, 'createContactRequest.formErrors') && (
        <div>{data.createContactRequest.formErrors}</div>
      )}
    </div>
  )
}

export default ContactRequestCreateView
