export default class PasswordModel {
  constructor(data) {
    this.data = data
  }

  static parseFromJson = payload => {
    const obj = new PasswordModel()
    const {data} = payload
    obj.data = data
    return obj
  }
}
