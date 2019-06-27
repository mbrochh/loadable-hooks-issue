/** @jsx jsx */
import { jsx } from '@emotion/core'
import styled from '@emotion/styled'

const Green = styled.div(({ theme }) => ({
  color: theme.colorPrimary,
}))

const View2 = () => {
  return (
    <div css={{ color: 'red' }}>
      View2
      <Green>Green</Green>
    </div>
  )
}

export default View2
