/* eslint-disable react-native/no-inline-styles */
import {NativeStackScreenProps} from '@react-navigation/native-stack'
import React, {PropsWithChildren, useEffect, useMemo, useState} from 'react'
import {ScreenContainer} from '../../components'
import RouteKey from '../../navigation/RouteKey'
import {AppStackParamList} from '../../navigation/types'
import {ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {useSelector} from 'react-redux'
import {getUserInfo} from '../../store/selectors'
import {getRecordData, Record} from '../../services/firestore'

type Props = NativeStackScreenProps<AppStackParamList, RouteKey.RecordScreen> & PropsWithChildren

export const RecordScreen: React.FC<Props> = () => {
  const [data, setData] = useState<Record[]>([])
  const [activeTab, setActiveTab] = useState(0)
  const [loading, setLoading] = useState(true)
  const currentUser = useSelector(getUserInfo)

  const dataSortedByTime = useMemo(() => data.sort((a, b) => b.time - a.time), [data])

  useEffect(() => {
    if (currentUser?.uid) {
      setLoading(true)
      getRecordData(activeTab === 0, currentUser.uid, records => {
        setData(records)
        setLoading(false)
      })
    }
  }, [currentUser, activeTab])

  return (
    <ScreenContainer hasBackButton backButtonFill="#000">
      <View style={styles.container}>
        <Text style={styles.header}>{activeTab === 0 ? 'You scanned...' : 'You were scanned by...'}</Text>
        {!!data?.length && (
          <View style={styles.tableHeader}>
            <Text style={[styles.tableTitle, {flex: 0.6}]} />
            <Text style={styles.tableTitle}>Name</Text>
            <Text style={styles.tableTitle}>Time</Text>
          </View>
        )}
        {loading ? (
          <ActivityIndicator size={'large'} color={'green'} />
        ) : (
          <FlatList
            data={dataSortedByTime}
            contentContainerStyle={styles.content}
            keyExtractor={item => item.id || item.email}
            renderItem={({item, index}) => (
              <View
                style={[
                  styles.item,
                  index % 2 === 0 && {
                    backgroundColor: '#afe3bc',
                  },
                ]}
                key={index.toString()}>
                <Text style={[styles.text, {flex: 0.6}]}>{index + 1}</Text>
                <Text style={[styles.text, {flex: 3}]}>
                  {item.name}
                  {'\n'}
                  {item.email}
                </Text>
                <Text style={[styles.text, {flex: 3, fontSize: 13.5}]}>
                  {new Date(parseInt(item.time.toString(), 10)).toLocaleString()}
                </Text>
              </View>
            )}
            ListEmptyComponent={<Text style={styles.text}>Empty</Text>}
          />
        )}
        <View style={styles.bottomTabs}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.button}
            onPress={() => {
              setData([])
              setActiveTab(0)
            }}>
            <Text style={[styles.label, activeTab === 0 && styles.activeLabel]}>My Records</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.button}
            onPress={() => {
              setData([])
              setActiveTab(1)
            }}>
            <Text style={[styles.label, activeTab === 1 && styles.activeLabel]}>Other Records</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 72,
    paddingHorizontal: 0,
    backgroundColor: 'white',
  },
  text: {
    fontSize: 15,
    color: 'black',
    lineHeight: 24,
  },
  bottomTabs: {
    gap: StyleSheet.hairlineWidth,
    height: 50,
    zIndex: 100,
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    alignSelf: 'center',
    position: 'absolute',
    borderTopColor: 'gray',
    backgroundColor: 'gray',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  header: {
    fontSize: 16,
    color: 'black',
    fontWeight: '500',
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  tableHeader: {
    gap: 4,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  content: {
    gap: 8,
    paddingBottom: 32,
    paddingHorizontal: 16,
  },
  item: {
    gap: 4,
    minHeight: 42,
    flexDirection: 'row',
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  tableTitle: {
    flex: 3,
    color: 'black',
    fontWeight: '700',
  },
  label: {
    fontSize: 15,
    color: 'gray',
    fontWeight: '500',
  },
  activeLabel: {
    color: 'green',
    fontWeight: '500',
    fontSize: 15,
  },
})
