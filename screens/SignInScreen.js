import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  Heading,
  VStack,
  FormControl,
  Input,
  Link,
  Button,
  HStack,
  Center,
  Icon,
  WarningOutlineIcon,
} from "native-base";
import { MaterialIcons, Entypo } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { connect } from "react-redux";
import myWalletAPI from "../api/myWallet";

const SignInScreen = (props) => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [errorMessage, setErrorMessage] = useState([]);

  const handleErrorMessage = (field, errorArray) => {
    return errorArray.length > 0 && errorArray.find((el) => el.param === field)
      ? errorArray.find((el) => el.param === field).msg
      : null;
  };

  useEffect(() => {
    console.log("<-----------LOGIN----------->");
    AsyncStorage.getItem("userData", function (err, data) {
      let userData = JSON.parse(data);
      if (userData) {
        if (props.authData.length === 0) props.onLogin(userData);

        myWalletAPI
          .post("/users/sign-in-token", { token: userData.token })
          .then((response) => {
            if (response.data.result) props.navigation.navigate("bottomNav");
          });
      }
    });
    // AsyncStorage.clear();
  }, []);

  const login = () => {
    myWalletAPI
      .post("/users/sign-in", {
        email: email,
        password: password,
      })
      .then((response) => {
        if (response.data.errors) {
          setErrorMessage(response.data.errors);
        } else if (response.data.result) {
          const userData = {
            firstName: response.data.firstName,
            token: response.data.userToken,
          };
          AsyncStorage.setItem("userData", JSON.stringify(userData));
          setEmail("");
          setPassword("");
          if (props.authData.length === 0) props.onLogin(userData);
          props.navigation.navigate("bottomNav");
        }
      });
  };

  return (
    <Center
      flex={1}
      _dark={{ bg: "blueGray.900" }}
      _light={{ bg: "blueGray.50" }}
    >
      <Box safeArea p="2" py="8" w="90%" maxW="290">
        <Heading
          size="2xl"
          fontWeight="600"
          color="coolGray.800"
          _dark={{
            color: "warmGray.50",
          }}
        >
          myWallet
        </Heading>
        <Heading
          mt="1"
          _dark={{
            color: "warmGray.200",
          }}
          color="coolGray.600"
          fontWeight="medium"
          size="xs"
        >
          Sign in to continue!
        </Heading>

        <VStack space={3} mt="5">
          <FormControl
            isRequired
            isInvalid={handleErrorMessage("email", errorMessage) ? true : false}
          >
            <Input
              _focus={{ borderColor: "violet.900" }}
              InputLeftElement={
                <Icon
                  as={<MaterialIcons name="mail" />}
                  size={5}
                  ml="2"
                  color="muted.400"
                />
              }
              placeholder="E-mail"
              size="xl"
              value={email}
              onChangeText={(email) => setEmail(email)}
            />
            <FormControl.ErrorMessage
              leftIcon={<WarningOutlineIcon size="xs" />}
            >
              {handleErrorMessage("email", errorMessage)}
            </FormControl.ErrorMessage>
          </FormControl>
          <FormControl
            isRequired
            isInvalid={
              handleErrorMessage("password", errorMessage) ? true : false
            }
          >
            <Input
              _focus={{ borderColor: "violet.900" }}
              type="password"
              InputLeftElement={
                <Icon
                  as={<Entypo name="key" />}
                  size={5}
                  ml="2"
                  color="muted.400"
                />
              }
              placeholder="Password"
              size="xl"
              value={password}
              onChangeText={(password) => setPassword(password)}
            />
            <FormControl.ErrorMessage
              leftIcon={<WarningOutlineIcon size="xs" />}
            >
              {handleErrorMessage("password", errorMessage)}
            </FormControl.ErrorMessage>
          </FormControl>
          <Button
            mt="2"
            _dark={{ bg: "violet.900" }}
            colorScheme="violet"
            onPress={() => login()}
          >
            Sign In
          </Button>
          <HStack mt="6" justifyContent="center">
            <Text
              fontSize="sm"
              color="coolGray.600"
              _dark={{
                color: "warmGray.200",
              }}
            >
              Are you a new user ?{" "}
            </Text>
            <Link
              _text={{
                color: "violet.500",
                fontWeight: "medium",
                fontSize: "sm",
              }}
              onPress={() => props.navigation.navigate("Sign-up")}
            >
              Sign up
            </Link>
          </HStack>
        </VStack>
      </Box>
    </Center>
  );
};

function mapStateToProps(state) {
  return { authData: state.authData };
}

function mapDispatchToProps(dispatch) {
  return {
    onLogin: function (userData) {
      dispatch({ type: "LOGIN", userData });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SignInScreen);
