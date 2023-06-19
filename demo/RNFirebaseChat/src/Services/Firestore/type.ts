import {DocumentReference} from '@react-native-firebase/firestore';
import {IMessage as IGiftedChatMessage} from 'react-native-gifted-chat';

enum FireStoreCollection {
  users = 'users',
  messages = 'messages',
  conversations = 'conversations',
}

type UserStatus = 'online' | 'offline';
type MessageStatus = 'pending' | 'sent';

interface IUserProfile {
  created: number;
  name: string;
  status: UserStatus;
  updated: number;
  conservations?: string[];
}

interface IMessage extends IGiftedChatMessage {
  text: string;
  created?: number;
  senderId: string;
  readBy: {
    [userId: string]: boolean;
  };
  status?: MessageStatus;
  imageUrl?: string;
  type?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  mine?: string;
}

// interface IConversation {
//   // latestMessage: IMessage;
//   members?: {
//     [userId: string]: string;
//   };
//   typing?: {
//     [userId: string]: boolean;
//   };
//   // updated: number;
// }

interface IConversation {
  id: string;
  latestMessage: IMessage;
  updated: number;
  // memberId?: string;
  // memberRef?: DocumentReference;
  members: {
    [userId: string]: DocumentReference;
  };
  conversationName?: string;
  typing: {
    [userId: string]: boolean;
  };
  unRead: {
    [userId: string]: number;
  };
}

export {FireStoreCollection};
export type {IUserProfile, IConversation, IMessage};
