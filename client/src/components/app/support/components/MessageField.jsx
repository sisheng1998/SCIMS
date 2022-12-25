import React from 'react'

const MessageField = ({ placeholder, message, setMessage }) => {
  return (
    <div>
      <label htmlFor='message' className='required-input-label'>
        Message
      </label>
      <textarea
        className='block w-full'
        id='message'
        placeholder={placeholder}
        rows='5'
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
      ></textarea>
    </div>
  )
}

export default MessageField
