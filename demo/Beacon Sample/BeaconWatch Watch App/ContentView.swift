//
//  ContentView.swift
//  BeaconWatch Watch App
//
//  Created by Bao.NguyenH on 8/14/23.
//  Copyright © 2023 Apple. All rights reserved.
//

import SwiftUI

struct ContentView: View {
    @ObservedObject var connector = PhoneConnector.shared
    
    @State private var uuid:String = ""
    
    var body: some View {
        VStack {
            Image(systemName: "globe")
                .imageScale(.large)
                .foregroundColor(.accentColor)
            Text("UUID : \(connector.beacon )")
        }
        .padding()
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
