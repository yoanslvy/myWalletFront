import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Box, Flex, Text, FlatList, Button, Switch, HStack } from "native-base";
import { RefreshControl } from "react-native";

import myWalletAPI from "../api/myWallet";
import StockCard from "../components/StockCard";

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

function StocksScreen(props) {
  const token = props.authData[0].token;
  const [cryptoStocks7, setCryptoStocks7] = useState([]);
  const [cryptoStocks1, setCryptoStocks1] = useState([]);
  const [interval, setInterval] = useState(7);
  const [refreshing, setRefreshing] = useState(false);
  const [toggle, setToggle] = useState(false);

  function LoadData() {
    myWalletAPI
      .get(`/stocks/${token}/${interval}/${toggle}`)
      .then((response) => {
        if (response.data.result) {
          if (interval === 7) {
            setCryptoStocks7(response.data.cryptos);
          } else if (interval === 1) {
            setCryptoStocks1(response.data.cryptos);
          }
        }
      });
    wait(2000).then(() => setRefreshing(false));
  }

  useEffect(() => {
    if (cryptoStocks1.length === 0 || cryptoStocks7.length === 0) {
      console.log("<--------STOCKSCREEN-------->");
      LoadData();
    }
  }, [interval, toggle]);

  function FlatListElements() {
    let cryptoStocks;
    if (interval === 7) {
      cryptoStocks = cryptoStocks7;
    } else if (interval === 1) {
      cryptoStocks = cryptoStocks1;
    }

    return (
      <FlatList
        data={cryptoStocks}
        renderItem={({ item }) => (
          <StockCard data={item} prices={item.prices} days={interval} />
        )}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={LoadData}
            tintcolor="white"
            title="Pull down to refresh"
            titleColor="#ffffff"
          />
        }
      />
    );
  }

  return (
    <Box flex={1} _dark={{ bg: "blueGray.900" }} px="4" safeArea>
      <Box
        py="3"
        alignItems="center"
        rounded="2xl"
        _dark={{ bg: "blueGray.800" }}
        mb="3"
      >
        <HStack alignItems="center" space="1">
          <Text fontSize="3xl" fontWeight="bold" mx="6">
            Stocks
          </Text>
        </HStack>
        <Text>
          Variations during {interval === 7 ? `last 7 days` : `last 24 hours`}
        </Text>
        <Button.Group size="xs" mt="1">
          <Button
            w="40%"
            variant={interval !== 7 ? "active" : "inactive"}
            _text={{ fontWeight: "bold", fontSize: "md", px: "0" }}
            onPress={() => setInterval(1)}
          >
            24 hours
          </Button>
          <Button
            w="40%"
            variant={interval === 7 ? "active" : "inactive"}
            _text={{ fontWeight: "bold", fontSize: "md", px: "0" }}
            onPress={() => setInterval(7)}
          >
            7 days
          </Button>
        </Button.Group>
        <HStack alignItems="center" mt="2">
          <Switch
            size="sm"
            onToggle={() => setToggle(!toggle)}
            isChecked={toggle}
            onTrackColor="violet.800"
          />
          <Text>Follow owned cryptos</Text>
        </HStack>
      </Box>
      <Box flex="1">
        <FlatListElements />
      </Box>
    </Box>
  );
}

function mapStateToProps(state) {
  return { authData: state.authData };
}

export default connect(mapStateToProps, null)(StocksScreen);
