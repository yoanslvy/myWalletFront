import React from "react";
import { Box, Text, VStack, HStack, Image } from "native-base";

import { LineChart } from "react-native-chart-kit";

import numeral from "numeral";
import "numeral/locales";
numeral.locale("fr");

function StockCard(props) {
  const xAbs = props.data.prices.map((e) => e[0]);
  const yAbs = props.data.prices.map((e) => e[1]);

  const data = {
    labels: xAbs,
    datasets: [{ data: yAbs }],
  };

  let price_variation;
  if (props.days === 7) {
    price_variation = props.data.price_change_7d;
  } else if (props.days === 1) {
    price_variation = props.data.price_change_24h;
  }

  return (
    <Box _dark={{ bg: "blueGray.800" }} rounded="3xl" my="1" p="2">
      <HStack space="1" justifyContent="space-around" alignItems="center">
        <HStack space="4">
          <Image
            resizeMode="cover"
            source={{
              uri: props.data.image,
            }}
            alt={props.data.name}
            size="xs"
          />
          <Text fontWeight="bold" fontSize="md" alignSelf="center">
            {props.data.name}
          </Text>
        </HStack>
        <VStack>
          <Text>{numeral(props.data.currentPrice).format("0,0[.]00 $")}</Text>
          <Text
            color={price_variation > 0 ? "#20BF55" : "#EF233C"}
            shadow={{
              shadowColor: price_variation >= 0 ? "#20BF55" : "#EF233C",
              shadowOffset: {
                width: -1,
                height: 1,
              },
              shadowOpacity: 1,
              shadowRadius: 5.0,
              elevation: 1,
            }}
          >
            {`${numeral(price_variation).format("+0,0[.]00")}%`}
          </Text>
        </VStack>
        <Box pt="1">
          <LineChart
            data={data}
            width={80}
            height={50}
            chartConfig={{
              backgroundGradientFrom: "#1e293b",
              backgroundGradientTo: "#1e293b",
              color: () =>
                price_variation >= 0
                  ? `rgba(32, 191, 85, 0.8)`
                  : `rgba(239, 35, 60, 0.8)`,
              propsForBackgroundLines: {
                stroke: "#1e293b",
              },
            }}
            bezier
            withHorizontalLabels={false}
            withVerticalLabels={false}
            withDots={false}
            style={{ paddingRight: 0, paddingTop: 2, paddingBottom: -3 }}
          />
        </Box>
      </HStack>
    </Box>
  );
}

export default StockCard;
