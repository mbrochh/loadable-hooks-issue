import React from 'react'

import ContactRequestCreateForm from './forms/ContactRequestCreateForm'

export const ContactRequestCreateView = ({ history }) => {
  function onSuccess(data) {
    history.push(`/view2/${data.createContactRequest.contactRequest.id}`)
  }

  return (
    <div>
      <h1>Create View</h1>
      <ContactRequestCreateForm onSuccess={data => onSuccess(data)} />
    </div>
  )
}

export default ContactRequestCreateView
