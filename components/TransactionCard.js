import React from "react";
import {
  Box,
  Text,
  Center,
  VStack,
  HStack,
  Circle,
  Pressable,
} from "native-base";

import numeral from "numeral";
import "numeral/locales";
numeral.locale("fr");

function TransactionCard(props) {
  const cardHeight = 150;

  const positive =
    Math.round(
      (((props.content.quantity * props.content.currentPrice -
        (props.content.price * props.content.quantity + props.content.fees)) *
        100) /
        (props.content.price * props.content.quantity + props.content.fees)) *
        100
    ) /
      100 >=
    0;

  let transaction;
  if (props.type === "buy") {
    transaction = (
      <Box w="100%" h={cardHeight}>
        <Box
          ml="16"
          _text={{
            textAlign: "left",
            fontStyle: "italic",
          }}
        >
          {props.date}
        </Box>

        <Pressable>
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
                rounded="3xl"
              >
                <Center position="relative" w="99%" py="2" rounded="3xl">
                  <VStack w="100%" space="1">
                    <HStack>
                      <Box w="33%" alignItems="center">
                        <Text fontWeight="light">Buy Price</Text>
                        <Text fontWeight="bold">
                          {numeral(
                            Math.round(props.content.price * 100) / 100
                          ).format("0,0[.]00 $")}
                        </Text>
                      </Box>
                      <Box w="33%" alignItems="center">
                        <Text fontWeight="light">Pair</Text>
                        <Text fontWeight="bold">{props.content.pair}</Text>
                      </Box>
                      <Box w="33%" alignItems="center">
                        <Text fontWeight="light">Quantity</Text>
                        <Text fontWeight="bold">{props.content.quantity}</Text>
                      </Box>
                    </HStack>
                    <HStack>
                      <Box w="33%" alignItems="center">
                        <Text fontWeight="light">Total Cost</Text>
                        <Text fontWeight="bold">
                          {numeral(
                            Math.round(props.content.cost * 100) / 100
                          ).format("0,0[.]00 $")}{" "}
                        </Text>
                      </Box>
                      <Box w="33%" alignItems="center">
                        <Text fontWeight="light">Value</Text>
                        <Text fontWeight="bold">
                          {numeral(
                            Math.round(
                              props.content.quantity *
                                props.content.currentPrice *
                                100
                            ) / 100
                          ).format("0,0[.]00 $")}
                        </Text>
                      </Box>
                      <Box w="33%" alignItems="center">
                        <Text fontWeight="light">Variation</Text>
                        <Text
                          fontWeight="bold"
                          color={positive ? "#20BF55" : "#EF233C"}
                          shadow={{
                            shadowColor: positive ? "#20BF55" : "#EF233C",
                            shadowOffset: {
                              width: -1,
                              height: 1,
                            },
                            shadowOpacity: 1,
                            shadowRadius: 5.0,
                            elevation: 1,
                          }}
                        >
                          {positive
                            ? `${numeral(
                                Math.round(
                                  (((props.content.quantity *
                                    props.content.currentPrice -
                                    (props.content.price *
                                      props.content.quantity +
                                      props.content.fees)) *
                                    100) /
                                    (props.content.price *
                                      props.content.quantity +
                                      props.content.fees)) *
                                    100
                                ) / 100
                              ).format("+0,0.00")} %`
                            : `${numeral(
                                Math.round(
                                  (((props.content.quantity *
                                    props.content.currentPrice -
                                    (props.content.price *
                                      props.content.quantity +
                                      props.content.fees)) *
                                    100) /
                                    (props.content.price *
                                      props.content.quantity +
                                      props.content.fees)) *
                                    100
                                ) / 100
                              ).format("0,0.00")} %`}
                        </Text>
                      </Box>
                    </HStack>
                  </VStack>
                </Center>
              </Box>
            );
          }}
        </Pressable>
        <Circle
          position="absolute"
          alignSelf="flex-end"
          _dark={{ bg: "blueGray.800" }}
          borderColor={"#20BF55"}
          borderWidth={"2"}
          size={8}
          _text={{
            textAlign: "center",
            fontWeight: "bold",
            color: "#20BF55",
          }}
          shadow={{
            shadowColor: "#20BF55",
            shadowOffset: {
              width: 0,
              height: 0,
            },
            shadowOpacity: 1,
            shadowRadius: 2.0,
            elevation: 1,
          }}
        >
          B
        </Circle>
      </Box>
    );
  } else if (props.type === "sell") {
    transaction = (
      <Box w="100%" h={cardHeight}>
        <Box
          ml="16"
          _text={{
            textAlign: "left",
            fontStyle: "italic",
          }}
        >
          {props.date}
        </Box>
        <Pressable>
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
                rounded="3xl"
              >
                <Center position="relative" w="99%" py="2" rounded="3xl">
                  <VStack w="100%" space="1">
                    <HStack>
                      <Box w="33%" alignItems="center">
                        <Text fontWeight="light">Sell Price</Text>
                        <Text fontWeight="bold">
                          {numeral(props.content.price).format("0,0[.]00 $")}
                        </Text>
                      </Box>
                      <Box w="33%" alignItems="center">
                        <Text fontWeight="light">Pair</Text>
                        <Text fontWeight="bold">{props.content.pair}</Text>
                      </Box>
                      <Box w="33%" alignItems="center">
                        <Text fontWeight="light">Quantity</Text>
                        <Text fontWeight="bold">{props.content.quantity}</Text>
                      </Box>
                    </HStack>
                    <HStack>
                      <Box w="33%" alignItems="center">
                        <Text fontWeight="light">Revenue</Text>
                        <Text fontWeight="bold">
                          {numeral(props.content.income).format("0,0[.]00 $")}
                        </Text>
                      </Box>
                    </HStack>
                  </VStack>
                </Center>
              </Box>
            );
          }}
        </Pressable>
        <Circle
          position="absolute"
          alignSelf="flex-end"
          _dark={{ bg: "blueGray.800" }}
          borderColor={"#EF233C"}
          borderWidth={"2"}
          size={8}
          _text={{
            textAlign: "center",
            fontWeight: "bold",
            color: "#EF233C",
          }}
          shadow={{
            shadowColor: "#EF233C",
            shadowOffset: {
              width: 0,
              height: 0,
            },
            shadowOpacity: 1,
            shadowRadius: 2.0,
            elevation: 1,
          }}
        >
          S
        </Circle>
      </Box>
    );
  } else if (props.type === "transfer") {
    transaction = (
      <Box w="100%" h={cardHeight}>
        <Box
          ml="16"
          _text={{
            textAlign: "left",
            fontStyle: "italic",
          }}
        >
          {props.date}
        </Box>
        <Pressable>
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
                rounded="3xl"
              >
                <Center position="relative" w="99%" py="2" rounded="3xl">
                  <VStack w="100%" space="1">
                    <HStack>
                      <Box w="33%" alignItems="center">
                        <Text fontWeight="light">From</Text>
                        <Text fontWeight="bold">{props.content.from}</Text>
                      </Box>
                      <Box w="33%" alignItems="center">
                        <Text fontWeight="light">To</Text>
                        <Text fontWeight="bold">{props.content.to}</Text>
                      </Box>
                      <Box w="33%" alignItems="center">
                        <Text fontWeight="light">Quantity</Text>
                        <Text fontWeight="bold">{props.content.quantity}</Text>
                      </Box>
                    </HStack>
                    <HStack>
                      <Box w="33%" alignItems="center">
                        <Text fontWeight="light">Fees</Text>
                        <Text fontWeight="bold">
                          {numeral(props.content.fees).format("0,0[.]00 ")}{" "}
                        </Text>
                      </Box>
                    </HStack>
                  </VStack>
                </Center>
              </Box>
            );
          }}
        </Pressable>
        <Circle
          position="absolute"
          alignSelf="flex-end"
          _dark={{ bg: "blueGray.800" }}
          borderColor={"#3b82f6"}
          borderWidth={"2"}
          size={8}
          _text={{
            textAlign: "center",
            fontWeight: "bold",
            color: "#3b82f6",
          }}
          shadow={{
            shadowColor: "#3b82f6",
            shadowOffset: {
              width: 0,
              height: 0,
            },
            shadowOpacity: 1,
            shadowRadius: 2.0,
            elevation: 1,
          }}
        >
          T
        </Circle>
      </Box>
    );
  } else {
  }

  return <>{transaction}</>;
}

export default TransactionCard;
