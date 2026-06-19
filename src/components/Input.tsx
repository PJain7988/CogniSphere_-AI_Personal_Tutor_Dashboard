import React from 'react'
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function InputComp(props, ref) {
    return <input ref={ref} {...props} className={`input ${props.className||''}`} />
  }
)
