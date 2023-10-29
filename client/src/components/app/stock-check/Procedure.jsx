import React from 'react'
import useAuth from '../../../hooks/useAuth'
import ROLES_LIST from '../../../config/roles_list'

const Procedure = ({ showFirstStep, isHavingActiveStockCheck }) => {
  const { auth } = useAuth()
  const isPostgraduate = auth.currentRole === ROLES_LIST.postgraduate

  return (
    <ol className='ml-4 list-decimal space-y-1.5 text-sm'>
      {showFirstStep && (
        <li>
          Press the "
          {isPostgraduate || isHavingActiveStockCheck ? 'Join' : 'Start'} Stock
          Check" button to{' '}
          {isPostgraduate || isHavingActiveStockCheck ? 'join' : 'start'} the
          stock check process.
        </li>
      )}
      <li>
        Press the button on the bottom right corner to add a new record during
        the process.
      </li>
      <li>
        The QR code scanner will appear, kindly scan the QR code of the
        chemical.
      </li>
      <li>Fill in the remaining amount of the scanned chemical.</li>
      <li>
        Repeat Step {showFirstStep ? '2 ~ 4' : '1 ~ 3'} to add more records.
      </li>
      <li>
        Press the "Complete" button under "My Stock Check Action" to save the
        records.
      </li>
      {isPostgraduate && (
        <li>Wait for the lab owner to end the stock check process.</li>
      )}
      {showFirstStep && !isPostgraduate && (
        <li>
          Press the "Mark as Completed" button to end the stock check process.
        </li>
      )}
      <li>
        The stock check report will be finalized once the process is ended.
      </li>
    </ol>
  )
}

export default Procedure
