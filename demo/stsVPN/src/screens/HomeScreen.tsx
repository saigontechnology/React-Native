import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import Header from '../components/Header';
import ConnectingTime from '../components/ConnectingTime';
import CountrySelector from '../components/CountrySelector';
import SpeedIndicator from '../components/SpeedIndicator';
import ModalBottom, {Country} from '../components/ModalBottom';
import RNSimpleOpenvpn, {
  addVpnStateListener,
  removeVpnStateListener,
} from 'react-native-simple-openvpn';
import {getDownloadSpeed, getUploadSpeed} from '../utils/Network';

const HomeScreen: React.FC = () => {
  const [isShowModal, setIsShowModal] = useState(false);
  const [isPressPowerButton, setIsPressPowerButton] = useState(false);
  const [isError, setIsError] = useState(false);
  const [itemSelected, setItemSelected] = useState<Country>({
    country: 'Russian',
    ip: 'vpn745997194.opengw.net 1881',
    uri: require('../../images/russia.png'),
  });
  const [downloadSpeed, setDownloadSpeed] = useState<string>('0.0');
  const [uploadSpeed, setUploadSpeed] = useState<string>('0.0');

  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    const updateSpeeds = async () => {
      try {
        const loadSpeed = await getDownloadSpeed();
        const upSpeed = await getUploadSpeed();
        setDownloadSpeed(loadSpeed || '0.0');
        setUploadSpeed(upSpeed || '0.0');
      } catch (error) {
        console.error('Error updating speeds:', error);
      }
    };

    if (isPressPowerButton) {
      updateSpeeds();
      intervalRef.current = setInterval(updateSpeeds, 6000);
    } else {
      setDownloadSpeed('0.0');
      setUploadSpeed('0.0');
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current); // Clean up interval on component unmount
        intervalRef.current = null; // Clear the ref
      }
    };
  }, [isPressPowerButton]);

  useEffect(() => {
    const observeVpn = async () => {
      addVpnStateListener(e => {
        console.log('Listening', JSON.stringify(e), undefined, 2);
      });
    };

    observeVpn();

    return () => {
      removeVpnStateListener();
    };
  }, []);

  const startOvpn = async () => {
    try {
      await RNSimpleOpenvpn.connect({
        username: itemSelected?.username,
        password: itemSelected?.password,
        remoteAddress: itemSelected.ip,
        ovpnFileName: itemSelected.country, // Japan or Russian (android assets folder)
        assetsPath: '',
        notificationTitle: 'safe vpn',
        compatMode: RNSimpleOpenvpn.CompatMode.OVPN_TWO_THREE_PEER,
        providerBundleIdentifier: 'com.your.network.extension.bundle.id',
        localizedDescription: 'TestRNSimpleOvpn',
      });
      setIsPressPowerButton(true);
    } catch (error) {
      console.log('error - start: ', error);
      setIsError(true);
    }
  };

  const stopOvpn = async () => {
    try {
      await RNSimpleOpenvpn.disconnect();
      setIsPressPowerButton(false);
    } catch (error) {
      console.log('error - stop ', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.vpnContainer}>
        <Header />
        <ConnectingTime
          onToggleTimer={isRunning => {
            !isRunning ? startOvpn() : stopOvpn();
          }}
          isRunningTimer={isPressPowerButton}
          isError={isError}
        />
        <CountrySelector
          onPressCountry={() => {
            setIsShowModal(true);
            setIsError(false);
          }}
          item={itemSelected}
        />
        <SpeedIndicator
          downloadSpeed={isPressPowerButton ? downloadSpeed : '0.0'}
          uploadSpeed={isPressPowerButton ? uploadSpeed : '0.0'}
        />
      </View>
      <ModalBottom
        visible={isShowModal}
        closeModal={() => {
          setIsShowModal(false);
        }}
        connect={item => {
          setItemSelected(item);
          setIsShowModal(false);
          setIsPressPowerButton(false);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8acc2f',
    padding: 20,
  },
  homeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vpnContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 20,
  },
});

export default HomeScreen;
