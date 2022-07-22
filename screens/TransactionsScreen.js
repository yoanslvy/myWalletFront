import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useIsFocused } from "@react-navigation/native";

import {
  Button,
  Box,
  Text,
  Center,
  Image,
  VStack,
  HStack,
  Pressable,
  Icon,
} from "native-base";
import { SwipeListView } from "react-native-swipe-list-view";

import { MaterialIcons, Entypo } from "@expo/vector-icons";

import { Platform } from "react-native";
import myWalletAPI from "../api/myWallet";

import TransactionCard from "../components/TransactionCard";

import numeral from "numeral";
import "numeral/locales";
numeral.locale("fr");

function TransactionsScreen(props) {
  const isFocused = useIsFocused();
  const token = props.authData[0].token;

  const [listTransactions, setListTransactions] = useState([]);

  const [header, setHeader] = useState({
    benefits: 0,
    averageBuyPrice: 0,
    averageSellPrice: 0,
  });

  const benefits = header.benefits;
  const averageBuyPrice = header.averageBuyPrice;
  const averageSellPrice = header.averageSellPrice;

  function headerData(
    transactions,
    totalQuantity = props.route.params.totalQuantity
  ) {
    let totalCosts = 0;
    const value = totalQuantity * props.route.params.currentPrice;

    let averageBuy = 0;
    let averageSell = 0;

    let buyingPricesTotal = 0;
    const buyTransactions = transactions.filter((e) => e.type === "buy");
    for (let transaction of buyTransactions) {
      totalCosts += transaction.price * transaction.quantity + transaction.fees;
      buyingPricesTotal += transaction.price;
    }

    let sellingPricesTotal = 0;
    const sellTransactions = transactions.filter((e) => e.type === "sell");
    for (let transaction of sellTransactions) {
      totalCosts -= transaction.price * transaction.quantity + transaction.fees;
      sellingPricesTotal += transaction.price;
    }

    if (buyTransactions.length !== 0) {
      averageBuy =
        Math.round((buyingPricesTotal / buyTransactions.length) * 100) / 100;
    }
    if (sellTransactions.length !== 0) {
      averageSell =
        Math.round((sellingPricesTotal / sellTransactions.length) * 100) / 100;
    }

    setHeader({
      benefits: Math.round((value - totalCosts) * 100) / 100,
      averageBuyPrice: averageBuy,
      averageSellPrice: averageSell,
    });
  }

  function dateSort(
    path = [],
    comparator = (a, b) => new Date(b).getTime() - new Date(a).getTime()
  ) {
    return (a, b) => {
      let _a = a;
      let _b = b;
      for (let key of path) {
        _a = _a[key];
        _b = _b[key];
      }
      return comparator(_a, _b);
    };
  }

  listTransactions.sort(dateSort(["date"]));

  const dateFormat = (date) => {
    if (Number(date.getMinutes()) < 10 && Number(date.getHours()) < 10) {
      return `${date.getDate()}/${
        date.getMonth() + 1
      }/${date.getFullYear()} at 0${date.getHours()}:0${date.getMinutes()}`;
    } else if (Number(date.getMinutes() < 10)) {
      return `${date.getDate()}/${
        date.getMonth() + 1
      }/${date.getFullYear()} at ${date.getHours()}:0${date.getMinutes()}`;
    } else if (Number(date.getHours() < 10)) {
      return `${date.getDate()}/${
        date.getMonth() + 1
      }/${date.getFullYear()} at 0${date.getHours()}:${date.getMinutes()}`;
    } else {
      return `${date.getDate()}/${
        date.getMonth() + 1
      }/${date.getFullYear()} at ${date.getHours()}:${date.getMinutes()}`;
    }
  };

  useEffect(() => {
    if (isFocused) {
      console.log("<-----LIST TRANSACTIONS----->");
      myWalletAPI
        .get(
          `/transactions/list-transactions/${token}/${props.route.params.id}`
        )
        .then((response) => {
          if (response.data.result) {
            setListTransactions(response.data.transactions);
            headerData(response.data.transactions);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [isFocused]);

  const renderItem = ({ item, index }) => (
    <>
      <TransactionCard
        key={index}
        date={
          Platform === "android"
            ? dateFormat(new Date(item.date))
            : new Date(item.date).toLocaleString("en-GB")
        }
        type={item.type}
        content={{
          currentPrice: props.route.params.currentPrice,
          pair: item.pair,
          quantity: item.quantity,
          price: item.price,
          cost: item.price * item.quantity + item.fees,
          income: item.price * item.quantity - item.fees,
          fees: item.fees,
          from: item.from,
          to: item.to,
        }}
      />
    </>
  );

  const deleteRow = (crypto, id) => {
    myWalletAPI
      .delete(`/transactions/delete-transaction/${token}/${crypto}/${id}`)
      .then((response) => {
        const totalQuantity = response.data.totalQuantity;
        if (response.data.result) {
          myWalletAPI
            .get(
              `/transactions/list-transactions/${token}/${props.route.params.id}`
            )
            .then((response) => {
              if (response.data.result) {
                setListTransactions(response.data.transactions);
                headerData(response.data.transactions, totalQuantity);
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
  };

  const renderHiddenItem = (data) => (
    <HStack flex="1" height="100%" py="6" my="1" rounded="3xl">
      <Pressable
        w="80%"
        bg="coolGray.200"
        justifyContent="center"
        pr="7%"
        borderLeftRadius="3xl"
        alignItems="flex-end"
        onPress={() =>
          props.navigation.navigate("EditTransaction", {
            transaction: data.item,
            symbol: props.route.params.symbol,
            currentPrice: props.route.params.currentPrice,
            totalQuantity: props.route.params.totalQuantity,
          })
        }
        _pressed={{
          opacity: 0.5,
        }}
      >
        <VStack alignItems="center" space={2}>
          <Entypo name="dots-three-horizontal" />
          <Text color="black" fontSize="xs" fontWeight="medium">
            Edit
          </Text>
        </VStack>
      </Pressable>
      <Pressable
        w="20%"
        mx="auto"
        bg="red.500"
        justifyContent="center"
        borderRightRadius="3xl"
        onPress={() => deleteRow(data.item.crypto, data.item._id)}
        _pressed={{
          opacity: 0.5,
        }}
      >
        <VStack alignItems="center" space={2}>
          <Icon as={<MaterialIcons name="delete" />} color="white" />
          <Text color="white" fontSize="xs" fontWeight="medium">
            Delete
          </Text>
        </VStack>
      </Pressable>
    </HStack>
  );

  function SwipeList() {
    return (
      <SwipeListView
        // mt="3"
        keyExtractor={(item) => item._id}
        px="2"
        data={listTransactions}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        rightOpenValue={-145}
        previewRowKey={"0"}
        previewOpenValue={-40}
        previewOpenDelay={3000}
      />
    );
  }

  return (
    <Box
      flex={1}
      alignItems="center"
      px="2"
      mb="0"
      _dark={{ bg: "blueGray.900" }}
      safeArea
    >
      <Center
        w="100%"
        py="4"
        mb="1"
        _dark={{ bg: "blueGray.800" }}
        rounded="2xl"
      >
        <HStack alignItems="center" space={5}>
          <Image
            source={{
              uri: props.route.params.image,
            }}
            alt="bitcoin"
            size="xs"
          />
          <Text fontWeight="bold" fontSize="4xl">
            Transactions
          </Text>
        </HStack>
        <HStack space={"5%"}>
          <Center
            _text={{
              fontSize: "lg",
              fontWeight: "light",
            }}
          >
            Average buy
            <Text fontWeight="bold" fontSize="md">
              {numeral(averageBuyPrice).format("0,0[.]00 $")}
            </Text>
          </Center>
          <Center
            _text={{
              fontSize: "lg",
              fontWeight: "light",
            }}
          >
            Average sell
            <Text fontWeight="bold" fontSize="md">
              {numeral(averageSellPrice).format("0,0[.]00 $")}
            </Text>
          </Center>
          <Center
            _text={{
              fontSize: "lg",
              fontWeight: "light",
            }}
          >
            Benefits
            <Text
              fontWeight="bold"
              fontSize="md"
              color={benefits >= 0 ? "#20BF55" : "#EF233C"}
              shadow={{
                shadowColor: benefits >= 0 ? "#20BF55" : "#EF233C",
                shadowOffset: {
                  width: -1,
                  height: 1,
                },
                shadowOpacity: 1,
                shadowRadius: 5.0,
                elevation: 1,
              }}
            >
              {benefits >= 0
                ? `+${numeral(benefits).format("0,0[.]00 $")}`
                : numeral(benefits).format("0,0[.]00 $")}{" "}
            </Text>
          </Center>
        </HStack>
      </Center>

      <VStack alignItems="center" px="3" mb="3" w="100%">
        <HStack mt="4" mb="4" w="100%">
          <Button
            variant="addBtn"
            px="1"
            py="1"
            mr="3"
            ml="3"
            leftIcon={
              <Entypo
                name="plus"
                size={40}
                color="white"
                onPress={() =>
                  props.navigation.navigate("AddTransaction", {
                    id: props.route.params.id,
                    symbol: props.route.params.symbol,
                    currentPrice: props.route.params.currentPrice,
                    totalQuantity: props.route.params.totalQuantity,
                  })
                }
              />
            }
            shadow={{
              shadowColor: "#5b21b6",
              shadowOffset: {
                width: 0,
                height: 0,
              },
              shadowOpacity: 1,
              shadowRadius: 5.0,
              elevation: 1,
            }}
          />
          <Text
            fontSize="lg"
            fontWeight="bold"
            textAlign="center"
            my="auto"
            mr="20"
          >
            Add transaction
          </Text>
        </HStack>
      </VStack>

      {listTransactions.length !== 0 ? (
        <SwipeList />
      ) : (
        <Box
          style={{ flex: 1 }}
          alignSelf="center"
          justifyContent="center"
          w="64"
        >
          <Text textAlign="center" fontSize="xl">
            Hit + to add a transaction for {props.route.params.name}
          </Text>
        </Box>
      )}
    </Box>
  );
}

function mapStateToProps(state) {
  return { authData: state.authData };
}

export default connect(mapStateToProps, null)(TransactionsScreen);
