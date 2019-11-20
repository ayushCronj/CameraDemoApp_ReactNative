import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  TouchableOpacity
} from "react-native";
import * as Permissions from "expo-permissions";
import { Camera } from "expo-camera";
import { FontAwesome } from "@expo/vector-icons";

export default class CameraScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasCameraPermission: null,
      type: Camera.Constants.Type.back,
      isFlashOn: Camera.Constants.FlashMode.off
    };
  }

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === "granted"
    });
  }

  flipCamera = () => {
    this.setState({
      type:
        this.state.type === Camera.Constants.Type.back
          ? Camera.Constants.Type.front
          : Camera.Constants.Type.back
    });
  };

  flipFlashLight = () => {
    this.setState({
      isFlashOn:
        this.state.isFlashOn === Camera.Constants.FlashMode.off
          ? Camera.Constants.FlashMode.on
          : Camera.Constants.FlashMode.off
    });
  };

  takePicture = async () => {
    if (this.camera) {
      let photo = await this.camera.takePictureAsync();
      this.props.navigation.navigate("Home", { photo: photo });
    }
  };

  static navigationOption = {
    title: "Camera"
  };

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return (
        <View>
          <Text> No Camera Permission</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <Camera
            style={styles.cameraView}
            type={this.state.type}
            flashMode={this.state.isFlashOn}
            ref={ref => {
              this.camera = ref;
            }}>
            <View style={styles.actionContainer}>
              <TouchableOpacity
                style={styles.iconHolder}
                onPress={() => {
                  this.flipCamera();
                }}>
                <FontAwesome name="camera" size={35} style={styles.icon} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconHolder}
                onPress={() => {
                  this.takePicture();
                }}>
                <FontAwesome name="circle" size={35} style={styles.icon} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconHolder}
                onPress={() => {
                  this.flipFlashLight();
                }}>
                <FontAwesome name="flash" size={35} style={styles.icon} />
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
    // backgroundColor: "#fff",
    // alignItems: "center",
    // justifyContent: "center"
  },
  actionContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent"
  },
  cameraView: { flex: 1 },
  iconHolder: {
    flex: 1,
    alignItems: "center",
    alignSelf: "flex-end"
  },
  icon: {
    marginBottom: 10,
    color: "white"
  }
});
