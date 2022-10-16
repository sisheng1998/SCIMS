import React from 'react'
import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
} from '@react-pdf/renderer'
import { FormatChemicalDate } from '../../../utils/FormatDate'

const styles = StyleSheet.create({
  page: {
    paddingVertical: '24pt',
    paddingHorizontal: '32pt',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  card: {
    width: '25%',
    border: '0.25pt solid black',
    paddingHorizontal: '12pt',
    paddingVertical: '16pt',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  CASNo: {
    fontSize: '6pt',
    marginBottom: '4pt',
    opacity: 0.6,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  name: {
    fontSize: '8pt',
    letterSpacing: 0.5,
    opacity: 0.8,
    textAlign: 'center',
  },
  QRCode: {
    marginVertical: '10pt',
    width: '72pt',
  },
  label: {
    fontSize: '6pt',
    opacity: 0.6,
    textAlign: 'center',
  },
  expDate: {
    fontSize: '8pt',
    letterSpacing: 0.5,
    opacity: 0.8,
  },
  location: {
    fontSize: '7pt',
    marginTop: '6pt',
    opacity: 0.7,
    textAlign: 'center',
  },
})

const QRCodesPDF = ({ chemicals, selected, labName }) => {
  const selectedChemicals = chemicals.filter((chemical) =>
    selected.includes(chemical._id)
  )

  return (
    <Document>
      <Page size='A4' style={styles.page}>
        {selectedChemicals.map((chemical) => (
          <View key={chemical._id} style={styles.card} wrap={false}>
            <Text style={styles.CASNo}>SCIMS • {chemical.CASId.CASNo}</Text>
            <Text style={styles.name}>{chemical.name}</Text>
            <Image style={styles.QRCode} src={chemical.QRCode} />
            <Text style={styles.label}>
              Expiry Date:{' '}
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
