/*
See LICENSE folder for this sample’s licensing information.

Abstract:
View controller that illustrates how to configure an iOS device as a beacon.
*/

import UIKit
import CoreLocation
import CoreBluetooth

class ConfigureBeaconViewController: UITableViewController, CBPeripheralManagerDelegate, UITextFieldDelegate {
    
    @IBOutlet weak var enabledSwitch: UISwitch!
    @IBOutlet weak var majorTextField: UITextField!
    @IBOutlet weak var minorTextField: UITextField!
    
    let beaconUUID = UUID(uuidString: "E2C56DB5-DFFB-48D2-B060-D0F5A71096E0")
    var major: UInt16 = 0
    var minor: UInt16 = 0
    var enabled = false

    var peripheralManager: CBPeripheralManager!
    var region: CLBeaconRegion!
    var doneButton: UIBarButtonItem!
    
    override func viewDidLoad() {
        super.viewDidLoad()
 
        peripheralManager = CBPeripheralManager(delegate: self, queue: nil, options: nil)
        doneButton = UIBarButtonItem(barButtonSystemItem: .done, target: self, action: #selector(doneEditing))
    }
    
    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        stopBroadcasting()
    }
    
    @IBAction func onSwitch(_ sender: UISwitch) {
        enabled = sender.isOn
        configureBeaconRegion()
    }

    @objc
    func doneEditing() {
        if let majorText = majorTextField.text, let minorText = minorTextField.text, !majorText.isEmpty, !minorText.isEmpty {
            majorTextField.resignFirstResponder()
            minorTextField.resignFirstResponder()
            navigationItem.rightBarButtonItem = nil
            configureBeaconRegion()
            tableView.reloadData()
        }
    }
    
    // Bluetooth must be enabled on the device for it to function as a beacon.
    /// - Tag: configureBeaconRegion
    func configureBeaconRegion() {
        if peripheralManager.state == .poweredOn {
            peripheralManager.stopAdvertising()
            if enabled {
                let bundleURL = Bundle.main.bundleIdentifier!
                
                // Defines the beacon identity characteristics the device broadcasts.
                let constraint = CLBeaconIdentityConstraint(uuid: beaconUUID!, major: major, minor: minor)
                region = CLBeaconRegion(beaconIdentityConstraint: constraint, identifier: bundleURL)
                
                let peripheralData = region.peripheralData(withMeasuredPower: nil) as? [String: Any]
                
                // Start broadcasting the beacon identity characteristics.
                peripheralManager.startAdvertising(peripheralData)
            }
        } else {
            enabledSwitch.setOn(false, animated: false)
            let alert = UIAlertController(title: "Bluetooth must be enabled to configure your device as a beacon.",
                                          message: nil,
                                          preferredStyle: .alert)
            
            let okAction = UIAlertAction(title: "OK", style: .cancel, handler: nil)
            alert.addAction(okAction)
            present(alert, animated: true)
        }
    }
    
    func stopBroadcasting() {
        enabledSwitch.setOn(false, animated: false)
        peripheralManager.stopAdvertising()
    }
    
    // MARK: - Bluetooth Manager Delegate
    
    func peripheralManagerDidUpdateState(_ peripheral: CBPeripheralManager) {
        if peripheral.state == .poweredOff {
            stopBroadcasting()
        }
    }
    
    // MARK: - Text Editing
    
    func textFieldDidBeginEditing(_ textField: UITextField) {
        navigationItem.rightBarButtonItem = doneButton
    }
    
    func textFieldDidEndEditing(_ textField: UITextField) {
        if let text = textField.text, !text.isEmpty {
            if textField == majorTextField {
                major = UInt16(text) ?? 0
            } else if textField == minorTextField {
                minor = UInt16(text) ?? 0
            }
        }
    }

}
