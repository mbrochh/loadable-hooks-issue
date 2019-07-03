import React, { useContext } from 'react'
import styled from '@emotion/styled'
import get from 'lodash/get'

import { FormContext } from './Form'

const Div = styled.div(props => ({
  color: props.theme.colorDanger,
  fontFamily: props.theme.fontPrimary,
  fontSize: props.theme.fontSizePSmall,
}))

interface Props {
  name: string
  errors?: string[]
  className?: string
}
const FormError: React.FC<Props> = ({
  name = '',
  errors = null,
  className = '',
}) => {
  const formContext = useContext(FormContext)
  if (formContext === null) {
    return null
  }
  const errorsFromContext = get(formContext, `errors.${name}`)
  const formErrors = errors ? errors : errorsFromContext
  if (!formErrors || formErrors.length === 0) {
    return null
  }
  return (
    <Div className={className} id={`id_${name}_error`}>
      {formErrors[0].message}
    </Div>
  )
}
export default FormError
