import { useId } from 'react'

import { Button } from '@repo/ui/button'
import { Input } from '@repo/ui/input'

export function ChangelogNewsletterForm() {
  let id = useId()

  return (
    <form className='flex flex-col gap-y-4 my-8'>
      <label htmlFor={id} className="sr-only">
        Email address
      </label>
      <Input
        required
        type="email"
        autoComplete="email"
        name="email"
        id={id}
        placeholder="Email address"
        className="w-full"
      />
      <Button type="submit" color='white'>
        Stay in the loop
      </Button>
    </form>
  )
}
