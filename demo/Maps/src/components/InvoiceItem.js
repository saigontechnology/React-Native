import React, {memo} from 'react'
import {View, StyleSheet} from 'react-native'
import {responsiveHeight} from '../themes'
import RowItem from './RowItem'

const InvoiceItem = ({reference, date, amount, description}) => (
  <View style={styles.container}>
    <RowItem label="Reference:" content={reference ?? ''} />
    <RowItem label="Due Date:" content={date ?? ''} />
    <RowItem label="Amount:" content={amount ?? ''} />
    <RowItem label="Description:" content={description ?? ''} />
  </View>
)

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#D6D6D6',
    marginBottom: responsiveHeight(10),
  },
})

export default memo(InvoiceItem)
