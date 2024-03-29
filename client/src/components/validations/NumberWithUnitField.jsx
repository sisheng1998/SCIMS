import React, { useEffect } from 'react'

const NUMBER_REGEX = /^\d{1,}(\.\d{1,2})?$/

const NumberWithUnitField = (props) => {
  useEffect(() => {
    const result = NUMBER_REGEX.test(props.value)
    if (props.maxValue) {
      props.setValidated(
        result && Number(props.value) <= Number(props.maxValue)
      )
    } else {
      props.setValidated(result)
    }
  }, [props])

  return (
    <>
      <div className='flex items-stretch'>
        <input
          className={`z-[1] w-full rounded-r-none ${
            !props.value
              ? ''
              : props.validated
              ? props.showValidated
                ? 'input-valid'
                : ''
              : 'input-invalid'
          }`}
          type='number'
          min='0.0'
          step='0.01'
          id={props.id}
          placeholder={props.placeholder}
          required={props.required || false}
          value={props.value}
          onChange={(e) => props.setValue(e.target.value)}
          onWheel={(e) => e.target.blur()}
        />
        <p className='flex w-10 flex-shrink-0 items-center justify-center rounded-r-lg border border-l-0 border-gray-300 bg-gray-50 text-gray-500 shadow-sm'>
          {props.unit === '' ? '-' : props.unit}
        </p>
      </div>

      <p className='mt-2 text-xs text-gray-400'>
        {!props.value || (!props.showValidated && props.validated) ? (
          props.message || 'Numbers with maximum 2 decimal places only.'
        ) : props.validated ? (
          <span className='text-green-600'>Looks good!</span>
        ) : (
          <span className='text-red-600'>
            {props.maxValue && Number(props.value) > Number(props.maxValue)
              ? `The amount can't exceed the ${
                  props.usage ? 'current amount' : 'container size'
                }.`
              : 'Please enter numbers with maximum 2 decimal places only.'}
          </span>
        )}
      </p>
    </>
  )
}

export default NumberWithUnitField
