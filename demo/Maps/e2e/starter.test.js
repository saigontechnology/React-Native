import {by, device, element, waitFor} from 'detox'

describe('Example', () => {
  beforeAll(async () => {
    await device.launchApp()
    await waitFor(element(by.id('client-id-input'))).toExist()
  })

  beforeEach(async () => {
    await device.reloadReactNative()
  })

  it('should allow user to login with valid credentials', async () => {
    const clientId = 'oO8BMTesSg9Vl3_jAyKpbOd2fIEa'
    const clientSecret = '0Exp4dwqmpON_ezyhfm0o_Xkowka'

    // Enter the client ID
    await element(by.id('client-id-input')).typeText(clientId)
    await element(by.id('client-id-input')).tapReturnKey()

    // Enter the client secret
    await element(by.id('client-secret-input')).typeText(clientSecret)
    await element(by.id('client-secret-input')).tapReturnKey()

    // Tap the login button
    await element(by.id('login-button')).tap()

    // Verify that the user is logged in
    await expect(element(by.text('ASCENDING'))).toBeVisible()
  })

  it('should display an error message with invalid credentials', async () => {
    const clientId = 'invalid_client_id'
    const clientSecret = 'invalid_client_secret'

    // Enter the client ID
    await element(by.id('client-id-input')).typeText(clientId)
    await element(by.id('client-id-input')).tapReturnKey()

    // Enter the client secret
    await element(by.id('client-secret-input')).typeText(clientSecret)
    await element(by.id('client-secret-input')).tapReturnKey()

    // Tap the login button
    await element(by.id('login-button')).tap()

    // Verify that an error message is displayed
    await expect(element(by.text('ASCENDING'))).not.toBeVisible()
  })
})
