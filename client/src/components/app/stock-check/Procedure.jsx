import React from 'react'

const Procedure = ({ showFirstStep }) => {
  return (
    <ol className='ml-4 list-decimal space-y-1.5 text-sm'>
      {showFirstStep && (
        <li>
          To start the stock check process, kindly press the button below.
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
      <li>Repeat Step 2 ~ 4 to add more records.</li>
      <li>
        Press the "Complete" button under Stock Check Action to complete the
        stock check process.
      </li>
      <li>
        The generated stock check report will be shown under Reports (desktop
        version).
      </li>
    </ol>
  )
}

export default Procedure
