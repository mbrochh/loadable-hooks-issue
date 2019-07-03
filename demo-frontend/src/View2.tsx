/** @jsx jsx */
import { jsx } from '@emotion/core'
import styled from '@emotion/styled'

import ContactRequests from './ContactRequests'

const Green = styled.div(
  ({ theme }) => ({
    color: theme.colorPrimary,
  }),
  props =>
    props.disabled && {
      opacity: 0.5,
    }
)

const View2 = () => {
  return (
    <div css={{ color: 'red' }}>
      View2
      <Green>Green</Green>
      <Green disabled={true}>Green</Green>
      <hr />
      <ContactRequests />
    </div>
  )
}

export default View2
