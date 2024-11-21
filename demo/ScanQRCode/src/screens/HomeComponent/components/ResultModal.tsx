import React from 'react'
import {Modal, View, StyleSheet, Text, TouchableOpacity} from 'react-native'
import {navigate} from '../../../navigation/NavigationService'
import RouteKey from '../../../navigation/RouteKey'

interface ResultModalProps {
  visible: boolean
  email: string
  name: string
  closeCallback: () => void
}

export const ResultModal: React.FC<ResultModalProps> = ({visible, name, email, closeCallback}) => (
  <Modal visible={visible} onRequestClose={() => {}} transparent>
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={[styles.text, styles.title]}>QR RESULT</Text>
        <View style={styles.row}>
          <Text style={[styles.text, styles.subTitle]}>Name: </Text>
          <Text style={styles.text}>{name}</Text>
        </View>
        <View style={styles.row}>
          <Text style={[styles.text, styles.subTitle]}>Email: </Text>
          <Text style={styles.text}>{email}</Text>
        </View>
        <TouchableOpacity
          style={[styles.button, {backgroundColor: '#384a3d', marginTop: 20}]}
          onPress={() => navigate(RouteKey.RecordScreen, {})}>
          <Text style={styles.buttonLabel}>See Records</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, {backgroundColor: '#fff'}]} onPress={closeCallback}>
          <Text style={[styles.buttonLabel, {color: 'black'}]}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  contentContainer: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 16,
    width: '80%',
  },
  button: {
    width: '100%',
    height: 44,
    alignSelf: 'center',
    paddingVertical: 0,
    marginTop: 12,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  text: {
    color: 'black',
  },
  subTitle: {
    fontWeight: '500',
  },
  buttonLabel: {
    fontSize: 16,
    color: 'white',
    fontWeight: '700',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
  },
})
