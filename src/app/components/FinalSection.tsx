import { Card, CardBody, Flex, Text, Box } from "@chakra-ui/react";

const FinalSection = ({ text }: { text: string }) => {
  return (
    <Flex flexDirection="column">
      <Card backgroundColor="var(--green)" borderRadius="10px" margin="20px">
        <CardBody>
          <Text color="white">{text}</Text>
        </CardBody>
      </Card>
      <Box margin="10px">
        <iframe
          width="100%"
          height="600px"
          src="https://www.surveycake.com/s/n0YKm"
        />
      </Box>
    </Flex>
  );
};

export default FinalSection;
