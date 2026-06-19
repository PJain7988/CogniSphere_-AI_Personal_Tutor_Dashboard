import React from 'react'
import { clsx } from 'clsx'
type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'outline' }
export function Button({ variant='primary', className, ...props }: Props) {
  return <button {...props} className={clsx('btn', variant==='primary' ? 'btn-primary' : 'btn-outline', className)} />
}
