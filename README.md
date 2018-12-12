# Instorm App
React Native Application for musical instruments recognition with Tensorflow

To set it up on your Mac, first install Node.JS with NPM.

Then run
```bash
npm install -g react-native
```
Clone the repository
```bash
git clone "https://github.com/Moccko/InstormApp.git"
cd InstormApp
npm install
react-native link
```
Open XCode, create a new project from InstormApp/ios/InstormApp.xcodeproj

Open each target (InstormApp, InstormAppTests, InstormApp-tvOS, InstormApp-tvOSTests) and define a team (to create the certificates)

## Run on iOS simulator
You can run on the simulator by simply use `Build and Run`

## Run on an iOS device
You must first go to `Product > Destination` and add your device to the device manager. Then you can select your device in `Product > Destination > Your device` and it will run it automatically on your device.
Once it is built and installed on your device, you have to run
```react-native start```
or
```npm start```
on your computer in the InstormApp directory to open the Metro canal on the port 8081. You can reopen the app on your device if your device and your Mac are on the same network.
