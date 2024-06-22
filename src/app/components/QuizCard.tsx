"use client";
import { Box, Card, CardBody, Text, Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import styled from "styled-components";

type Choices = {
  id: string;
  content: string;
  isCorrect: boolean;
}[];

type subQuiz = {
  description: string;
  choice: {
    id: string;
    quizId: string;
    content: string;
    isCorrect: boolean;
  }[];
  timestampStart: number;
  timestampEnd: number;
}[];

type Quiz = {
  id: string;
  stepId: number;
  videoId: number;
  videoUrl: string | null;
  subQuiz: {
    description: string;
    choice: {
      id: string;
      quizId: string;
      content: string;
      isCorrect: boolean;
    }[];
    timestampStart: number;
    timestampEnd: number;
  }[];
  createdAt: Date;
  updateAt: Date;
}[];

const StyleSecond = styled.span`
  color: var(--brand-secondary);
`;

const QuizCard = ({
  subQuiz,
  currentSubQuiz,
  answeredId,
  second,
  handleNextClick,
  setVideoStarted,
  setVideoEnded,
  setAnsweredId,
  setSecond,
}: {
  subQuiz: subQuiz | [];
  currentSubQuiz: number;
  answeredId: string | null;
  second: number;
  handleNextClick: () => void;
  setVideoStarted: (time: number) => void;
  setVideoEnded: (time: number) => void;
  setAnsweredId: (answeredId: string | null) => void;
  setSecond: (second: number) => void;
}) => {
  useEffect(() => {
    if (!!answeredId && second !== 0) {
      const timer = setTimeout(() => {
        setSecond(second - 1);
      }, 1000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [answeredId, second, setSecond]);

  useEffect(() => {
    if (second === 0) {
      handleNextClick();
      setAnsweredId(null);
      setSecond(3);
    }
  }, [handleNextClick, second, setAnsweredId, setSecond]);

  useEffect(() => {
    setVideoStarted(Math.ceil(subQuiz[currentSubQuiz].timestampStart / 1000));
    setVideoEnded(Math.ceil(subQuiz[currentSubQuiz].timestampEnd / 1000));
    return () => {
      setVideoStarted(0);
      setVideoEnded(0);
    };
  }, [currentSubQuiz, setVideoEnded, setVideoStarted, subQuiz]);

  const isCorrect = subQuiz[currentSubQuiz].choice.find(
    (option) => option.id === answeredId
  )?.isCorrect;

  return (
    <Card
      width="90%"
      height="100%"
      backgroundColor="white"
      marginBottom="10px"
      marginX="20px"
      borderRadius="10px"
      marginTop="20px"
      padding="10px 0px"
    >
      <CardBody textAlign="center">
        <Text
          as="b"
          color="var(--gray-dark)"
        >{`Q：${subQuiz[currentSubQuiz].description}`}</Text>
        {subQuiz[currentSubQuiz].choice.map((choice) => (
          <Card
            key={choice.id}
            outline={
              !isCorrect && choice.id === answeredId
                ? "2px solid var(--brand-secondary)"
                : undefined
            }
            backgroundColor={
              !!answeredId && isCorrect && choice.id === answeredId
                ? "var(--green)"
                : !!answeredId && !isCorrect && choice.isCorrect
                ? "var(--green)"
                : "var(--footer-background-color)"
            }
            marginTop="10px"
            cursor="pointer"
          >
            <CardBody
              padding="15px 0px"
              onClick={() => !answeredId && setAnsweredId(choice.id)}
            >
              <Text as="b">{choice.content}</Text>
            </CardBody>
          </Card>
        ))}
        {!!answeredId && (
          <Text fontSize="xs" marginTop="10px">
            倒數 <StyleSecond>{second}</StyleSecond> 秒後，進入下一題
          </Text>
        )}
      </CardBody>
    </Card>
  );
};

export default QuizCard;
