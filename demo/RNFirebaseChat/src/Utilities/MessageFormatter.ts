/**
 * Created by NL on 6/1/23.
 */
import {decryptData, generateKey} from './AESCrypto';

const formatMessageData = (message: any) => {
  return {
    _id: message.id,
    text: message.text,
    createdAt: message.created,
    user: {
      _id: message.senderId,
      name: message.name,
      avatar:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png',
    },
    imageUrl: message.imageUrl,
    type: message.type,
    fileUrl: message.fileUrl,
    fileName: message?.fileName,
    fileSize: message?.fileSize,
    mine: message?.mine,
  };
};

const formatEncryptedMessageData = (message: any) => {
  return generateKey('Arnold', 'salt', 5000, 256).then(key => {
    return decryptData(message.text, key)
      .then(decryptedMessage => {
        return {
          _id: message.id,
          text: decryptedMessage ? decryptedMessage : message.text,
          createdAt: message.created,
          user: {
            _id: message.senderId,
            name: message.name,
            avatar:
              'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png',
          },
          imageUrl: message.imageUrl,
          type: message.type,
          fileUrl: message.fileUrl,
          fileName: message?.fileName,
          fileSize: message?.fileSize,
          mine: message?.mine,
        };
      })
      .catch(err => {
        console.log('%c decryptData', 'color:#4AF82F', err);
      });
  });
};

export {formatMessageData, formatEncryptedMessageData};
