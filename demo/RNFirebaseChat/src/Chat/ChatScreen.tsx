import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ActivityIndicator, StyleSheet} from 'react-native';
import {Message} from 'react-native-gifted-chat';

import {ChatProvider} from './ChatProvider';
import AvatarName from '../Components/AvatarName';

interface ChatScreenProps extends NativeStackScreenProps<any> {}

export const ChatScreen: React.FC<ChatScreenProps> = ({route}) => {
  const {userInfo, conversationInfo, memberId, enableEncrypt, enableTyping} =
    route.params || {};
  return (
    <SafeAreaView
      edges={['bottom']}
      style={{flex: 1, backgroundColor: 'white'}}>
      <ChatProvider
        enableEncrypt={enableEncrypt}
        enableTyping={enableTyping}
        userInfo={userInfo}
        conversationInfo={conversationInfo}
        memberId={memberId}
        renderLoadEarlier={() => {
          return <ActivityIndicator style={styles.loadEarlier} />;
        }}
        renderMessage={props => {
          const {renderAvatar, ...res} = props;
          return (
            <Message
              imageStyle={{
                left: {
                  width: 30,
                  height: 30,
                },
              }}
              renderAvatar={() => <AvatarName fullName={'React Native'} />}
              {...res}
            />
          );
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loadEarlier: {
    marginVertical: 20,
  },
});
