import React from "react";
import { connect } from "react-redux";
import { Button, Text, Center, Box } from "native-base";
import { AntDesign, Entypo } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LogOutScreen = (props) => {
  const logOut = () => {
    AsyncStorage.clear();
    props.onLogout();
    props.navigation.navigate("Sign-in");
  };

  const user = props.authData[0].firstName;
  return (
    <Center
      height="100%"
      _dark={{ bg: "blueGray.900" }}
      justifyContent="space-around"
    >
      <Center width={"80%"} height={"80%"} rounded={"xl"}>
        <Center _dark={{ bg: "blueGray.300" }} rounded="3xl" p="2" mb="10%">
          <Entypo name="user" size={120} color="black" />
        </Center>

        <Center justifyContent="space-around" height="25%">
          <Text fontSize="xl">This is {user}'s account</Text>
        </Center>

        <Center>
          <Button
            _dark={{ bg: "blueGray.700" }}
            leftIcon={<AntDesign name="logout" size={24} color="red" />}
            rounded="xl"
            height="30%"
            w="35%"
            onPress={() => logOut()}
          >
            Log out
          </Button>
        </Center>
      </Center>
    </Center>
  );
};

function mapStateToProps(state) {
  return { authData: state.authData };
}

function mapDispatchToProps(dispatch) {
  return {
    onLogout: function () {
      dispatch({ type: "LOGOUT" });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LogOutScreen);
