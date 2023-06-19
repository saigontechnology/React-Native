import firestore from '@react-native-firebase/firestore';
import {FireStoreCollection, IConversation} from './type';

const createConversation = async (
  userId: string,
  partnerId: string,
  // conversationName: string,
) => {
  let conversationData = {
    members: {
      [userId]: `${FireStoreCollection.users}/${userId}`,
      [partnerId]: `${FireStoreCollection.users}/${partnerId}`,
    },
  };

  // let channelData = {
  //   latestMessage: '',
  //   latestUpdate: new Date().getTime() + offSetTime,
  //   latestSenderId: currentUserId,
  //   members: [partnerId],
  //   countMessageUnread: 0,
  //   isTyping: false,
  //   channelName: channelName,
  //   channelPicture: channelPicture,
  // };

  const conversationRef = await firestore()
    .collection(`${FireStoreCollection.conversations}`)
    .add(conversationData);

  const userConversationData: IConversation = {
    typing: {},
    id: conversationRef.id,
    latestMessage: {
      readBy: {},
      senderId: '',
      text: '',
      created: 0,
    },
    ...conversationData,
    updated: new Date().valueOf(),
    unRead: {
      [userId]: 0,
      [partnerId]: 0,
    },
  };

  await firestore()
    .collection<IConversation>(`${FireStoreCollection.conversations}`)
    .doc(conversationRef.id)
    .set(userConversationData, {
      merge: true,
    });

  await firestore()
    .collection(`${FireStoreCollection.users}`)
    .doc(userId)
    .set(
      {
        conversations: [conversationRef.id],
      },
      {
        merge: true,
      },
    );

  await firestore()
    .collection(`${FireStoreCollection.users}`)
    .doc(partnerId)
    .set(
      {
        conversations: [conversationRef.id],
      },
      {
        merge: true,
      },
    );

  // await firestore()
  //   .collection<IUserConversation>(
  //     `${FireStoreCollection.users}/${partnerId}/${FireStoreCollection.conversations}`,
  //   )
  //   .doc(conversationRef.id)
  //   .set({
  //     ...userConversationData,
  //     conversationName: conversationName,
  //     members: {
  //       [userId]: `${FireStoreCollection.users}/${userId}`,
  //     },
  //   });
  return {...conversationData, id: conversationRef.id};
};

export {createConversation};
