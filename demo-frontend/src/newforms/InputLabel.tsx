import React from 'react'
import styled from '@emotion/styled'

const Label = styled.label<Props>(
  props => ({
    display: 'block',
    margin: '0px',
    '::after': {
      content: props.isMandatory ? "' *'" : "''",
    },
  }),
  props =>
    props.inline && {
      display: 'inline',
      marginRight: '0.25em',
    }
)
Label.displayName = 'newforms.InputLabel.Label'

interface Props {
  inline?: boolean
  isMandatory?: boolean
  label?: string
}

const InputLabel: React.FC<Props> = ({ inline, isMandatory, label }) => {
  if (!label) {
    return null
  }
  return (
    <Label inline={inline} isMandatory={isMandatory}>
      {label}
    </Label>
  )
}
export default InputLabel
