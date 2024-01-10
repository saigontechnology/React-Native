import {takeLatest, delay, put} from 'redux-saga/effects'
import {appActions, userActions} from '../reducers'
import RouteKey from '../../navigation/RouteKey'
import {Toast} from '../../components'
import {changePassword, forgotPassword, resetPassword} from '../../services/api/api'

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
    const res = yield changePassword(action.payload)
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
    const res = yield forgotPassword(action.payload)
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
    const res = yield resetPassword(action.payload)
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
]
