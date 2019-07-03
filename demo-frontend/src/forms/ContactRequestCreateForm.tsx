import React, { useEffect } from 'react'

import { useMutation } from 'react-apollo-hooks'
import gql from 'graphql-tag'
import get from 'lodash/get'

import Form from '../newforms/Form'
import FormMessage from '../newforms/FormMessage'
import InputText from '../newforms/InputText'
import InputTextArea from '../newforms/InputTextArea'

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

export const ContactRequestCreateForm = ({ gqlData, status }) => {
  const [mutate, { data, loading }] = gqlData
  return (
    <Form
      values={}
      errors={get(data, 'createContactRequest.formErrors')}
      onSubmit={values => {
        mutate({
          variables: values,
          refetchQueries: ['ContactRequestsQuery'],
        })
      }}
    >
      <InputText name="email" placeholder="Email" />
      <InputTextArea name="message" placeholder="Your message..." height={20} />
      <FormMessage showSuccess={status === 200} />
      <button>Submit</button>
    </Form>
  )
}

// the "smart" version deals with the GQL logic
const ContactRequestCreateFormGQL = ({ onSuccess }) => {
  const gqlData = useMutation(mutation)

  // note that useMutation returns an Array! The first element is the
  // mutate function, the second element is an object with the usual
  // data, loading, called, hasError keys
  const status = get(gqlData[1], 'data.createContactRequest.status')

  useEffect(() => {
    if (status === 200) {
      if (!!onSuccess) {
        onSuccess(get(gqlData[1], 'data'))
      }
    }
  }, [status])

  // by passing in the entire gqlData Array, we can use it inside the
  // "dumb" component just like an actual `useMutation` hook return value
  return <ContactRequestCreateForm gqlData={gqlData} status={status} />
}

export default ContactRequestCreateFormGQL
