import React from 'react'
import { Input } from './Input'
import { Button } from './Button'

export function ChatInput({onSend}:{onSend:(text:string)=>void}){
  const [value, setValue] = React.useState('')
  function handleSend(){
    if(value.trim().length===0) return
    onSend(value.trim())
    setValue('')
  }
  return (
    <div className="flex gap-2">
      <Input
        aria-label="Chat message"
        placeholder="Ask your AI tutor..."
        value={value}
        onChange={e=>setValue(e.target.value)}
        onKeyDown={(e)=>{ if(e.key==='Enter'){ handleSend() } }}
      />
      <Button onClick={handleSend} aria-label="Send message">Send</Button>
    </div>
  )
}
