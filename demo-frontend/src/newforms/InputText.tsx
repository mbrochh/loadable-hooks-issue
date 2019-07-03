/** @jsx jsx */
import { jsx } from '@emotion/core'
import React, { useContext, useEffect, useState } from 'react'
import styled from '@emotion/styled'
import get from 'lodash/get'

import { FormContext } from './Form'
import InputLabel from './InputLabel'
import FormError from './FormError'

interface InputProps {
  disabled?: boolean
}

const Input = styled.input<InputProps>(({ theme, disabled }) => ({
  cursor: disabled ? 'not-allowed' : 'text',
  opacity: disabled ? 0.6 : 1,
  width: '100%',
}))
Input.displayName = 'newforms.InputText.Input'

interface Props {
  /** If `true`, this field will be disabled, even if the form as a whole is currently enabled */
  disabled?: boolean
  /** Allows to set an id for the element, otherwise the id will be `id_${name}` */
  id?: string
  /** If `true`, the label will have a `*` at the end */
  isMandatory?: boolean
  /** The label of this input */
  label?: string
  /** The name of this input, must be snake_case */
  name: string
  /** The placeholder text */
  placeholder?: string
  className?: string
  /** Style object to override input styles */
  styles?: { [key: string]: any }
  /** Extra attributes to be passed into the <input> element */
  attrs?: { [key: string]: any }
  /** Value attribute linked to the input for use by controlled components */
  value?: string
}

const InputText: React.FC<Props> = ({
  attrs = {},
  className = '',
  disabled = false,
  id,
  isMandatory = false,
  label,
  name,
  placeholder,
  styles = {},
  value = '',
}) => {
  const formContext = useContext(FormContext)
  if (formContext === null) {
    return null
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const _value = e.target.value
    formContext.setValue(name, _value)
  }

  return (
    <div className={className}>
      <InputLabel label={label} isMandatory={isMandatory} />
      <Input
        id={id ? id : `id_${name}`}
        type="text"
        disabled={formContext.getDisabled(disabled)}
        onChange={e => handleChange(e)}
        placeholder={placeholder}
        value={value || get(formContext.values, name, '')}
        backgroundColor={(styles && styles.backgroundColor) || undefined}
        style={styles}
        {...attrs}
      />
      <FormError name={name} />
    </div>
  )
}
export default InputText
