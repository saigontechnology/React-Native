import {ApiResponseModel} from '../ApiResponseModel'

export class PasswordModel extends ApiResponseModel {
  constructor(message, errorCode, data, isSuccess) {
    super(message, errorCode, data, isSuccess)
  }

  static parseFromJson = payload => {
    const {message, errorCode, data, isSuccess} = payload

    // Customize the 'data' property in PasswordModel
    const customizedData = {
      password: data?.password ?? '',
    }

    return new PasswordModel(message, errorCode, customizedData, isSuccess)
  }
}
