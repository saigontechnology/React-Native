import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  ImageSourcePropType,
} from 'react-native';

export interface Country {
  country: string;
  ip: string;
  uri: ImageSourcePropType;
  username?: string;
  password?: string;
}

interface ModalProps {
  visible: boolean;
  closeModal: () => void;
  connect: (item: Country) => void;
}

const ModalBottom: React.FC<ModalProps> = ({visible, connect, closeModal}) => {
  const arrIPs = [
    {
      country: 'Russian',
      ip: 'vpn745997194.opengw.net 1881',
      uri: require('../../images/russia.png'),
    },
    {
      country: 'Japan',
      ip: 'public-vpn-231.opengw.net 443',
      uri: require('../../images/japan.png'),
    },
    {
      country: 'Vietnam',
      ip: 'myvpn.planet1world.com 8443',
      uri: require('../../images/vietnam.png'),
    },
  ];

  const renderItem = ({item}: {item: Country}) => {
    return (
      <View key={item.country} style={styles.item}>
        <View style={styles.avatarContainer}>
          <Image source={item.uri} style={styles.flag} />
        </View>
        <View style={styles.textContainer}>
          <Text>{item.country}</Text>
          <Text style={styles.ipStyle}>{item.ip}</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={() => connect?.(item)}>
          <Text style={styles.textButton}>Connect</Text>
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={closeModal}>
      <TouchableWithoutFeedback onPress={closeModal}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            {arrIPs.map(item => renderItem({item}))}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'transparent', //'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: 300,
  },
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  button: {
    backgroundColor: '#1c1c3d',
    padding: 10,
    alignItems: 'center',
    borderRadius: 15,
    borderColor: '#fff',
    borderWidth: 2,
    width: 90,
  },
  flag: {
    width: 30,
    height: 20,
    marginRight: 10,
    borderRadius: 5,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#8acc2f',
    marginTop: 10,
    borderRadius: 10,
  },
  textButton: {
    color: '#fff',
  },
  ipStyle: {
    color: 'gray',
    fontSize: 11,
    marginTop: 4,
  },
});

export default ModalBottom;
