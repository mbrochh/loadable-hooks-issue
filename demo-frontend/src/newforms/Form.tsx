import React, { createContext, useState, useEffect, FormEvent } from 'react'
import styled from '@emotion/styled'

import { toSnakeCase } from '../utils'

export interface FormContextInterface {
  values: object
  errors: object
  setValue: (name: string, value: any, autoSubmit?: boolean) => void
  getDisabled: (disabled: boolean) => boolean
  submit: (e: FormEvent) => void
}

export const FormContext = createContext<FormContextInterface | null>(null)

const Fieldset = styled.fieldset<{ inline: boolean }>(props => ({
  display: props.inline ? 'inline' : 'block',
  border: 'none',
}))

interface Props {
  /** The form errors as a JSON string where each key is a list of strings */
  errors: string
  /** If `true` the entire form will be disabled */
  isDisabled?: boolean
  /** If `true` the entire form will be disabled */
  isPosting: boolean
  /** Submit handler. Takes one parameter "values" */
  onSubmit: (val: { [key: string]: any }) => void
  /** An object where each key corresponds to a form field name. camelCase keys will automagically be converted into snake_case */
  values: object
  styles?: object
  formID?: string
  inline?: boolean
}
const Form: React.FC<Props> = ({
  errors = '{}',
  isDisabled = false,
  isPosting = false,
  onSubmit,
  values,
  styles,
  formID,
  inline = false,
  children,
}) => {
  const [submit, setSubmit] = useState(false)
  const [vals, setVals] = useState(toSnakeCase(values))
  const [isClientSideLoaded, setIsClientSideLoaded] = useState(false)
  useEffect(() => {
    setIsClientSideLoaded(true)
  }, [])

  useEffect(() => {
    // this is for the case when we must load data from Apollo before we can
    // load the form. We want the form to be already visible, but empty and
    // disabled.
    //
    // At first, state.values will be undefined (see constructor), but after
    // data from Apollo comes back, we will set state.values to the data
    // that we have just received.
    //
    // After this, changes to props.values no longer have any effect in this
    // component.
    setVals(toSnakeCase(values))
  }, [!values])

  function getDisabled(isElementDisabled: boolean) {
    // Returns `true` if the entire form should currently be disabled
    return !!isElementDisabled
      ? true
      : vals === undefined
      ? true
      : !isClientSideLoaded
      ? true
      : !!isPosting
      ? true
      : !!isDisabled
  }

  function setValue(name: string, value: any, autoSubmit?: boolean) {
    // Sets a new value for one of the form fields
    const newValues = { ...vals, [name]: value }
    if (!!autoSubmit) {
      setSubmit(autoSubmit)
    }
    setVals(newValues)
  }

  useEffect(() => {
    if (submit) {
      handleSubmit()
      setSubmit(false)
    }
  }, [vals])

  function handleSubmit(e?: FormEvent) {
    if (e) {
      e.preventDefault()
    }
    if (onSubmit) {
      onSubmit(vals)
    }
  }

  // the form is surrounded by a fieldset. We set that to disabled because
  // that makes all fields inside the fieldset disabled by default in all
  // browsers. Additionally, each field will also have access to this
  // `getDisabled()` via the context and will be able to set itself to
  // disabled, too. This is important because otherwise the fields would not
  // get proper disabled styles.
  const fieldsetDisabled = getDisabled(isDisabled)

  return (
    <FormContext.Provider
      key={`${vals}-${isClientSideLoaded}`}
      value={{
        // every field inside the form has access to this context:
        values: vals,
        errors: JSON.parse(errors),
        setValue: (name: string, value: any, autoSubmit?: boolean) =>
          setValue(name, value, autoSubmit),
        getDisabled: (disabled: boolean) => getDisabled(disabled),
        submit: (e: FormEvent) => handleSubmit(e),
      }}
    >
      <form
        onSubmit={e => handleSubmit(e)}
        id={formID}
        style={{ ...styles, display: inline ? 'inline' : 'block' }}
      >
        <Fieldset inline={inline} disabled={fieldsetDisabled}>
          {children}
        </Fieldset>
      </form>
    </FormContext.Provider>
  )
}

export const FormConsumer = FormContext.Consumer

export default Form
