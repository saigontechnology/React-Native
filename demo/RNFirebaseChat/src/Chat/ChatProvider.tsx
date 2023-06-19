import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  KeyboardAvoidingView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import {
  GiftedChat,
  GiftedChatProps,
  IMessage as IGiftedChatMessage,
  InputToolbarProps,
} from 'react-native-gifted-chat';
import {
  changeReadMessage,
  countAllMessages,
  getMessageHistory,
  getMoreMessage,
  IConversation,
  receiveMessageListener,
  sendMessage,
  setUserConversationTyping,
  userConversationListener,
} from '../Services/Firestore';
import {createConversation} from '../Services/Firestore/conversation';
import CustomInputMessage from './Component/CustomInputMessage';
import CustomMessageView from './Component/CustomMessageView';
import {formatEncryptedMessageData, formatMessageData} from '../Utilities';
import TypingIndicator from 'react-native-gifted-chat/lib/TypingIndicator';
import {PhotoGalleryView} from './Component/PhotoGalleryView';
import {TYPING_TIMEOUT_SECONDS} from './constanst';

interface IUserInfo {
  id: string;
  name: string;
}

interface ChatScreenProps extends GiftedChatProps {
  userInfo: IUserInfo;
  conversationInfo: IConversation;
  memberId: string;
  style?: StyleProp<ViewStyle>;
  enableEncrypt?: boolean;
  enableTyping?: boolean;
  typingTimeoutSeconds?: number;
}

let typingTimeout: ReturnType<typeof setTimeout>;

export const ChatProvider: React.FC<ChatScreenProps> = React.forwardRef(
  (
    {
      userInfo,
      memberId,
      conversationInfo,
      style,
      renderLoadEarlier,
      renderAvatar,
      renderBubble,
      renderMessage,
      enableEncrypt,
      enableTyping,
      typingTimeoutSeconds = TYPING_TIMEOUT_SECONDS,
      ...props
    },
    ref,
  ) => {
    const [messagesList, setMessagesList] = useState<IGiftedChatMessage[]>([]);
    const [isShowPhotoGallery, setIsShowPhotoGallery] =
      useState<boolean>(false);
    const [loadEarlier, setLoadEarlier] = useState<boolean>(false);
    const [isLoadingEarlier, setIsLoadingEarlier] = useState<boolean>(false);
    const [isTyping, setIsTyping] = useState<boolean>(false);

    const conversationRef = useRef<IConversation>(conversationInfo);
    const messageRef = useRef<IGiftedChatMessage[]>(messagesList);
    messageRef.current = messagesList;
    const giftedChatRef = useRef<GiftedChat>(null);
    const totalMessages = useRef<number>(0);
    const typingRef = useRef(isTyping);

    const textInputMessageCustom = (
      props: InputToolbarProps<IGiftedChatMessage>,
    ) => (
      <CustomInputMessage
        {...props}
        isShowPhotoGallery={isShowPhotoGallery}
        togglePhotoGallery={value => {
          setIsShowPhotoGallery(value);
        }}
      />
    );

    const customMessageView = (props: any) => {
      return <CustomMessageView {...props} />;
    };

    const isCloseToTop = ({
      layoutMeasurement,
      contentOffset,
      contentSize,
    }: any) => {
      const paddingToTop = 80;
      return (
        contentSize.height - layoutMeasurement.height - paddingToTop <=
        contentOffset.y
      );
    };

    const onLoadEarlier = useCallback(() => {
      if (messagesList.length < totalMessages.current && !isLoadingEarlier) {
        setTimeout(() => {
          setIsLoadingEarlier(true);
          setLoadEarlier(false);
          getMoreMessage(conversationRef.current.id, enableEncrypt).then(
            data => {
              setIsLoadingEarlier(false);
              setLoadEarlier(true);
              if (data.length > 0) {
                setMessagesList([...messagesList, ...data]);
              }
            },
          );
        }, 1000);
      } else {
        setLoadEarlier(false);
      }
    }, [enableEncrypt, isLoadingEarlier, messagesList]);

    const onSend = useCallback(
      async (messages = []) => {
        if (!conversationRef.current?.id) {
          conversationRef.current = await createConversation(
            userInfo.id,
            memberId,
            userInfo.name,
          );
        }
        clearTimeout(typingTimeout);
        setMessagesList(previousMessages =>
          GiftedChat.append(previousMessages, messages),
        );

        const messageData = {
          ...messages,
        };

        if (messages?.type?.includes('image')) {
          messageData.file = {
            type: 'image',
            imageUrl: messages?.imageUrl,
            // fileUrl: fileUrl,
            // fileName: messages?.fileName,
            // fileSize: messages?.fileSize,
            extension: messages?.extension,
          };
        } else if (!!messages.type) {
          messageData.file = {
            type: 'image',
            fileUrl: messages?.fileUrl,
            // fileUrl: fileUrl,
            // fileName: messages?.fileName,
            // fileSize: messages?.fileSize,
            extension: messages?.extension,
          };
        }

        sendMessage(
          conversationRef.current.id,
          messages.text,
          conversationRef.current.members,
          messageData?.file,
          enableEncrypt,
        );
      },
      [enableEncrypt, userInfo.id, userInfo.name, memberId],
    );

    const changeUserConversationTyping = useCallback(
      (value: boolean, callback?: () => void) => {
        setUserConversationTyping(
          conversationRef.current?.id,
          userInfo.id,
          value,
        ).then(callback);
      },
      [userInfo.id],
    );

    const onInputTextChanged = useCallback(
      (text: string) => {
        if (enableTyping) {
          if (!text) {
            changeUserConversationTyping(false);
            clearTimeout(typingTimeout);
          } else {
            clearTimeout(typingTimeout);
            changeUserConversationTyping(true, () => {
              typingTimeout = setTimeout(() => {
                changeUserConversationTyping(false, () => {
                  clearTimeout(typingTimeout);
                });
              }, typingTimeoutSeconds);
            });
          }
        }
      },
      [enableTyping, changeUserConversationTyping, typingTimeoutSeconds],
    );

    useEffect(() => {
      if (conversationInfo?.id) {
        countAllMessages(conversationInfo?.id).then(total => {
          totalMessages.current = total;
        });
        getMessageHistory(conversationInfo?.id, enableEncrypt).then(
          (res: any) => {
            changeReadMessage(conversationRef.current.id);
            setLoadEarlier(true);
            setMessagesList(res);
          },
        );
      }
    }, [conversationInfo?.id, enableEncrypt]);

    useEffect(() => {
      let receiveMessageRef: () => void;
      let userConversation: () => void;
      receiveMessageRef = receiveMessageListener(
        conversationRef.current.id,
        message => {
          if (message.senderId !== userInfo.id) {
            if (enableEncrypt) {
              formatEncryptedMessageData(message).then(formattedMessages => {
                setMessagesList([formattedMessages, ...messageRef.current]);
                changeReadMessage(conversationRef.current.id);
              });
            } else {
              setMessagesList([
                formatMessageData(message),
                ...messageRef.current,
              ]);
              changeReadMessage(conversationRef.current.id);
            }
          }
        },
      );
      // //Build for chat 1-1
      userConversation = userConversationListener(
        conversationRef.current?.id,
        newConversation => {
          conversationRef.current = newConversation as IConversation;
          typingRef.current = newConversation?.typing?.[memberId];
          setIsTyping(typingRef.current);
        },
      );

      return () => {
        if (receiveMessageRef) {
          receiveMessageRef();
        }
        if (userConversation) {
          userConversation();
        }
      };
    }, [userInfo.id, loadEarlier, memberId, enableEncrypt]);

    return (
      <View style={[styles.container, style]}>
        <KeyboardAvoidingView style={styles.container}>
          <GiftedChat
            ref={giftedChatRef}
            messages={messagesList}
            onSend={messages => onSend(messages[0])}
            user={{
              _id: userInfo.id,
              name: userInfo.name,
              avatar:
                'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png',
            }}
            keyboardShouldPersistTaps={'always'}
            renderCustomView={customMessageView}
            renderInputToolbar={textInputMessageCustom}
            // renderBubble={renderBubble}
            // listViewProps={{
            //   scrollEventThrottle: 5000,
            //   onScroll: ({nativeEvent}: any) => {
            //     if (isCloseToTop(nativeEvent)) {
            //       onLoadEarlier();
            //     }
            //   },
            // }}
            infiniteScroll
            loadEarlier={loadEarlier}
            onLoadEarlier={onLoadEarlier}
            isLoadingEarlier={isLoadingEarlier}
            renderLoadEarlier={renderLoadEarlier}
            renderBubble={renderBubble}
            renderAvatar={renderAvatar}
            renderMessage={renderMessage}
            onInputTextChanged={onInputTextChanged}
            isTyping={enableTyping && isTyping}
            renderChatFooter={() => <TypingIndicator />}
            {...props}
          />
        </KeyboardAvoidingView>
        {isShowPhotoGallery && (
          <PhotoGalleryView
            conversationId={conversationRef.current.id}
            onSendImage={message => {
              giftedChatRef.current?.onSend({
                ...message,
              });
            }}
          />
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});
