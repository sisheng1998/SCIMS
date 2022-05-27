import * as pdfjsLib from 'pdfjs-dist/build/pdf'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry'

// Code came from https://jsfiddle.net/ourcodeworld/9s3hpbu2/

function getPageText(pageNum, PDFDocumentInstance) {
	// Return a Promise that is solved once the text of the page is retrieven
	return new Promise(function (resolve, reject) {
		PDFDocumentInstance.getPage(pageNum).then(function (pdfPage) {
			// The main trick to obtain the text of the PDF page, use the getTextContent method
			pdfPage.getTextContent().then(function (textContent) {
				var textItems = textContent.items
				var finalString = ''

				// Concatenate the string of the item to the final string
				for (var i = 0; i < textItems.length; i++) {
					var item = textItems[i]

					finalString += item.str + ' '
				}

				// Solve promise with the text retrieven from the page
				resolve(finalString)
			})
		})
	})
}

const ExtractClassifications = (pdf) => {
	pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker

	const fileReader = new FileReader()

	fileReader.onloadend = (e) => {
		pdfjsLib.getDocument(e.currentTarget.result).promise.then(
			function (pdf) {
				var pdfDocument = pdf
				var pagesPromises = []

				for (var i = 0; i < pdf.numPages; i++) {
					// Required to prevent that i is always the total of pages
					;(function (pageNumber) {
						pagesPromises.push(getPageText(pageNumber, pdfDocument))
					})(i + 1)
				}

				Promise.all(pagesPromises).then(function (pagesText) {
					for (var i = 0; i < pagesText.length; i++) {
						console.log(pagesText[i])
					}
				})
			},
			function (reason) {
				// PDF loading error
				console.error(reason)
			}
		)
	}

	fileReader.readAsArrayBuffer(pdf)

	return []
}

export default ExtractClassifications
