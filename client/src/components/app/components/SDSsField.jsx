import React from 'react'
import PDFDropZone from './PDFDropZone'
import RenderPDF from './RenderPDF'

const SDSsField = ({
  enSDS,
  setEnSDS,
  enExtractionResult,
  setEnExtractionResult,
  bmSDS,
  setBmSDS,
  bmExtractionResult,
  setBmExtractionResult,
  classifications,
  setClassifications,
  setErrorMessage,
  viewOnly = false,
  isEdit = false,
}) => {
  return viewOnly ? (
    <>
      <label htmlFor='SDS' className='mb-1'>
        Safety Data Sheet (SDS)
      </label>
      <div
        className={
          enSDS === 'No SDS' || bmSDS === 'No SDS' ? 'space-y-2' : 'space-y-1'
        }
      >
        <RenderPDF language='en' PDF={enSDS} />
        <RenderPDF language='bm' PDF={bmSDS} />
      </div>
    </>
  ) : (
    <div className='space-y-6'>
      <SDSField
        language='en'
        SDS={enSDS}
        setSDS={setEnSDS}
        extractionResult={enExtractionResult}
        setExtractionResult={setEnExtractionResult}
        classifications={classifications}
        setClassifications={setClassifications}
        setErrorMessage={setErrorMessage}
        isEdit={isEdit}
      />

      <SDSField
        language='bm'
        SDS={bmSDS}
        setSDS={setBmSDS}
        extractionResult={bmExtractionResult}
        setExtractionResult={setBmExtractionResult}
        classifications={classifications}
        setClassifications={setClassifications}
        setErrorMessage={setErrorMessage}
        isEdit={isEdit}
      />
    </div>
  )
}

const SDSField = ({
  language,
  SDS,
  setSDS,
  extractionResult,
  setExtractionResult,
  classifications,
  setClassifications,
  setErrorMessage,
  isEdit,
}) => (
  <div>
    {isEdit ? (
      <div className='mb-2 flex items-baseline justify-between'>
        <label
          htmlFor={`${language}SDS`}
          className={`mb-0 ${
            SDS.toString().toLowerCase().endsWith('.pdf')
              ? ''
              : 'required-input-label'
          }`}
        >
          Safety Data Sheet (SDS) - {language.toUpperCase()}
        </label>

        {(SDS.toString().toLowerCase().endsWith('.pdf') ||
          SDS === 'No SDS') && (
          <span
            onClick={() => setSDS('')}
            className='cursor-pointer text-xs font-medium text-indigo-600 transition hover:text-indigo-700'
          >
            {SDS === 'No SDS' ? 'Upload SDS' : 'Upload New SDS'}
          </span>
        )}
      </div>
    ) : (
      <label htmlFor={`${language}SDS`} className='required-input-label'>
        Safety Data Sheet (SDS) - {language.toUpperCase()}
      </label>
    )}

    {!SDS ? (
      <>
        <PDFDropZone
          setPDF={setSDS}
          classifications={classifications}
          setClassifications={setClassifications}
          setExtractionResult={setExtractionResult}
          setErrorMessage={setErrorMessage}
        />
        <p className='mt-2 text-xs text-gray-400'>
          Only PDF is supported. Max file size: 10 MB.
        </p>
      </>
    ) : (
      <RenderPDF
        language={language}
        PDF={SDS}
        setPDF={setSDS}
        extractionResult={extractionResult}
      />
    )}
  </div>
)

export default SDSsField
