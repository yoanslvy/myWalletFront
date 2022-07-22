import React, { useState } from "react";
import { Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  Button,
  Box,
  Text,
  Center,
  Select,
  CheckIcon,
  VStack,
  Input,
  ScrollView,
  FormControl,
  WarningOutlineIcon,
} from "native-base";
import { connect } from "react-redux";
import myWalletAPI from "../api/myWallet";

function EditTransactionScreen(props) {
  const token = props.authData[0].token;
  const user = props.authData[0].firstName;

  const [type, setType] = useState(props.route.params.transaction.type);

  const [platform, setPlatform] = useState(
    props.route.params.transaction.platform
  );
  const [pair, setPair] = useState(props.route.params.transaction.pair);
  const [price, setPrice] = useState(
    props.route.params.transaction.price !== null
      ? props.route.params.transaction.price.toString()
      : ""
  );
  const [quantity, setQuantity] = useState(
    props.route.params.transaction.quantity.toString()
  );
  const [fees, setFees] = useState(
    props.route.params.transaction.fees !== null
      ? props.route.params.transaction.fees.toString()
      : ""
  );
  const [from, setFrom] = useState(props.route.params.transaction.from);
  const [to, setTo] = useState(props.route.params.transaction.to);
  const [date, setDate] = useState(
    new Date(props.route.params.transaction.date)
  );
  const [mode, setMode] = useState("date");
  const [errorMessage, setErrorMessage] = useState([]);

  // Date Input
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
    if (event.type === "set" && mode === "date") {
      showTimepicker();
    } else if (event.type === "set" && mode === "time") {
      setShow(false);
    }
  };

  const handleErrorMessage = (field, errorArray) => {
    return errorArray.length > 0 && errorArray.find((el) => el.param === field)
      ? errorArray.find((el) => el.param === field).msg
      : null;
  };

  const showMode = (currentMode) => {
    setMode(currentMode);
    setShow(true);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const showTimepicker = () => {
    showMode("time");
  };

  const datePicker = (
    <>
      {Platform.OS !== "ios" ? (
        <Center>
          <Center style={{ flexDirection: "row", marginTop: "5%" }}>
            <Button
              w="40%"
              mx="5%"
              _dark={{ bg: "blueGray.800" }}
              rounded="sm"
              py="3"
              _text={{
                fontSize: "sm",
                fontWeight: "light",
              }}
              variant="bordered"
              onPress={() => showDatepicker()}
            >
              Indicate date
            </Button>
          </Center>
          <Text mt="3">{date.toString()}</Text>
        </Center>
      ) : (
        <Box style={{ flexDirection: "row", flex: 1, alignSelf: "flex-start" }}>
          <DateTimePicker
            testID="datePicker"
            value={date}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={onChange}
            themeVariant="dark"
            style={{
              width: "30%",
              marginTop: "5%",
              marginLeft: "2%",
              marginRight: "2%",
            }}
          />
          <DateTimePicker
            testID="datePicker"
            value={date}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={onChange}
            themeVariant="dark"
            style={{
              width: "20%",
              marginTop: "5%",
            }}
          />
        </Box>
      )}

      {show && Platform.OS !== "ios" && (
        <DateTimePicker
          testID="datePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChange}
          themeVariant="dark"
          style={{
            width: "34%",
            marginBottom: "-1%",
            marginTop: "5%",
          }}
        />
      )}
    </>
  );

  const editTransaction = () => {
    const regex = /,/g;

    myWalletAPI
      .put("/transactions/update-transaction", {
        _id: props.route.params.transaction._id,
        token,
        type: props.route.params.transaction.type,
        id: props.route.params.transaction.crypto,
        platform: type !== "transfer" ? platform : "0",
        pair,
        date,
        price: type !== "transfer" ? price.replace(regex, ".") : "0",
        quantity: quantity.replace(regex, "."),
        fees: fees.replace(regex, "."),
        from: type === "transfer" ? from : "0",
        to: type === "transfer" ? to : "0",
      })
      .then((response) => {
        if (response.data.errors) setErrorMessage(response.data.errors);
        else {
          props.navigation.navigate("ListTransactions", {
            id: props.route.params.transaction.crypto,
            symbol: props.route.params.symbol,
            currentPrice: props.route.params.currentPrice,
            totalQuantity:
              type === "buy"
                ? props.route.params.totalQuantity -
                  Number(props.route.params.transaction.quantity) +
                  Number(quantity)
                : type === "sell"
                ? props.route.params.totalQuantity +
                  Number(props.route.params.transaction.quantity) -
                  Number(quantity)
                : props.route.params.totalQuantity +
                  Number(props.route.params.transaction.fees) -
                  Number(fees),
          });
        }
      });
  };

  let inputs;
  if (props.route.params.transaction.type === "buy") {
    // Initialisation des champs de sélection
    const exchanges = [
      "Binance",
      "Coinbase",
      "Crypto.com",
      "Huobi Global",
      "KuCoin",
      "FTX",
      "Gate.io",
      "Kraken",
      "Bitfinex",
      "Binance US",
    ];

    const listExchanges = exchanges.map((exchange, i) => {
      return <Select.Item key={i} label={exchange} value={exchange} />;
    });

    const paires = [props.route.params.symbol.toUpperCase() + "/EUR"];

    const listPaires = paires.map((pair, i) => {
      return <Select.Item key={i} label={pair} value={pair} />;
    });

    inputs = (
      <>
        <VStack mt="20px" alignItems="center" px="2" space={4}>
          <FormControl
            isRequired
            isInvalid={
              handleErrorMessage("platform", errorMessage) ? true : false
            }
          >
            <Select
              selectedValue={platform}
              minW="100%"
              height="12"
              placeholder="Platform"
              _selectedItem={{
                bg: "violet.900",
                endIcon: <CheckIcon size="5" />,
              }}
              onValueChange={(itemValue) => setPlatform(itemValue)}
            >
              {listExchanges}
            </Select>
            <FormControl.ErrorMessage
              leftIcon={<WarningOutlineIcon size="xs" />}
            >
              {handleErrorMessage("platform", errorMessage)}
            </FormControl.ErrorMessage>
          </FormControl>
          <FormControl
            isRequired
            isInvalid={handleErrorMessage("pair", errorMessage) ? true : false}
          >
            <Select
              selectedValue={pair}
              minW="100%"
              height="12"
              placeholder="Exchange pair"
              _selectedItem={{
                bg: "violet.900",
                endIcon: <CheckIcon size="5" />,
              }}
              onValueChange={(itemValue) => setPair(itemValue)}
            >
              {listPaires}
            </Select>
            <FormControl.ErrorMessage
              leftIcon={<WarningOutlineIcon size="xs" />}
            >
              {handleErrorMessage("pair", errorMessage)}
            </FormControl.ErrorMessage>
          </FormControl>
          <FormControl
            isRequired
            isInvalid={handleErrorMessage("price", errorMessage) ? true : false}
          >
            <Input
              _focus={{ borderColor: "violet.900" }}
              placeholder="Buying Price"
              minW="100%"
              height="12"
              type="number"
              value={price}
              onChangeText={(itemValue) => setPrice(itemValue)}
            />
            <FormControl.ErrorMessage
              leftIcon={<WarningOutlineIcon size="xs" />}
            >
              {handleErrorMessage("price", errorMessage)}
            </FormControl.ErrorMessage>
          </FormControl>
          <FormControl
            isRequired
            isInvalid={
              handleErrorMessage("quantity", errorMessage) ? true : false
            }
          >
            <Input
              _focus={{ borderColor: "violet.900" }}
              placeholder="Quantity"
              minW="100%"
              height="12"
              value={quantity}
              onChangeText={(itemValue) => setQuantity(itemValue)}
            />
            <FormControl.ErrorMessage
              leftIcon={<WarningOutlineIcon size="xs" />}
            >
              {handleErrorMessage("quantity", errorMessage)}
            </FormControl.ErrorMessage>
          </FormControl>
          <Input
            _focus={{ borderColor: "violet.900" }}
            placeholder="Platform fees"
            minW="100%"
            height="12"
            value={fees}
            onChangeText={(itemValue) => setFees(itemValue)}
          />
        </VStack>

        {datePicker}
      </>
    );
  } else if (props.route.params.transaction.type === "sell") {
    // Initialisation des champs de sélection
    const exchanges = [
      "Binance",
      "Coinbase",
      "Crypto.com",
      "Huobi Global",
      "KuCoin",
      "FTX",
      "Gate.io",
      "Kraken",
      "Bitfinex",
      "Binance US",
    ];

    const listExchanges = exchanges.map((exchange, i) => {
      return <Select.Item key={i} label={exchange} value={exchange} />;
    });

    const paires = [props.route.params.symbol.toUpperCase() + "/EUR"];

    const listPaires = paires.map((pair, i) => {
      return <Select.Item key={i} label={pair} value={pair} />;
    });

    inputs = (
      <>
        <VStack mt="20px" alignItems="center" px="2" space={4}>
          <FormControl
            isRequired
            isInvalid={
              handleErrorMessage("platform", errorMessage) ? true : false
            }
          >
            <Select
              selectedValue={platform}
              minW="100%"
              height="12"
              placeholder="Platform"
              _selectedItem={{
                bg: "violet.900",
                endIcon: <CheckIcon size="5" />,
              }}
              onValueChange={(itemValue) => setPlatform(itemValue)}
            >
              {listExchanges}
            </Select>
            <FormControl.ErrorMessage
              leftIcon={<WarningOutlineIcon size="xs" />}
            >
              {handleErrorMessage("platform", errorMessage)}
            </FormControl.ErrorMessage>
          </FormControl>
          <FormControl
            isRequired
            isInvalid={handleErrorMessage("pair", errorMessage) ? true : false}
          >
            <Select
              selectedValue={pair}
              minW="100%"
              height="12"
              placeholder="Exchange pair"
              _selectedItem={{
                bg: "violet.900",
                endIcon: <CheckIcon size="5" />,
              }}
              onValueChange={(itemValue) => setPair(itemValue)}
            >
              {listPaires}
            </Select>
            <FormControl.ErrorMessage
              leftIcon={<WarningOutlineIcon size="xs" />}
            >
              {handleErrorMessage("pair", errorMessage)}
            </FormControl.ErrorMessage>
          </FormControl>
          <FormControl
            isRequired
            isInvalid={handleErrorMessage("price", errorMessage) ? true : false}
          >
            <Input
              _focus={{ borderColor: "violet.900" }}
              placeholder="Selling Price"
              minW="100%"
              height="12"
              value={price}
              onChangeText={(itemValue) => setPrice(itemValue)}
            />
            <FormControl.ErrorMessage
              leftIcon={<WarningOutlineIcon size="xs" />}
            >
              {handleErrorMessage("price", errorMessage)}
            </FormControl.ErrorMessage>
          </FormControl>
          <FormControl
            isRequired
            isInvalid={
              handleErrorMessage("quantity", errorMessage) ? true : false
            }
          >
            <Input
              _focus={{ borderColor: "violet.900" }}
              placeholder="Quantity"
              minW="100%"
              height="12"
              value={quantity}
              onChangeText={(itemValue) => setQuantity(itemValue)}
            />
            <FormControl.ErrorMessage
              leftIcon={<WarningOutlineIcon size="xs" />}
            >
              {handleErrorMessage("quantity", errorMessage)}
            </FormControl.ErrorMessage>
          </FormControl>
          <Input
            _focus={{ borderColor: "violet.900" }}
            placeholder="Platform fees"
            minW="100%"
            height="12"
            value={fees}
            onChangeText={(itemValue) => setFees(itemValue)}
          />
        </VStack>

        {datePicker}
      </>
    );
  } else if (props.route.params.transaction.type === "transfer") {
    // Initialisation des champs de sélection
    const exchanges = [
      "Binance",
      "Coinbase",
      "Crypto.com",
      "Huobi Global",
      "KuCoin",
      "FTX",
      "Gate.io",
      "Kraken",
      "Bitfinex",
      "Binance US",
      "Hardware wallet",
    ];

    const listExchanges = exchanges.map((exchange, i) => {
      return <Select.Item key={i} label={exchange} value={exchange} />;
    });

    inputs = (
      <>
        <VStack mt="20px" alignItems="center" px="2" space={4}>
          <FormControl
            isRequired
            isInvalid={handleErrorMessage("from", errorMessage) ? true : false}
          >
            <Select
              selectedValue={from}
              minW="100%"
              height="12"
              placeholder="From"
              _selectedItem={{
                bg: "violet.900",
                endIcon: <CheckIcon size="5" />,
              }}
              onValueChange={(itemValue) => setFrom(itemValue)}
            >
              {listExchanges}
            </Select>
            <FormControl.ErrorMessage
              leftIcon={<WarningOutlineIcon size="xs" />}
            >
              {handleErrorMessage("from", errorMessage)}
            </FormControl.ErrorMessage>
          </FormControl>
          <FormControl
            isRequired
            isInvalid={handleErrorMessage("to", errorMessage) ? true : false}
          >
            <Select
              selectedValue={to}
              minW="100%"
              height="12"
              placeholder="To"
              _selectedItem={{
                bg: "violet.900",
                endIcon: <CheckIcon size="5" />,
              }}
              onValueChange={(itemValue) => setTo(itemValue)}
            >
              {listExchanges}
            </Select>
            <FormControl.ErrorMessage
              leftIcon={<WarningOutlineIcon size="xs" />}
            >
              {handleErrorMessage("to", errorMessage)}
            </FormControl.ErrorMessage>
          </FormControl>
          <FormControl
            isRequired
            isInvalid={
              handleErrorMessage("quantity", errorMessage) ? true : false
            }
          >
            <Input
              _focus={{ borderColor: "violet.900" }}
              placeholder="Quantity"
              minW="100%"
              height="12"
              value={quantity}
              onChangeText={(itemValue) => setQuantity(itemValue)}
            />
            <FormControl.ErrorMessage
              leftIcon={<WarningOutlineIcon size="xs" />}
            >
              {handleErrorMessage("quantity", errorMessage)}
            </FormControl.ErrorMessage>
          </FormControl>
          <Input
            _focus={{ borderColor: "violet.900" }}
            placeholder="Platform fees"
            minW="100%"
            height="12"
            value={fees}
            onChangeText={(itemValue) => setFees(itemValue)}
          />
        </VStack>

        {datePicker}
      </>
    );
  }

  return (
    <Box flex={1} _dark={{ bg: "blueGray.900" }} safeArea w="100%" p="2">
      <Center
        py="4"
        alignItems="center"
        rounded="3xl"
        _dark={{ bg: "blueGray.800" }}
        _text={{
          fontSize: "4xl",
          fontWeight: "bold",
          color: "#ffffff",
          textAlign: "center",
        }}
        // mx="2"
      >
        Edit transaction
      </Center>

      <ScrollView>{inputs}</ScrollView>

      <Center>
        <Button
          w="95%"
          mt="2%"
          mb="5"
          _dark={{ bg: "violet.900" }}
          colorScheme="violet"
          rounded="lg"
          py="3"
          _text={{
            fontSize: "xl",
            fontWeight: "medium",
            color: "#ffffff",
          }}
          onPress={() => editTransaction()}
        >
          Edit transaction
        </Button>
      </Center>
    </Box>
  );
}

function mapStateToProps(state) {
  return { authData: state.authData };
}

export default connect(mapStateToProps, null)(EditTransactionScreen);
