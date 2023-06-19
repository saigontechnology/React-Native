import firestore, {
  FirebaseFirestoreTypes,
  QueryDocumentSnapshot,
} from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {IMessage as IGiftedChatMessage} from 'react-native-gifted-chat';
import {FireStoreCollection, IConversation, IMessage} from './type';
import {uploadFileToFirebase} from '../Firebase/storage';
import {
  encryptData,
  formatEncryptedMessageData,
  formatMessageData,
  generateKey,
} from '../../Utilities';

let userInfo: any;
let currentUserId = '';
const setUserData = (userId: string, data: any) => {
  currentUserId = userId.toString();
  userInfo = data;
};

const sendMessage = async (
  conversationId: string,
  text: string,
  members: {
    [userId: string]: string;
  },
  file?: any,
  enableEncrypt?: boolean,
) => {
  let message = text;
  if (enableEncrypt) {
    const key = await generateKey('Arnold', 'salt', 5000, 256);
    message = await encryptData(text, key);
  }
  const created = new Date().valueOf();
  const messageData = {
    readBy: {},
    status: 'pending',
    senderId: currentUserId,
    created: created,
    text: message || '',
    ...file,
  };
  await updateLatestMessageInChannel(
    currentUserId,
    conversationId,
    message || '',
  );

  if (file) {
    const task = uploadFileToFirebase(
      file.imageUrl,
      file.extension,
      conversationId,
    );
    task
      .then(
        res => {
          storage()
            .ref(res.metadata.fullPath)
            .getDownloadURL()
            .then(imageUrl => {
              firestore()
                .collection<IMessage>(
                  `${FireStoreCollection.conversations}/${conversationId}/${FireStoreCollection.messages}`,
                )
                .add(messageData)
                .then(snapShot => {
                  snapShot
                    .update({
                      imageUrl,
                      status: 'sent',
                    })
                    .then();
                })
                .catch(err => {
                  console.log('chat', err);
                });
            });
        },
        err => {
          console.log('reject', err);
        },
      )
      .catch(() => {
        console.log('chat', 'err');
      });
  } else {
    firestore()
      .collection<IMessage>(
        `${FireStoreCollection.conversations}/${conversationId}/${FireStoreCollection.messages}`,
      )
      .add(messageData)
      .then(snapShot => {
        snapShot
          .update({
            status: 'sent',
          })
          .then();
      })
      .catch(err => {
        console.log('chat', err);
      });
  }
};

const updateLatestMessageInChannel = (
  userId: string,
  conversationId: string,
  message: string,
) => {
  const created = new Date().valueOf();
  const latestMessageData = {
    text: message,
    created: created,
    senderId: userId,
    readBy: {
      [userId]: true,
    },
  };
  let conversationRef = firestore()
    .collection<IConversation>(`${FireStoreCollection.conversations}`)
    .doc(conversationId);
  return firestore().runTransaction(function (transaction) {
    return transaction.get(conversationRef).then(function (doc) {
      if (!doc.exists) {
        conversationRef
          .update({
            latestMessage: latestMessageData,
            unRead: Object.fromEntries(
              Object.entries(doc.data().unRead).map(([memberId]) => {
                if (memberId === currentUserId) {
                  return [memberId, 0];
                } else {
                  return [memberId, 1];
                }
              }),
            ),
          })
          .then();
      } else {
        transaction.update(conversationRef, {
          latestMessage: latestMessageData,
          unRead: Object.fromEntries(
            Object.entries(doc.data().unRead).map(([memberId]) => {
              if (memberId === currentUserId) {
                return [memberId, 0];
              } else {
                return [memberId, doc.data().unRead[memberId] + 1];
              }
            }),
          ),
        });
      }
    });
  });
};

const changeReadMessage = (conversationId: string) => {
  firestore()
    .collection(`${FireStoreCollection.conversations}`)
    .doc(conversationId)
    .set(
      {
        unRead: {
          [currentUserId]: 0,
        },
      },
      {merge: true},
    )
    .then(() => {});
};

let messageCursor: QueryDocumentSnapshot;

//
const getMessageHistory = (conversationId: string, enableEncrypt?: boolean) => {
  let listMessage: any = [];
  return new Promise(async resolve => {
    const querySnapshot = await firestore()
      .collection(
        `${FireStoreCollection.conversations}/${conversationId}/${FireStoreCollection.messages}`,
      )
      .orderBy('created', 'desc')
      .limit(20)
      .get();
    if (enableEncrypt) {
      listMessage = await Promise.all(
        querySnapshot.docs.map(doc => {
          return formatEncryptedMessageData({id: doc.id, ...doc.data()});
        }),
      );
    } else {
      querySnapshot.forEach(function (doc) {
        listMessage.push(formatMessageData({id: doc.id, ...doc.data()}));
      });
    }
    if (listMessage.length > 0) {
      messageCursor = querySnapshot.docs[querySnapshot.docs.length - 1];
    }
    resolve(listMessage);
  });
};
const receiveMessageListener = (
  conversationId: string,
  callBack: (message: any) => void,
) => {
  return firestore()
    .collection<IMessage>(
      `${FireStoreCollection.conversations}/${conversationId}/${FireStoreCollection.messages}`,
    )
    .onSnapshot(function (snapshot) {
      if (snapshot) {
        snapshot.docChanges().forEach(function (change) {
          if (
            change.type === 'modified' &&
            change.doc.data().status === 'sent'
          ) {
            callBack({...change.doc.data(), id: change.doc.id});
          }
        });
      }
    });
};

function userConversationListener(
  conversationId: string,
  callBack?: (data: FirebaseFirestoreTypes.DocumentData | undefined) => void,
) {
  return firestore()
    .collection(`${FireStoreCollection.conversations}`)
    .doc(conversationId)
    .onSnapshot(function (snapshot) {
      if (snapshot) {
        callBack?.(snapshot.data());
      }
    });
}

const getMoreMessage = (
  conversationId: string,
  enableEncrypt?: boolean,
): Promise<IGiftedChatMessage[] | Awaited<IGiftedChatMessage>[]> => {
  if (!messageCursor) {
    return new Promise(resolve => resolve([]));
  }
  let listMessage: IGiftedChatMessage[] | Awaited<IGiftedChatMessage>[] = [];
  return new Promise<IGiftedChatMessage[] | Awaited<IGiftedChatMessage>[]>(
    async resolve => {
      const querySnapshot = await firestore()
        .collection<IMessage>(
          `${FireStoreCollection.conversations}/${conversationId}/${FireStoreCollection.messages}`,
        )
        .orderBy('created', 'desc')
        .limit(20)
        .startAfter(messageCursor)
        .get();
      if (enableEncrypt) {
        listMessage = await Promise.all(
          querySnapshot.docs.map(doc => {
            return formatEncryptedMessageData({id: doc.id, ...doc.data()});
          }),
        );
      } else {
        querySnapshot.forEach(doc => {
          let message = formatMessageData({id: doc.id, ...doc.data()});
          listMessage.push(message);
        });
      }
      if (listMessage.length > 0) {
        messageCursor = querySnapshot.docs[querySnapshot.docs.length - 1];
      }
      resolve(listMessage);
    },
  );
};

const countAllMessages = (conversationId: string) => {
  return new Promise<number>(resolve => {
    firestore()
      .collection<IMessage>(
        `${FireStoreCollection.conversations}/${conversationId}/${FireStoreCollection.messages}`,
      )
      .count()
      .get()
      .then(snapshot => {
        resolve(snapshot.data().count);
      });
  });
};

const setUserConversationTyping = (
  conversationId: string,
  memberId: string,
  isTyping: boolean,
) => {
  return firestore()
    .collection(`${FireStoreCollection.conversations}`)
    .doc(conversationId)
    .set(
      {
        typing: {
          [currentUserId]: isTyping,
        },
      },
      {
        merge: true,
      },
    );
};

export {
  setUserData,
  getMessageHistory,
  updateLatestMessageInChannel,
  sendMessage,
  receiveMessageListener,
  changeReadMessage,
  getMoreMessage,
  countAllMessages,
  userConversationListener,
  setUserConversationTyping,
};
