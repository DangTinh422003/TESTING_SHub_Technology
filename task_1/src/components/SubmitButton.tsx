import React from 'react'

import { Button } from './ui/button'
import { useFormStatus } from 'react-dom'

const SubmitButton = () => {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Loading...' : 'Submit'}
    </Button>
  )
}

export default SubmitButton
