//
//  WatchConnector.swift
//  Beacon Sample
//
//  Created by Bao.NguyenH on 8/14/23.
//  Copyright © 2023 Apple. All rights reserved.
//

import Foundation
import WatchConnectivity
import SwiftUI

class WatchConnector:NSObject {
        
    static let shared = WatchConnector()

    public let session = WCSession.default
         
    private override init(){
        super.init()
        if WCSession.isSupported() {
            session.delegate = self
            session.activate()
        }
    }
}

extension WatchConnector:WCSessionDelegate {
    
    func sessionDidBecomeInactive(_ session: WCSession) {
        session.activate()
    }
    
    func sessionDidDeactivate(_ session: WCSession) {
        session.activate()
    }

    func session(_ session: WCSession, activationDidCompleteWith activationState: WCSessionActivationState, error: Error?) {
        if let error = error {
            print("session activation failed with error: \(error.localizedDescription)")
            return
        }
    }
}

// MARK: - send data to watch
extension WatchConnector {
    
    public func sendDataToWatch(_ uuid: String) {
        let dict:[String:Any] = ["data":uuid]
        NSLog("This is my Data:");
        print(uuid)
    
        session.transferUserInfo(dict)
        // for testing in simulator we use
//        session.sendMessage(dict, replyHandler: nil)
    }
}
