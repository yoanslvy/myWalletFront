import React, { useState, useEffect } from "react";
import { RefreshControl } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import {
  Button,
  Box,
  Text,
  HStack,
  VStack,
  Flex,
  Pressable,
  Icon,
} from "native-base";

import { MaterialIcons, Entypo } from "@expo/vector-icons";

import { connect } from "react-redux";
import { SwipeListView } from "react-native-swipe-list-view";

import CryptoCard from "../components/CryptoCard";

import myWalletAPI from "../api/myWallet";

import numeral from "numeral";
import "numeral/locales";
numeral.locale("fr");

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

function HomeScreen(props) {
  const [refreshing, setRefreshing] = useState(false);
  const isFocused = useIsFocused();

  const [ownedCryptos, setOwnedCryptos] = useState([]);
  const [total, setTotal] = useState(0);
  const [portfolioVariationInFiat, setPortfolioVariationInFiat] = useState(0);
  const [portfolioVariationInPercent, setPortfolioVariationInPercent] =
    useState(0);

  // console.log(
  //   ownedCryptos.sort((a, b) =>
  //     a.currentPrice * a.totalQuantity > b.currentPrice * b.totalQuantity
  //       ? 1
  //       : -1
  //   )
  // );

  const token = props.authData[0].token;
  const user = props.authData[0].firstName;

  function LoadCryptoList() {
    myWalletAPI
      .get(`/cryptos/list-crypto/${token}`)
      .then((response) => {
        let total = 0;
        if (response.data.result && response.data.ownedCryptos.length > 0) {
          for (let i = 0; i < response.data.ownedCryptos.length; i++) {
            total +=
              response.data.ownedCryptos[i].currentPrice *
              response.data.ownedCryptos[i].totalQuantity;
          }
        }
        setTotal(total);
        setOwnedCryptos(
          response.data.ownedCryptos.sort((a, b) =>
            a.currentPrice * a.totalQuantity > b.currentPrice * b.totalQuantity
              ? -1
              : 1
          )
        );
        setPortfolioVariationInFiat(
          total - response.data.totalPortfolioInvestment
        );
        setPortfolioVariationInPercent(
          response.data.portfolioVariationInPercent
        );
      })
      .then(() => setRefreshing(false));
  }

  useEffect(() => {
    if (isFocused) {
      console.log("<------------HOME----------->");
      LoadCryptoList();
    }
  }, [isFocused]);

  function SwipeableList() {
    const deleteRow = (id) => {
      myWalletAPI
        .delete(`/cryptos/delete-crypto/${id}/${token}`)
        .then((response) => {
          if (response.data.result) {
            LoadCryptoList();
          }
        });
    };

    const renderHiddenItem = (data) => (
      <HStack flex="1" py="1" mx="2">
        <Pressable
          w="100%"
          pl="75%"
          bg="red.500"
          rounded="3xl"
          justifyContent="center"
          onPress={() => deleteRow(data.item.id)}
          _pressed={{
            opacity: 0.5,
          }}
        >
          <VStack alignItems="center" space={2}>
            <Icon
              as={<MaterialIcons name="delete" />}
              color="white"
              size="md"
            />
            <Text color="white" fontSize="xs" fontWeight="medium">
              Delete
            </Text>
          </VStack>
        </Pressable>
      </HStack>
    );

    return (
      <SwipeListView
        data={ownedCryptos}
        renderItem={({ item }) => (
          <>
            <Pressable
              key={item.id}
              onPress={() =>
                props.navigation.navigate("ListTransactions", {
                  id: item.id,
                  symbol: item.symbol,
                  image: item.image,
                  currentPrice: item.currentPrice,
                  totalQuantity: item.totalQuantity,
                  name: item.name,
                })
              }
            >
              {({ isHovered, isPressed }) => {
                return (
                  <Box
                    bg={
                      isPressed
                        ? "blueGray.700"
                        : isHovered
                        ? "cyan.800"
                        : "blueGray.800"
                    }
                    m={1}
                    rounded="3xl"
                  >
                    <CryptoCard
                      crypto={{
                        id: item.id,
                        symbol: item.symbol,
                        image: item.image,
                        name: item.name,
                        totalQuantity: item.totalQuantity,
                        currentPrice: item.currentPrice,
                        totalInvestment: item.totalInvestment,
                      }}
                    />
                  </Box>
                );
              }}
            </Pressable>
          </>
        )}
        renderHiddenItem={renderHiddenItem}
        rightOpenValue={-90}
        previewRowKey={"0"}
        previewOpenValue={-40}
        previewOpenDelay={3000}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={LoadCryptoList}
            tintcolor="white"
            title="Pull down to refresh"
            titleColor="#ffffff"
          />
        }
      />
    );
  }

  return (
    <Box flex="1" _dark={{ bg: "blueGray.900" }} px="2" safeArea>
      <Box _dark={{ bg: "blueGray.800" }} w="100%" rounded="xl" p="5" mb="2">
        <Text fontSize="4xl" fontWeight="bold" textAlign="center">
          {user + "'s Portfolio"}
        </Text>
        <Text fontSize="3xl" fontWeight="bold" textAlign="center">
          {numeral(Math.round(total * 100) / 100).format("0,0[.]00 $")}
        </Text>
        <Text
          fontSize="md"
          fontWeight="light"
          textAlign="center"
          color={
            portfolioVariationInFiat >= 0 ? "#20BF55" : "#EF233C"
          } /* Condition à remplacer [true] pour changer la couleur du texte (selon le signe de l'array affichée en dessous) */
          shadow={{
            shadowColor: portfolioVariationInFiat >= 0 ? "#20BF55" : "#EF233C",
            shadowOffset: {
              width: -1,
              height: 1,
            },
            shadowOpacity: 1,
            shadowRadius: 5.0,
            elevation: 1,
          }}
        >
          {numeral(Math.round(portfolioVariationInFiat * 100) / 100).format(
            "0,0[.]00 $"
          )}{" "}
          |{" "}
          {numeral(Math.round(portfolioVariationInPercent * 100) / 100).format(
            "+0.00"
          )}
          %
        </Text>
      </Box>
      <Box flex="1">
        {ownedCryptos.length !== 0 ? (
          <SwipeableList />
        ) : (
          <Box
            style={{ flex: 1 }}
            alignSelf="center"
            justifyContent="center"
            w="64"
          >
            <Text textAlign="center" fontSize="xl">
              Hit + to add a crypto to your portfolio
            </Text>
          </Box>
        )}
        <Flex justifyContent="flex-end">
          <Button
            bottom="3"
            right="3"
            position="absolute"
            alignSelf="flex-end"
            onPress={() => props.navigation.navigate("AddCrypto")}
            variant="addBtn"
            px="1"
            py="1"
            leftIcon={<Entypo name="plus" size={50} color="white" />}
          />
        </Flex>
      </Box>
    </Box>
  );
}

function mapStateToProps(state) {
  return { authData: state.authData };
}

export default connect(mapStateToProps, null)(HomeScreen);
