import React from 'react'
import { useFormStatus } from 'react-dom'

import { Button } from './ui/button'

const SubmitButton = () => {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Loading...' : 'Submit'}
    </Button>
  )
}

export default SubmitButton
