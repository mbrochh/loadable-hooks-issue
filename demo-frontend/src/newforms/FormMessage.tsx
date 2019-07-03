import React, { useContext } from 'react'

import { FormContext } from './Form'

interface Props {
  showSuccess: boolean
  successMsg: string
  errorMsg: string
}
const FormMessage: React.FC<Props> = ({
  showSuccess = false,
  successMsg,
  errorMsg,
}) => {
  const errorMessage = !!errorMsg ? errorMsg : 'Please correct the errors above'
  const successMessage = !!successMsg ? successMsg : 'Update Successful'
  const formContext = useContext(FormContext)
  if (formContext === null) {
    return null
  }
  const hasFormErrors =
    !!formContext.errors && Object.keys(formContext.errors).length > 0
      ? true
      : false
  return (
    <div>
      {!!hasFormErrors && <p>{errorMessage}</p>}
      {!hasFormErrors && showSuccess && <p>{successMessage}</p>}
    </div>
  )
}
export default FormMessage
