//
//  PhoneConnector.swift
//  BeaconWatch Watch App
//
//  Created by Bao.NguyenH on 8/14/23.
//  Copyright © 2023 Apple. All rights reserved.
//

import Foundation
import WatchConnectivity
import SwiftUI

class PhoneConnector:NSObject,ObservableObject {
        
    static let shared = PhoneConnector()
    
    public let session = WCSession.default
    
    @Published var beacon:String = ""
                
    private override init() {
        super.init()
        if WCSession.isSupported() {
            session.delegate = self
            session.activate()
        }
    }
}

// MARK: - WCSessionDelegate methods
extension PhoneConnector:WCSessionDelegate {
    
    func session(_ session: WCSession, activationDidCompleteWith activationState: WCSessionActivationState, error: Error?) {
        if let error = error {
            print("session activation failed with error: \(error.localizedDescription)")
            return
        }
    }
    
    func session(_ session: WCSession, didReceiveUserInfo userInfo: [String : Any] = [:]) {
        
        dataReceivedFromPhone(userInfo)
    }
    
    // MARK: use this for testing in simulator
    func session(_ session: WCSession, didReceiveMessage message: [String : Any]) {
        dataReceivedFromPhone(message)
    }
    
}

// MARK: - receive dat
extension PhoneConnector {
    
    public func dataReceivedFromPhone(_ info:[String:Any]) {
        let data = info["data"]
        DispatchQueue.main.async {
            self.beacon = data as! String
        }
    }
    
}
