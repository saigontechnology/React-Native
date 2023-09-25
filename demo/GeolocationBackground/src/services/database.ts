import database from '@react-native-firebase/database';

export const DatabaseRef = database().ref('/').push();
