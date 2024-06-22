"use client";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Flex } from "@chakra-ui/react";

const Footer = ({
  onNextClick,
  onPrevClick,
  nextDisabled,
  prevDisabled,
}: {
  onNextClick: () => void;
  onPrevClick: () => void;
  nextDisabled: boolean;
  prevDisabled: boolean;
  visibleVideoControl: boolean;
}) => {
  return (
    <Flex
      marginBottom={{ base: "0", lg: "10px" }}
      paddingY="10px"
      width="100%"
      height="100%"
      justifyContent="space-around"
      alignItems="center"
      backgroundColor="var(--footer-background-color)"
      backdropFilter="blur(5px)"
      zIndex="999"
      borderRadius={{ base: "0px", lg: "50px" }}
    >
      <IoIosArrowBack
        size="2rem"
        color={prevDisabled ? "var(--gray-dark)" : "var(--black)"}
        onClick={onPrevClick}
        cursor="pointer"
      />
      <IoIosArrowForward
        size="2rem"
        color={nextDisabled ? "var(--gray-dark)" : "var(--black)"}
        onClick={onNextClick}
        cursor="pointer"
      />
    </Flex>
  );
};

export default Footer;
