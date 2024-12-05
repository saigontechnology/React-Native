# Demo: Skia and Camera processor

[Link Record for Demo](https://saigontechnology0-my.sharepoint.com/:v:/r/personal/loc_nguyent_saigontechnology_com/Documents/Recordings/%5BSDC1%20-%20Tech-Talk%5D%20-%20loc.nguyent%20-%20Introduction%20to%20Skia%20and%20Camera%20Processor%20(Filter)-20241203_140519-Meeting%20Recording.mp4?csf=1&web=1&nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJPbmVEcml2ZUZvckJ1c2luZXNzIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXciLCJyZWZlcnJhbFZpZXciOiJNeUZpbGVzTGlua0NvcHkifX0&e=bxeTjw)

# React Native Skia & Camera Processor Demo

This repository showcases a demo project implementing **Skia** for React Native, focusing on creating graphical effects and animations, along with a camera processor using **react-native-vision-camera**. The demo is split into two main parts:

1. **Implementing Skia for React Native**
2. **Implementing Camera Processor for Face Detection and Skia Filtering**

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Getting Started](#getting-started)
- [Skia Implementation](#skia-implementation)
  - [Basic Skia Components](#basic-skia-components)
  - [Animations with Atlas and Reanimated](#animations-with-atlas-and-reanimated)
  - [Shader Effects in Skia](#shader-effects-in-skia)
- [Camera Processor](#camera-processor)
  - [Face Detection](#face-detection)
  - [Skia Camera Filtering Effects](#skia-camera-filtering-effects)
- [Contributing](#contributing)
- [License](#license)

## Introduction

This project demonstrates how to use **Skia** and **react-native-vision-camera** in a React Native application to create rich visual effects and custom camera features. The first part of the demo focuses on using **react-native-skia** to work with graphics, shaders, and animations. The second part demonstrates how to use the camera with **face detection** and apply **Skia-based filtering effects**.

## Features

- **Skia Graphics**: Basic usage of Skia components for drawing and rendering.
- **Animations**: Creating animations using **Atlas** and **react-native-reanimated**.
- **Shader Effects**: Applying custom shaders in Skia for visual effects.
- **Camera Processor**: Implementing a camera with **face detection** and **Skia-based filters** for real-time effects like brightening, black and white, and color manipulation.

## Getting Started

>**Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.

## Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# using npm
npm start

# OR using Yarn
yarn start
```

## Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

### For iOS

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.

## Skia Implementation

### Basic Skia Components

This section demonstrates the use of **react-native-skia** to create basic graphics, such as shapes, paths, and gradients. The demo includes examples like drawing circles, rectangles, and custom paths to help you get familiar with the core components of Skia.

<img src='https://github.com/user-attachments/assets/01c08fda-3e12-44ee-b104-515039516d27' width="1200" height="400" />

### Animations with Atlas and Reanimated

Here, you'll learn how to add animations using **Atlas** and **react-native-reanimated** to create visually appealing effects. The demo showcases smooth transitions, scaling effects, and more to illustrate the power of animations within Skia.

<video width="344" height="450" controls>
  <source src="https://github.com/user-attachments/assets/60b6e2ec-c9b9-4e94-beb6-75bc25d5f5f0" type="video/mp4">
  Your browser does not support the video tag.
</video>

### Shader Effects in Skia

In this section, you'll explore how to use **Shaders** in Skia to apply advanced visual effects. Examples include creating gradient shaders, pixel-level manipulations, and more to enrich the graphical experience.

<video width="324" height="600" controls>
  <source src="https://github.com/user-attachments/assets/8f358690-2cc2-4df7-8e15-31b06c179680" type="video/mp4">
  Your browser does not support the video tag.
</video>

## Camera Processor

### Face Detection

Using **react-native-vision-camera**, this section demonstrates how to implement face detection. The app uses real-time processing to identify faces within the camera frame, which can then be used to trigger specific visual effects or UI interactions.

<video width="270" height="600" controls>
  <source src="https://github.com/user-attachments/assets/7d69966b-6cfe-4b5c-aa17-25148cc889e2" type="video/mp4">
  Your browser does not support the video tag.
</video>

### Skia Camera Filtering Effects

This part of the demo integrates Skia with the camera to apply **filtering effects** in real time. Filters include:

- **Brighten Effect**: Enhances the brightness of the camera feed.
- **Black and White Effect**: Converts the camera feed to black and white.
- **Color Manipulation**: Changes color settings to create unique visual effects, offering users a fun and creative experience.

<video width="270" height="600" controls>
  <source src="https://github.com/user-attachments/assets/e402c884-6d8a-454f-a5f4-44a8028aa68d" type="video/mp4">
  Your browser does not support the video tag.
</video>

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request if you have any suggestions or improvements. For major changes, open an issue first to discuss your proposed changes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Feel free to explore the features and modify the code as you see fit. We hope this demo helps you get started with React Native Skia and camera processing!

