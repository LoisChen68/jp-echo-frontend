import { Box, Card, CardBody, Flex, Progress, Text } from "@chakra-ui/react";
import { IoIosPlayCircle } from "react-icons/io";
import styled from "styled-components";

const StyleProgress = styled(Progress)<{ second: string }>`
  background: white;
  border-radius: 10px;
  :before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    ${(props) =>
      props.second !== "0s"
        ? `border-bottom: 4px solid var(--green);
       animation: border_anim ${props.second} linear forwards;`
        : ""}
  }
`;

const KeywordCard = ({
  japanese,
  chinese,
  backgroundColor,
  isCanPlay,
  start,
  end,
  playerState,
  id,
  setVideoStarted,
  setVideoEnded,
  currentKeywordCard,
  onPlayVideo,
  setCurrentKeywordCard,
  onClick,
  isCurrent,
  cursor,
  width,
}: {
  japanese: string;
  chinese: string;
  start?: number;
  end?: number;
  id?: string;
  playerState?: number;
  isCurrent?: boolean;
  width: { [key: string]: string };
  backgroundColor: string;
  isCanPlay: boolean;
  currentKeywordCard?: string;
  onClick?: () => void;
  setVideoStarted?: (start: number) => void;
  setVideoEnded?: (end: number) => void;
  setCurrentKeywordCard?: (id: string) => void;
  onPlayVideo?: () => void;
  cursor: string;
}) => {
  const second = end && start && end - start;

  return (
    <Card
      backgroundColor={backgroundColor}
      marginTop="10px"
      marginX="20px"
      borderRadius="10px"
      width={width}
      cursor={cursor}
      onClick={() => {
        setVideoStarted?.((start && start) || 0);
        setVideoEnded?.((end && end) || 0);
        setCurrentKeywordCard && id && setCurrentKeywordCard(id);
        onPlayVideo?.();
      }}
    >
      {isCurrent && playerState === 1 && (
        <StyleProgress second={`${second}s`} />
      )}
      <CardBody>
        <Flex justifyContent={"space-between"} alignItems="center">
          <Box>
            <Text margin="0px 0px 20px 0px" as="b" fontSize="18px">
              {japanese}
            </Text>
            <Text margin="0px">{chinese}</Text>
          </Box>
          {!!isCanPlay && (
            <Text fontSize="3xl" color="var(--brand-secondary)">
              <IoIosPlayCircle />
            </Text>
          )}
        </Flex>
      </CardBody>
    </Card>
  );
};

export default KeywordCard;
