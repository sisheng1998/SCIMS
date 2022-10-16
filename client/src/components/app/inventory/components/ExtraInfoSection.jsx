import React, { useState, useEffect } from 'react'
import NameField from '../../../validations/NameField'

const ExtraInfoSection = ({ chemical, setChemicalData, setValidated }) => {
  const [supplier, setSupplier] = useState(chemical ? chemical.supplier : '')
  const [brand, setBrand] = useState(chemical ? chemical.brand : '')
  const [notes, setNotes] = useState(chemical ? chemical.notes : '')

  const [supplierValidated, setSupplierValidated] = useState(false)
  const [brandValidated, setBrandValidated] = useState(false)

  useEffect(() => {
    setChemicalData((prev) => {
      return {
        ...prev,
        supplier,
        brand,
        notes,
      }
    })

    setValidated((prev) => {
      return {
        ...prev,
        supplierValidated: supplier ? supplierValidated : true,
        brandValidated: brand ? brandValidated : true,
      }
    })
  }, [
    supplier,
    brand,
    notes,
    supplierValidated,
    brandValidated,
    setChemicalData,
    setValidated,
  ])

  return (
    <>
      <div className='flex space-x-6'>
        <div className='w-1/2'>
          <label htmlFor='supplier'>Supplier Name</label>
          <NameField
            id='supplier'
            placeholder='Enter supplier name'
            required={false}
            value={supplier}
            setValue={setSupplier}
            validated={supplierValidated}
            setValidated={setSupplierValidated}
            withNumber={true}
            showValidated={chemical ? false : true}
          />
        </div>

        <div className='w-1/2'>
          <label htmlFor='brand'>Brand Name</label>
          <NameField
            id='brand'
            placeholder='Enter brand name'
            required={false}
            value={brand}
            setValue={setBrand}
            validated={brandValidated}
            setValidated={setBrandValidated}
            withNumber={true}
            showValidated={chemical ? false : true}
          />
        </div>
      </div>

      <label htmlFor='notes'>Notes</label>
      <textarea
        className='block w-full'
        name='notes'
        id='notes'
        placeholder='Notes for the chemical'
        rows='5'
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      ></textarea>
    </>
  )
}

export default ExtraInfoSection
