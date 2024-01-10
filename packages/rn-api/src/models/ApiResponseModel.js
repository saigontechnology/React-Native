export class ApiResponseModel {
  constructor(message, errorCode, data, isSuccess) {
    this.message = message
    this.errorCode = errorCode
    this.data = data
    this.isSuccess = isSuccess
  }

  static parseFromJson = payload => {
    const {message, errorCode, data, isSuccess} = payload
    return new ApiResponseModel(message, errorCode, data, isSuccess)
  }
}
