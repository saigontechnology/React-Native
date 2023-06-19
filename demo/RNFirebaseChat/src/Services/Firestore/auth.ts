import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';

const signInAnonymous = async (
  successCallback?: (user: FirebaseAuthTypes.UserCredential) => void,
  errorCallback?: (error: any) => void,
) => {
  auth()
    .signInAnonymously()
    .then(user => {
      successCallback?.(user);
    })
    .catch(error => {
      errorCallback?.(error);
      if (error.code === 'auth/operation-not-allowed') {
        console.log('Enable anonymous in your firebase console.');
      }
    });
};

const signOut = async (
  successCallback?: () => void,
  errorCallback?: (error: any) => void,
) => {
  auth()
    .signOut()
    .then(() => {
      successCallback?.();
    })
    .catch(error => {
      errorCallback?.(error);
    });
};

export {signInAnonymous, signOut};
