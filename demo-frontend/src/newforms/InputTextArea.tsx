import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  FormEvent,
} from 'react'
import styled from '@emotion/styled'
import get from 'lodash/get'

import { FormContext, FormContextInterface } from './Form'
import FormError from './FormError'
import FormMessage from './FormMessage'
import InputLabel from './InputLabel'

const TextArea = styled.textarea<{
  height?: number
  disabled?: boolean
}>(
  ({ theme, height }) => ({
    width: '100%',
    cursor: 'text',
    minWidth: '100%',
    overflowY: 'hidden',
    height: `${height}px`,
  }),
  props =>
    props.disabled && {
      cursor: 'not-allowed',
      opacity: 0.6,
    }
)
TextArea.displayName = 'newforms.InputTextArea.TextArea'

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
  attrs?: object
  styles?: { [key: string]: any }
}
const InputTextArea: React.FC<Props> = ({
  disabled = false,
  isMandatory = false,
  id,
  label,
  placeholder,
  className = '',
  styles = {},
  attrs = {},
  name,
}) => {
  const [height, setHeight] = useState(120)
  const textArea = useRef<HTMLTextAreaElement>(null)

  function handleOnChange(e: FormEvent, fContext: FormContextInterface) {
    e.preventDefault()
    const element = e.target as HTMLInputElement
    fContext.setValue(name, element.value)
  }

  const formContext = useContext(FormContext)
  if (formContext === null) {
    return null
  }

  return (
    <div className={className}>
      <InputLabel label={label} isMandatory={isMandatory} />
      <TextArea
        id={id ? id : `id_${name}`}
        height={height}
        disabled={formContext.getDisabled(disabled)}
        onChange={e => handleOnChange(e, formContext)}
        placeholder={placeholder}
        value={get(formContext.values, name, '')}
        ref={textArea}
        style={styles}
        backgroundColor={(!!styles && styles.backgroundColor) || undefined}
        {...attrs}
      />
      <FormError name={name} />
    </div>
  )
}
export default InputTextArea
