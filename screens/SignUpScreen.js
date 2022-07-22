import React, { useState } from "react";
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
  WarningOutlineIcon,
  Icon,
  KeyboardAvoidingView,
} from "native-base";
import { MaterialIcons, Entypo } from "@expo/vector-icons";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { connect } from "react-redux";
import myWalletAPI from "../api/myWallet";

const SignUpScreen = (props) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState([]);

  const handleErrorMessage = (field, errorArray) => {
    return errorArray.length > 0 && errorArray.find((el) => el.param === field)
      ? errorArray.find((el) => el.param === field).msg
      : null;
  };

  const signUp = () => {
    myWalletAPI
      .post("/users/sign-up", {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
      })
      .then((response) => {
        if (response.data.errors) {
          setErrorMessage(response.data.errors);
        } else if (response.data.result) {
          const userData = JSON.stringify({
            firstName: response.data.firstName,
            token: response.data.userToken,
          });
          AsyncStorage.setItem("userData", userData);
          props.onLogin(JSON.parse(userData));
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
          Sign up to continue!
        </Heading>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <VStack space={3} mt="5">
            <FormControl
              isRequired
              isInvalid={
                handleErrorMessage("firstName", errorMessage) ? true : false
              }
            >
              <Input
                _focus={{ borderColor: "violet.900" }}
                InputLeftElement={
                  <Icon
                    as={<MaterialIcons name="person" />}
                    size={5}
                    ml="2"
                    color="muted.400"
                  />
                }
                placeholder="First name"
                size="xl"
                value={firstName}
                onChangeText={(firstName) => setFirstName(firstName)}
              />
              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                {handleErrorMessage("firstName", errorMessage)}
              </FormControl.ErrorMessage>
            </FormControl>
            <FormControl
              isRequired
              isInvalid={
                handleErrorMessage("lastName", errorMessage) ? true : false
              }
            >
              <Input
                _focus={{ borderColor: "violet.900" }}
                InputLeftElement={
                  <Icon
                    as={<MaterialIcons name="person" />}
                    size={5}
                    ml="2"
                    color="muted.400"
                  />
                }
                placeholder="Last name"
                size="xl"
                value={lastName}
                onChangeText={(lastName) => setLastName(lastName)}
              />
              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                {handleErrorMessage("lastName", errorMessage)}
              </FormControl.ErrorMessage>
            </FormControl>
            <FormControl
              isRequired
              isInvalid={
                handleErrorMessage("email", errorMessage) ? true : false
              }
            >
              <Input
                _focus={{ borderColor: "violet.900" }}
                type="email"
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
              onPress={() => signUp()}
            >
              Sign Up
            </Button>
            <HStack mt="6" justifyContent="center">
              <Text
                fontSize="sm"
                color="coolGray.600"
                _dark={{
                  color: "warmGray.200",
                }}
              >
                Already have an account ?{" "}
              </Text>
              <Link
                _text={{
                  color: "violet.500",
                  fontWeight: "medium",
                  fontSize: "sm",
                }}
                onPress={() => props.navigation.navigate("Sign-in")}
              >
                Sign in
              </Link>
            </HStack>
          </VStack>
        </KeyboardAvoidingView>
      </Box>
    </Center>
  );
};

function mapDispatchToProps(dispatch) {
  return {
    onLogin: function (userData) {
      dispatch({ type: "LOGIN", userData });
    },
  };
}

export default connect(null, mapDispatchToProps)(SignUpScreen);
