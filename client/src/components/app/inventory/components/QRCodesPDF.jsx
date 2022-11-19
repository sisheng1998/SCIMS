import React from 'react'
import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
  Font,
} from '@react-pdf/renderer'
import { FormatChemicalDate } from '../../../utils/FormatDate'
import GilroyNormal from './PDFFonts/Gilroy-Regular.ttf'
import GilroyMedium from './PDFFonts/Gilroy-Medium.ttf'

Font.register({
  family: 'Gilroy',
  fonts: [
    {
      src: GilroyNormal,
      fontStyle: 'normal',
      fontWeight: 'normal',
    },
    {
      src: GilroyMedium,
      fontStyle: 'normal',
      fontWeight: 'medium',
    },
  ],
})

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    padding: 21,
    fontFamily: 'Gilroy',
    fontWeight: 'normal',
    fontSize: 6,
    lineHeight: 1.25,
    color: 'black',
  },
  card: {
    width: '25%',
    border: '0.25pt solid black',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 11,
    paddingBottom: 9,
    paddingHorizontal: 8,
  },
  CASNo: {
    marginBottom: 4,
    color: 'rgba(0,0,0,0.6)',
    textAlign: 'center',
  },
  name: {
    fontSize: 8,
    color: 'rgba(0,0,0,0.8)',
    fontWeight: 'medium',
    textAlign: 'center',
  },
  QRCode: {
    marginTop: 6,
    marginBottom: 9,
    width: 72,
  },
  label: {
    fontSize: 5,
    color: 'rgba(0,0,0,0.6)',
    textAlign: 'center',
  },
  expDate: {
    fontSize: 8,
    fontWeight: 'medium',
    color: 'rgba(0,0,0,0.8)',
  },
  location: {
    marginTop: 3,
    color: 'rgba(0,0,0,0.6)',
    textAlign: 'center',
  },
})

const QRCodesPDF = ({ chemicals, selected, labName }) => {
  const selectedChemicals = chemicals.filter((chemical) =>
    selected.includes(chemical._id)
  )

  return (
    <Document
      title='Chemical QR Codes'
      author='Ooi Si Sheng'
      subject='Chemical QR Codes'
      creator='Ooi Si Sheng'
      producer='Ooi Si Sheng'
    >
      <Page size='A4' style={styles.page}>
        {selectedChemicals
          .sort((a, b) => a.name.length - b.name.length)
          .map((chemical) => (
            <View key={chemical._id} style={styles.card} wrap={false}>
              <Text style={styles.CASNo}>SCIMS • {chemical.CASId.CASNo}</Text>
              <Text style={styles.name}>
                {chemical.name
                  .replace(/([ -])/g, '\u00ad$&')
                  .replace(/([ ),'-])/g, '$&\u00ad')
                  .replace(/\u00ad\u00ad/g, '\u00ad')}
              </Text>
              <Image style={styles.QRCode} src={chemical.QRCode} />
              <Text style={styles.label}>
                Exp. Date:{' '}
                <Text style={styles.expDate}>
                  {FormatChemicalDate(chemical.expirationDate)}
                </Text>
              </Text>
              <Text style={styles.location}>
                Lab {labName} • {chemical.location}
              </Text>
            </View>
          ))}
      </Page>
    </Document>
  )
}

export default QRCodesPDF
