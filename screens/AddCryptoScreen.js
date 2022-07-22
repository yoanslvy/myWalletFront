import React, { useEffect, useState } from "react";
import {
  Box,
  FlatList,
  HStack,
  Avatar,
  VStack,
  Text,
  Input,
  Icon,
  Pressable,
  ScrollView,
} from "native-base";
import { connect } from "react-redux";
import coinGeckoAPI from "../api/coinGecko";
import { Ionicons } from "@expo/vector-icons";
import myWalletAPI from "../api/myWallet";

const AddCryptoScreen = (props) => {
  const [coinList, setCoinList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [query, setQuery] = useState("");
  const token = props.authData[0].token;

  useEffect(() => {
    coinGeckoAPI
      .get("/coins/markets", {
        params: {
          vs_currency: "eur",
          order: "market_cap_desc",
          per_page: 500,
          sparkline: false,
        },
      })
      .then((response) => {
        setCoinList(response.data);
        setFilteredList(response.data);
      });
  }, []);

  const handleSearch = (query) => {
    const formattedQuery = query.toLowerCase();
    let filteredData = [];
    filteredData = coinList.filter((crypto) => {
      return crypto.id.includes(formattedQuery);
    });

    setFilteredList(filteredData);
    setQuery(query);
  };

  const addCrypto = (id) => {
    myWalletAPI
      .post("/cryptos/add-crypto", {
        id: id,
        token,
      })
      .then((response) => {
        if (response.data.result) {
          props.navigation.navigate("bottomNav");
        }
      });
  };

  const searchBar = () => {
    return (
      <VStack width="100%" space={5} alignItems="center" mb="5">
        <Input
          defaultValue={query}
          onChangeText={(queryText) => handleSearch(queryText)}
          placeholder="Search"
          variant="filled"
          size="xl"
          bg="blueGray.800"
          borderRadius="10"
          px="2"
          placeholderTextColor="white"
          _hover={{ bg: "gray.200", borderWidth: 0 }}
          borderWidth="0"
          _web={{
            _focus: { style: { boxShadow: "none" } },
          }}
          InputLeftElement={
            <Icon
              ml="2"
              size="5"
              color="white"
              as={<Ionicons name="ios-search" />}
            />
          }
        />
      </VStack>
    );
  };

  return (
    <Box
      safeArea
      alignItems="center"
      h="100%"
      flex={1}
      px="3"
      _dark={{ bg: "blueGray.900" }}
    >
      <Box
        p="10"
        justifyContent="center"
        alignItems="center"
        rounded="2xl"
        _dark={{ bg: "blueGray.800" }}
        bg="primary.500"
        width="98%"
        _text={{
          fontSize: "2xl",
          fontWeight: "bold",
          color: "#ffffff",
        }}
      >
        Add a crypto
      </Box>
      <Box mt="3" width="98%">
        {searchBar()}
      </Box>

      <FlatList
        width="98%"
        data={filteredList}
        renderItem={({ item }) => (
          <Pressable onPress={() => addCrypto(item.id)}>
            {({ isHovered, isPressed }) => {
              return (
                <Box
                  bg={
                    isPressed
                      ? "blueGray.800"
                      : isHovered
                      ? "cyan.800"
                      : "blueGray.900"
                  }
                  py="3"
                  pl="3"
                  rounded="8"
                  style={{
                    transform: [
                      {
                        scale: isPressed ? 0.96 : 1,
                      },
                    ],
                  }}
                >
                  <HStack space={3} alignItems="center">
                    <Avatar
                      size="30px"
                      source={{
                        uri: item.image,
                      }}
                    />
                    <VStack>
                      <Text
                        _dark={{
                          color: "white",
                        }}
                        color="coolGray.800"
                        bold
                      >
                        {item.name}
                      </Text>
                    </VStack>
                  </HStack>
                </Box>
              );
            }}
          </Pressable>
        )}
        keyExtractor={(item) => item.id}
      />
    </Box>
  );
};

const mapStateToProps = (state) => {
  return { authData: state.authData };
};

export default connect(mapStateToProps, null)(AddCryptoScreen);
