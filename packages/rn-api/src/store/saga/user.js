import {takeLatest, delay, put} from 'redux-saga/effects'
import {appActions, userActions} from '../reducers'
import RouteKey from '../../navigation/RouteKey'
import {Toast} from '../../components'
import {
  changePassword,
  forgotPassword,
  getUserProfile,
  resetPassword,
  updateUserProfile,
} from '../../services/api/api'

function* userLoginSaga(action) {
  try {
    yield put(appActions.setShowGlobalIndicator(true))
    // TODO: login login
    yield delay(1000)
    yield put(appActions.setAppStack(RouteKey.MainStack))
  } catch (e) {
    Toast.error(e.message)
    yield put(appActions.setAppStack(RouteKey.AuthStack))
  } finally {
    yield put(appActions.setShowGlobalIndicator(false))
  }
}

function* userSignUpSaga(action) {
  try {
    yield put(appActions.setShowGlobalIndicator(true))
  } catch (e) {
    Toast.error(e.message)
  } finally {
    yield put(appActions.setShowGlobalIndicator(false))
  }
}

function* userChangePasswordSaga(action) {
  try {
    yield put(appActions.setShowGlobalIndicator(true))
    const res = yield changePassword(action.body)
    if (res?.isSuccess === true) {
      yield put(userActions.changePasswordSuccess(res))
      Toast.success('SUCCESSFULLY')
      // TODO:
    }
  } catch (e) {
    Toast.error(e.message)
  } finally {
    yield put(appActions.setShowGlobalIndicator(false))
  }
}

function* userForgotPasswordSaga(action) {
  try {
    yield put(appActions.setShowGlobalIndicator(true))
    const res = yield forgotPassword(action.body)
    if (res?.isSuccess === true) {
      yield put(userActions.forgotPasswordSuccess(res))
      Toast.success('SUCCESSFULLY')
      // TODO:
    }
  } catch (e) {
    Toast.error(e.message)
  } finally {
    yield put(appActions.setShowGlobalIndicator(false))
  }
}

function* userResetPasswordSaga(action) {
  try {
    yield put(appActions.setShowGlobalIndicator(true))
    const res = yield resetPassword(action.body)
    if (res?.isSuccess === true) {
      yield put(userActions.resetPasswordSuccess(res))
      Toast.success('SUCCESSFULLY')
      // TODO:
    }
  } catch (e) {
    Toast.error(e.message)
  } finally {
    yield put(appActions.setShowGlobalIndicator(false))
  }
}

function* userGetUserProfileSaga(action) {
  try {
    yield put(appActions.setShowGlobalIndicator(true))
    const res = yield getUserProfile(action.id)
    if (res?.isSuccess === true) {
      Toast.success('SUCCESSFULLY')
      yield put(userActions.getUserProfileSuccess(res))
    }
  } catch (e) {
    Toast.error(e.message)
    yield put(userActions.getUserProfileFailure)
  } finally {
    yield put(appActions.setShowGlobalIndicator(false))
  }
}

function* userUpdateInfoSaga(action) {
  try {
    yield put(appActions.setShowGlobalIndicator(true))
    const res = yield updateUserProfile(action.id, action.body)
    if (res?.isSuccess === true) {
      Toast.success('SUCCESSFULLY')
      yield put(userActions.getUserProfileSuccess(res))
    }
  } catch (e) {
    Toast.error(e.message)
    yield put(userActions.updateUserProfileFailure)
  } finally {
    yield put(appActions.setShowGlobalIndicator(false))
  }
}

function* userLogout() {
  try {
  } catch (e) {}
}

export default [
  takeLatest(userActions.userLogin.type, userLoginSaga),
  takeLatest(userActions.userSignUp.type, userSignUpSaga),
  takeLatest(userActions.logout.type, userLogout),
  takeLatest(userActions.changePasswordHandle, userChangePasswordSaga),
  takeLatest(userActions.forgotPasswordHandle, userForgotPasswordSaga),
  takeLatest(userActions.resetPasswordHandle, userResetPasswordSaga),
  takeLatest(userActions.getUserProfileHandle, userGetUserProfileSaga),
  takeLatest(userActions.updateUserProfileHandle, userUpdateInfoSaga),
]
