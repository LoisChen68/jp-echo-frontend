"use client";
import {
  CircularProgress as ChakraCircularProgress,
  CircularProgressLabel,
  Flex,
  Center,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { IoIosArrowForward } from "react-icons/io";

type Step = {
  id: number;
  videoId: number;
  title: string;
  description: string | null;
  type: string;
  subType: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

const CircularProgress = ({
  steps,
  currentStep,
}: {
  steps: Step[];
  currentStep: number;
}) => {
  return (
    <Flex>
      <ChakraCircularProgress
        value={((currentStep + 1) / steps.length) * 100}
        color="var(--green)"
        display="flex"
        padding="30px"
        size="70px"
      >
        <CircularProgressLabel>
          {currentStep === steps.length - 1
            ? "🎉"
            : `${currentStep + 1}/${steps.length}`}
        </CircularProgressLabel>
      </ChakraCircularProgress>
      <Center>
        <Flex flexDirection="column">
          <Text fontSize="16px" margin="0px 0px 10px 0px" as="b">
            {steps[currentStep].title}
          </Text>
          {currentStep < steps.length - 1 && (
            <Text
              fontSize="12px"
              margin="0px"
              display="flex"
              alignItems="center"
              color="var(--gray-dark)"
            >
              <IoIosArrowForward />
              {steps[currentStep + 1].title}
              {/* {steps[stepIndex].type === "測驗"
                  ? `${steps[stepIndex].title}：${nestedStepIndex + 1} / ${
                      steps[stepIndex].questionAmount
                    }`
                  : steps[stepIndex + 1].type === "測驗"
                  ? `${steps[stepIndex + 1].title}：${nestedStepIndex + 1} / ${
                      steps[stepIndex + 1].questionAmount
                    }`
                  : steps[stepIndex + 1].title} */}
            </Text>
          )}
        </Flex>
      </Center>
    </Flex>
  );
};

export default CircularProgress;
