import * as pdfjsLib from 'pdfjs-dist/webpack'
import {
  CLASSIFICATION_LIST,
  HAZARD_CODES,
} from '../../../config/safety_security_list'

// Code came from https://jsfiddle.net/ourcodeworld/9s3hpbu2/

const getClassifications = (text, codeList, classifications, index) => {
  if (codeList.some((code) => text.includes(code))) {
    classifications.push(CLASSIFICATION_LIST[index])
  }
}

const getPageText = (pageNum, PDFDocumentInstance) =>
  new Promise((resolve, reject) => {
    PDFDocumentInstance.getPage(pageNum).then((pdfPage) => {
      pdfPage.getTextContent().then((textContent) => {
        const textItems = textContent.items
        let finalString = ''

        for (let i = 0; i < textItems.length; i++) {
          let item = textItems[i]

          finalString += item.str + ' '
        }

        resolve(finalString)
      })
    })
  })

const ExtractClassifications = (pdf) =>
  new Promise((resolve) => {
    const fileReader = new FileReader()

    let classifications = []

    fileReader.onloadend = (e) => {
      pdfjsLib.getDocument(e.currentTarget.result).promise.then(
        (pdf) => {
          const pdfDocument = pdf
          let pagesPromises = []

          for (let i = 0; i < pdf.numPages; i++) {
            ;((pageNumber) => {
              pagesPromises.push(getPageText(pageNumber, pdfDocument))
            })(i + 1)
          }

          Promise.all(pagesPromises).then((pagesText) => {
            pagesText.forEach((text) => {
              const lowercaseText = text.toLowerCase()

              if (
                lowercaseText.includes('hazard identification') ||
                lowercaseText.includes('ghs classification') ||
                lowercaseText.includes('hazard statement') ||
                lowercaseText.includes('pengenalan bahaya') ||
                lowercaseText.includes('pengelasan ghs')
              ) {
                HAZARD_CODES.forEach((codeList, index) =>
                  getClassifications(
                    lowercaseText,
                    codeList,
                    classifications,
                    index
                  )
                )
              }
            })

            resolve([...new Set(classifications)])
          })
        },
        () => {
          resolve([])
        }
      )
    }

    fileReader.readAsArrayBuffer(pdf)
  })

export default ExtractClassifications
