import React, { useEffect } from 'react'

const NAME_REGEX = /^[a-zA-Z,.'-/]+( [a-zA-Z,.'-/]+)*$/
const NAME_REGEX_WITH_NUMBER = /^[a-zA-Z0-9,.'-/]+( [a-zA-Z0-9,.'-/]+)*$/

const NameField = (props) => {
  useEffect(() => {
    const result = props.withNumber
      ? NAME_REGEX_WITH_NUMBER.test(props.value)
      : NAME_REGEX.test(props.value)
    props.setValidated(result && props.value.length > 2)
  }, [props])

  return (
    <div className='mb-6'>
      <input
        className={`w-full ${
          !props.value
            ? ''
            : props.validated
            ? props.showValidated
              ? 'input-valid'
              : ''
            : 'input-invalid'
        }`}
        type='text'
        id={props.id}
        placeholder={props.placeholder}
        required={props.required || false}
        value={props.value}
        onChange={(e) => props.setValue(e.target.value)}
      />

      <p className='mt-2 text-xs text-gray-400'>
        {!props.value || (!props.showValidated && props.validated) ? (
          <span>
            Only alphabets, {props.withNumber ? 'numbers, ' : ''}spaces, and
            symbols {props.withNumber ? "(-/,'.+) " : "(-/,'.) "}are allowed.
          </span>
        ) : props.validated ? (
          <span className='text-green-600'>Looks good!</span>
        ) : (
          <span className='text-red-600'>Please enter a valid name.</span>
        )}
      </p>
    </div>
  )
}

export default NameField
