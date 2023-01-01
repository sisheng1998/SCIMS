import React from 'react'

const SubjectField = ({ subject, setSubject }) => {
  return (
    <div>
      <label htmlFor='subject' className='required-input-label'>
        Subject
      </label>
      <input
        id='subject'
        className='w-full'
        type='text'
        placeholder='Enter subject line'
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        required
      />
      <p className='mt-2 text-xs text-gray-400'>
        Please provide a short and concise subject line.
      </p>
    </div>
  )
}

export default SubjectField
