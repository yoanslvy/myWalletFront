import React from "react";
import { Center, Box, Text, HStack, VStack, Image } from "native-base";

import numeral from "numeral";
import "numeral/locales";
numeral.locale("fr");

function CryptoCard(props) {
  const variationInFiat =
    props.crypto.totalQuantity * props.crypto.currentPrice -
    props.crypto.totalInvestment;

  const variationInPercent = props.crypto.totalInvestment
    ? Math.round(
        ((variationInFiat * 100) / props.crypto.totalInvestment) * 100
      ) / 100
    : 0;

  const crypto = (
    <Box rounded="2xl" py="2" pr="3" my="1" ml="1">
      <HStack justifyContent="space-around" alignItems="center">
        <Center w="17%">
          <Image
            resizeMode="cover"
            source={{
              uri: props.crypto.image,
            }}
            alt={props.crypto.name + " logo"}
            size="xs"
          />
        </Center>
        <VStack w="80%">
          <HStack>
            <Text fontSize="xl" fontWeight="bold">
              {props.crypto.symbol.toUpperCase() + " " + props.crypto.name}
            </Text>
            <Text
              fontSize="xl"
              fontWeight="bold"
              style={{ flex: 1 }}
              textAlign="right"
            >
              {numeral(
                Math.round(
                  props.crypto.totalQuantity * props.crypto.currentPrice * 100
                ) / 100
              ).format("0,0[.]00 $")}
            </Text>
          </HStack>
          <HStack>
            <Text fontSize="sm" fontWeight="light">
              {Math.round(props.crypto.totalQuantity * 1000) / 1000 +
                " | " +
                numeral(props.crypto.currentPrice).format("0,0[.]00 $")}
            </Text>
            <Text
              fontSize="sm"
              fontWeight="light"
              style={{ flex: 1 }}
              textAlign="right"
              color={variationInFiat >= 0 ? "#20BF55" : "#EF233C"}
              shadow={{
                shadowColor: variationInFiat >= 0 ? "#20BF55" : "#EF233C",
                shadowOffset: {
                  width: -1,
                  height: 1,
                },
                shadowOpacity: 1,
                shadowRadius: 5.0,
                elevation: 1,
              }}
            >
              {numeral(variationInFiat).format("0,0[.]00 $") + " | "}
              {variationInPercent > 0
                ? `${numeral(variationInPercent).format("+0.00")}%`
                : `${numeral(variationInPercent).format("0.00")}%`}
            </Text>
          </HStack>
        </VStack>
      </HStack>
    </Box>
  );

  return <>{crypto}</>;
}

export default CryptoCard;
