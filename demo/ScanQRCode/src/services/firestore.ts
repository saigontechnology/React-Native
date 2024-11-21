import firestore from '@react-native-firebase/firestore';
import { IUserInfo } from '../store/types';

export type Record = {
  id?: string;
  email: string;
  time: number;
  name: string;
}

const getUserInfo = async (uid: string) => (await firestore()
  .doc(`users/${uid}`)
  .get()).data() as IUserInfo

const saveUserInfo = async (uid: string, displayName: string) => await firestore()
  .doc(`users/${uid}`)
  .set({displayName})

const saveNewRecord = async (uid: string, email: string, name: string, data: Record) => await Promise.all([
    firestore()
    .doc(`users/${uid}`)
    .collection('my_records')
    .add(data),
    firestore()
    .doc(`users/${data.id}`)
    .collection('other_records')
    .add({
      email,
      id: uid,
      name,
      time: Date.now(),
    })
  ])

const getRecordData = (isMine: boolean, uid: string, callback: (records: Record[]) => void) => {
  firestore()
  .collection(`users/${uid}/${isMine ? 'my_records' : 'other_records'}`)
  .get()
  .then(querySnapshot => {
    if (querySnapshot?.size) {
      callback?.(querySnapshot.docs.map(documentSnapshot => ({
          id: documentSnapshot.id,
          ...documentSnapshot.data() as Record,
        })));
    } else {
      callback?.([])
    }
  })
}

export {saveNewRecord, getRecordData, getUserInfo, saveUserInfo}
