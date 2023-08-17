/*
See LICENSE folder for this sample’s licensing information.

Abstract:
View controller that illustrates how to start and stop ranging for a beacon region.
*/

import UIKit
import CoreLocation

class RangeBeaconViewController: UIViewController, UITableViewDelegate, UITableViewDataSource, CLLocationManagerDelegate {
    
    @IBOutlet weak var tableView: UITableView!
    
    /**
     This hardcoded UUID appears by default in the ranging prompt.
     It is the same UUID used in ConfigureBeaconViewController
     for creating a beacon.
     */
    let defaultUUID = "41A5D617-6A2D-4B2F-9BA4-B717F41A4E39"

    /// This location manager is used to demonstrate how to range beacons.
    var locationManager = CLLocationManager()
    
    var beaconConstraints = [CLBeaconIdentityConstraint: [CLBeacon]]()
    var beacons = [CLProximity: [CLBeacon]]()
    
    override func viewDidLoad() {
        super.viewDidLoad()

        locationManager.delegate = self
    }
    
    override func viewDidDisappear(_ animated: Bool) {
        super.viewDidDisappear(animated)

        // Stop monitoring when the view disappears.
        for region in locationManager.monitoredRegions {
            locationManager.stopMonitoring(for: region)
        }
        
        // Stop ranging when the view disappears.
        for constraint in beaconConstraints.keys {
            locationManager.stopRangingBeacons(satisfying: constraint)
        }
    }

    @IBAction func addBeacon(_ sender: Any) {
        let alert = UIAlertController(title: "Add Beacon Region",
                                      message: "Enter UUID",
                                      preferredStyle: .alert)
        
        var uuidTextField: UITextField!
        
        alert.addTextField { textField in
            textField.placeholder = "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
            textField.text = self.defaultUUID
            uuidTextField = textField
        }
        
        let cancelAction = UIAlertAction(title: "Cancel", style: .cancel, handler: nil)
        let addAction = UIAlertAction(title: "Add", style: .default) { alert in
            if let uuidString = uuidTextField.text, let uuid = UUID(uuidString: uuidString) {
                self.locationManager.requestWhenInUseAuthorization()
                
                // Create a new constraint and add it to the dictionary.
                let constraint = CLBeaconIdentityConstraint(uuid: uuid)
                self.beaconConstraints[constraint] = []
                
                /*
                By monitoring for the beacon before ranging, the app is more
                energy efficient if the beacon is not immediately observable.
                */
                let beaconRegion = CLBeaconRegion(beaconIdentityConstraint: constraint, identifier: uuid.uuidString)
                self.locationManager.startMonitoring(for: beaconRegion)
            } else {
                let invalidAlert = UIAlertController(title: "Invalid UUID",
                                                     message: "Please specify a valid UUID.",
                                                     preferredStyle: .alert)
                
                let okAction = UIAlertAction(title: "OK", style: .cancel, handler: nil)
                invalidAlert.addAction(okAction)
                self.present(invalidAlert, animated: true)
            }
        }
        
        alert.addAction(cancelAction)
        alert.addAction(addAction)
        
        present(alert, animated: true)
    }
    
    // MARK: - Location Manager Delegate
    /// - Tag: didDetermineState
    func locationManager(_ manager: CLLocationManager, didDetermineState state: CLRegionState, for region: CLRegion) {
        let beaconRegion = region as? CLBeaconRegion
        if state == .inside {
            // Start ranging when inside a region.
            manager.startRangingBeacons(satisfying: beaconRegion!.beaconIdentityConstraint)
        } else {
            // Stop ranging when not inside a region.
            manager.stopRangingBeacons(satisfying: beaconRegion!.beaconIdentityConstraint)
        }
    }
    
    /// - Tag: didRange
    func locationManager(_ manager: CLLocationManager, didRange beacons: [CLBeacon], satisfying beaconConstraint: CLBeaconIdentityConstraint) {
        /*
         Beacons are categorized by proximity. A beacon can satisfy
         multiple constraints and can be displayed multiple times.
         */
        beaconConstraints[beaconConstraint] = beacons
        
        self.beacons.removeAll()
        
        var allBeacons = [CLBeacon]()
        
        for regionResult in beaconConstraints.values {
            allBeacons.append(contentsOf: regionResult)
        }
        
        for range in [CLProximity.unknown, .immediate, .near, .far] {
            let proximityBeacons = allBeacons.filter { $0.proximity == range }
            if !proximityBeacons.isEmpty {
                self.beacons[range] = proximityBeacons
            }
            
            if ((proximityBeacons.first?.uuid.uuidString) != nil){
                WatchConnector.shared.sendDataToWatch((proximityBeacons.first?.uuid.uuidString)!)
            }
        }
        
        tableView.reloadData()
    }
    
    // MARK: - Table View Data Source
    
    func tableView(_ tableView: UITableView, titleForHeaderInSection section: Int) -> String? {
        var title: String?
        let sectionKeys = Array(beacons.keys)
        
        // The table view displays beacons by proximity.
        let sectionKey = sectionKeys[section]
        
        switch sectionKey {
            case .immediate:
                title = "Immediate"
            case .near:
                title = "Near"
            case .far:
                title = "Far"
            default:
                title = "Unknown"
        }
        
        return title
    }
    
    func numberOfSections(in tableView: UITableView) -> Int {
        return beacons.count
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return Array(beacons.values)[section].count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "reuseIdentifier", for: indexPath)

        // Display the UUID, major, and minor for each beacon.
        let sectionkey = Array(beacons.keys)[indexPath.section]
        let beacon = beacons[sectionkey]![indexPath.row]
    
        cell.textLabel?.text = "UUID: \(beacon.uuid.uuidString)"
        cell.detailTextLabel?.text = "Major: \(beacon.major) Minor: \(beacon.minor)"
        
        return cell
    }

}
