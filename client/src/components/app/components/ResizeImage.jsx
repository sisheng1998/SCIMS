const MAX_WIDTH = 500
const MAX_HEIGHT = 500

const ResizeImage = (image, setImage) => {
  let reader = new FileReader()

  reader.onload = (e) => {
    let img = document.createElement('img')

    img.onload = () => {
      let canvas = document.createElement('canvas')
      let width = img.width
      let height = img.height

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width
          width = MAX_WIDTH
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height
          height = MAX_HEIGHT
        }
      }

      canvas.width = width
      canvas.height = height

      let canvasContext = canvas.getContext('2d')
      canvasContext.drawImage(img, 0, 0, width, height)

      canvasContext.canvas.toBlob(
        (blob) => {
          const compressedImage = new File([blob], image.name, {
            type: 'image/jpeg',
          })

          setImage(compressedImage)
        },
        'image/jpeg',
        1
      )
    }
    img.src = e.target.result
  }
  reader.readAsDataURL(image)
}

export default ResizeImage
