"use client";
import { Fragment, ReactElement, useEffect, useRef, useState } from "react";
import CircularProgress from "./CircularProgress";
import Footer from "./Footer";
import {
  AspectRatio,
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Text,
} from "@chakra-ui/react";
import { FaCirclePlay } from "react-icons/fa6";
import { MdOutlineReplay } from "react-icons/md";
import KeywordCard from "./KeywordCard";
import QuizCard from "./QuizCard";
import ReactPlayer from "react-player";
import FinalSection from "./FinalSection";
import YouTube, { YouTubeProps } from "react-youtube";
import YoutubePlayer from "./YoutubePlayer";
import { IoIosPlayCircle } from "react-icons/io";
import { MdRestartAlt } from "react-icons/md";
import { IoPause } from "react-icons/io5";
import CaptionsBlock from "./CaptionsBlock";

type Steps = {
  id: number;
  videoId: number;
  title: string;
  description: string | null;
  type: string;
  subType: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}[];
type Keywords = {
  id: string;
  japanese: string;
  chinese: string;
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

type Captions = {
  id: number;
  subtitleId: number;
  lineIndex: number;
  line: string;
  timestampStart: number;
  timestampEnd: number;
  start: number;
  end: number;
}[];

declare global {
  interface Window {
    ytPlayer: any;
  }
}

const finalText = `
感謝您體驗 JP Echo
測試版！希望您喜歡我們的服務。我們誠摯地邀請您參與試用體驗心得調查，填寫內容將用以持續改善網站功能。待正式版本上線後，會第一時間邀請您來使用。謹代表
JP Echo 開發團隊 感謝您提供的建議和心得。
`;

const extractVideoId = (url: string) => {
  const regex =
    /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);

  return match ? match[1] : "";
};

const VideoContent = ({
  steps,
  keywords,
  quiz,
  videoUrl,
  captions,
  timestampStart,
  timestampEnd,
}: {
  steps: Steps;
  keywords: Keywords;
  quiz: Quiz;
  videoUrl: string;
  captions: Captions;
  timestampStart: number;
  timestampEnd: number;
}) => {
  const mobileContainerRef = useRef<HTMLDivElement | null>(null);
  const desktopContainerRef = useRef<HTMLDivElement | null>(null);
  const mobileCaptionsRefs = useRef<(HTMLDivElement | null)[]>([]);
  const desktopCaptionsRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [videoStarted, setVideoStarted] = useState(timestampStart);
  const [videoEnded, setVideoEnded] = useState(timestampEnd);
  const [currentSubQuiz, setCurrentSubQuiz] = useState(0);
  const [currentKeywordCard, setCurrentKeywordCard] = useState("");
  const [second, setSecond] = useState(3);
  const playerRef = useRef<any>(null);
  const [answeredId, setAnsweredId] = useState<string | null>(null);
  const [playerState, setPlayerState] = useState(5);
  const [currentTime, setCurrentTime] = useState(0);
  const subQuiz =
    quiz.find((q) => q.stepId === steps[currentStep].id)?.subQuiz || [];
  const currentQuiz = quiz.find((q) => q.stepId === steps[currentStep].id);
  const nextDisabled =
    steps[currentStep].type !== "QUIZ" && currentStep === steps.length - 1;
  const prevDisabled = currentStep === 0;
  const videoId = extractVideoId(
    !!currentQuiz?.videoUrl ? currentQuiz.videoUrl : videoUrl
  );
  const visibleVideoControl = steps[currentStep].type !== "QUIZ";

  const handleNextClick = () => {
    if (steps[currentStep].type !== "QUIZ" && !nextDisabled) {
      setCurrentStep(currentStep + 1);
      setVideoStarted(timestampStart);
      setVideoEnded(timestampEnd);
    }
    if (steps[currentStep].type === "QUIZ") {
      if (!answeredId) {
        return;
      } else {
        setAnsweredId(null);
        setSecond(3);
      }
      if (currentSubQuiz < subQuiz.length - 1 && !!answeredId) {
        setCurrentSubQuiz(currentSubQuiz + 1);
      } else {
        setCurrentSubQuiz(0);
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevClick = () => {
    if (steps[currentStep].type !== "QUIZ" && !prevDisabled) {
      setCurrentStep(currentStep - 1);
      setVideoStarted(timestampStart);
      setVideoEnded(timestampEnd);
    }
    if (steps[currentStep].type === "QUIZ") {
      setAnsweredId(null);
      setSecond(3);
      if (currentSubQuiz !== 0) {
        setCurrentSubQuiz(currentSubQuiz - 1);
      } else {
        setCurrentStep(currentStep - 1);
      }
    }
  };
  const onPlayerReady = (event: any) => {
    console.log("Player is ready");
    playerRef.current = event;
    console.log("playerRef", playerRef.current);
    const playerState = playerRef.current.target.getPlayerState();
    console.log("playerState", playerState);
  };

  const onStateChange = (event: any) => {
    setPlayerState(event.data);
  };

  useEffect(() => {
    if (playerRef.current) {
      if (!!videoStarted && steps[currentStep].subType === "jpKeyword") {
        playerRef.current.target.loadVideoById({
          videoId,
          startSeconds: videoStarted,
          endSeconds: videoEnded,
        });
      } else {
        playerRef.current.target.cueVideoById({
          videoId,
          startSeconds: videoStarted,
          endSeconds: videoEnded,
        });
      }
    }
  }, [currentStep, steps, videoEnded, videoId, videoStarted]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (playerState === 1) {
        const currentTime = playerRef.current.target.getCurrentTime();
        setCurrentTime(currentTime);
      }
    }, 100);
    return () => clearInterval(timer);
  }, [playerState]);

  useEffect(() => {
    const currentCaptionIndex = captions.findIndex(
      (value) => currentTime >= value.start && currentTime <= value.end
    );

    if (
      currentCaptionIndex !== -1 &&
      mobileContainerRef.current &&
      desktopContainerRef.current &&
      mobileCaptionsRefs.current &&
      desktopCaptionsRefs.current
    ) {
      const currentMobileCaption =
        mobileCaptionsRefs.current[currentCaptionIndex];
      const currentDesktopCaption =
        desktopCaptionsRefs.current[currentCaptionIndex];
      if (currentMobileCaption) {
        mobileContainerRef.current.scrollTo({
          top:
            currentMobileCaption.offsetTop -
            mobileContainerRef.current.offsetTop,
        });
      }
      if (currentDesktopCaption) {
        desktopContainerRef.current.scrollTo({
          top:
            currentDesktopCaption.offsetTop -
            desktopContainerRef.current.offsetTop,
        });
      }
    }
  }, [currentTime, captions]);

  const onPlayVideo = () => {
    const playerState = playerRef.current.target.getPlayerState();
    if (playerState === 1 && steps[currentStep].subType !== "jpKeyword") {
      playerRef.current.target.pauseVideo();
    } else if (playerState === 2) {
      playerRef.current.target.playVideo();
    } else {
      playerRef.current.target.seekTo(videoStarted);
    }
  };

  return (
    <>
      <Box width={{ base: "100%", md: "90%" }}>
        <CircularProgress steps={steps} currentStep={currentStep} />
        {steps[currentStep].subType !== "practiceKeyword" &&
          steps[currentStep].type !== "COMPLETE" && (
            <Box
              width="100%"
              height={{
                base: undefined,
                lg:
                  steps[currentStep].subType === "noSubtitle"
                    ? undefined
                    : "90%",
              }}
              display="flex"
              justifyContent="center"
              alignItems="flex-start"
              gap="5"
            >
              <Box
                backgroundColor="var(--footer-background-color)"
                width="100%"
                height={{
                  base: undefined,
                  lg:
                    steps[currentStep].subType === "noSubtitle"
                      ? undefined
                      : "90%",
                }}
                display="flex"
                justifyContent="center"
              >
                <AspectRatio
                  overflow={"hidden"}
                  display={playerState === 0 ? "block" : "none"}
                  height="50%"
                  width={{
                    base: "100%",
                    md:
                      steps[currentStep].subType === "noSubtitle" ||
                      steps[currentStep].subType === "jpSubtitle"
                        ? "70%"
                        : "100%",
                  }}
                  ratio={{ base: 16 / 9, md: 21 / 9 }}
                >
                  <Box
                    display="flex"
                    flexDirection="column"
                    gap="2"
                    backgroundColor="black"
                  >
                    <Box
                      backgroundColor="var(--brand-secondary)"
                      borderRadius="50%"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      width="40px"
                      height="40px"
                      onClick={() => {
                        onPlayVideo();
                      }}
                    >
                      <MdOutlineReplay fontSize="30px" color="white" />
                    </Box>

                    <Text color="white">請點擊按鈕重新播放</Text>
                  </Box>
                </AspectRatio>
                <AspectRatio
                  overflow={"hidden"}
                  display={playerState === 0 ? "none" : "block"}
                  width={{
                    base: "100%",
                    md:
                      steps[currentStep].subType === "noSubtitle"
                        ? "70%"
                        : "100%",
                  }}
                  height="50%"
                  ratio={{ base: 16 / 9, md: 21 / 9 }}
                >
                  <YoutubePlayer
                    videoId={videoId}
                    start={videoStarted}
                    end={videoEnded}
                    onPlayerReady={onPlayerReady}
                    onStateChange={onStateChange}
                  />
                </AspectRatio>
              </Box>
              <Flex
                flexDirection="column"
                alignItems="center"
                display={{
                  base: "none",
                  lg: steps[currentStep].subType !== "noSubtitle" ? "flex" : "",
                }}
                width="70%"
                height="100%"
                gap="5"
              >
                <Box
                  width="100%"
                  height="80%"
                  overflowY="scroll"
                  borderRadius="10px"
                  backgroundColor="var(--footer-background-color)"
                >
                  {steps[currentStep].subType === "jpKeyword" && (
                    <Box
                      display="flex"
                      flexWrap={{ md: "wrap" }}
                      paddingBottom="70px"
                      width="100%"
                      justifyContent={{ md: "space-around" }}
                    >
                      {keywords.map((keyword) => (
                        <KeywordCard
                          width={{ md: "40%", lg: "90%" }}
                          key={keyword.id}
                          id={keyword.id}
                          japanese={keyword.japanese}
                          chinese={keyword.chinese}
                          start={Math.ceil(keyword.timestampStart / 1000)}
                          end={Math.ceil(keyword.timestampEnd / 1000)}
                          backgroundColor="white"
                          isCanPlay={true}
                          playerState={playerState}
                          setCurrentKeywordCard={setCurrentKeywordCard}
                          isCurrent={currentKeywordCard === keyword.id}
                          onPlayVideo={onPlayVideo}
                          setVideoStarted={setVideoStarted}
                          setVideoEnded={setVideoEnded}
                          cursor="pointer"
                        />
                      ))}
                    </Box>
                  )}
                  {steps[currentStep].type === "QUIZ" && (
                    <Flex
                      flexDirection="column"
                      justifyContent="center"
                      alignItems="center"
                      width="100%"
                      height="100%"
                    >
                      <QuizCard
                        subQuiz={subQuiz}
                        currentSubQuiz={currentSubQuiz}
                        answeredId={answeredId}
                        second={second}
                        handleNextClick={handleNextClick}
                        setVideoStarted={setVideoStarted}
                        setVideoEnded={setVideoEnded}
                        setAnsweredId={setAnsweredId}
                        setSecond={setSecond}
                      />
                    </Flex>
                  )}
                  {steps[currentStep].subType === "jpSubtitle" && (
                    <Box
                      height="500px"
                      marginTop="10px"
                      paddingBottom="50px"
                      ref={desktopContainerRef}
                    >
                      {captions.map((value, index) => (
                        <Box
                          key={value.id}
                          backgroundColor={
                            currentTime > value.start && currentTime < value.end
                              ? "white"
                              : ""
                          }
                          margin="0px 30px 10px 30px"
                          padding="10px 30px"
                          borderRadius="10px"
                          ref={(el) =>
                            (desktopCaptionsRefs.current[index] = el)
                          }
                        >
                          <CaptionsBlock text={value.line} />
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
                <Flex display={{ base: "none", lg: "flex" }} width="100%">
                  {!nextDisabled && (
                    <Footer
                      onNextClick={handleNextClick}
                      onPrevClick={handlePrevClick}
                      prevDisabled={prevDisabled}
                      nextDisabled={
                        (steps[currentStep].type === "QUIZ" && !answeredId) ||
                        nextDisabled
                      }
                      visibleVideoControl={visibleVideoControl}
                    />
                  )}
                </Flex>
              </Flex>
            </Box>
          )}
        {steps[currentStep].subType === "practiceKeyword" && (
          <Box
            display={{ md: "flex" }}
            flexWrap={{ md: "wrap" }}
            justifyContent={{ md: "center", lg: "flex-start" }}
            alignItems="center"
            paddingBottom="100px"
          >
            {keywords.map((keyword) => (
              <KeywordCard
                key={keyword.id}
                japanese={keyword.japanese}
                chinese={keyword.chinese}
                width={{ md: "40%", lg: "28%", xl: "30%" }}
                backgroundColor="white"
                isCanPlay={false}
                cursor="auto"
              />
            ))}
          </Box>
        )}
        {steps[currentStep].subType === "jpKeyword" && (
          <Box
            display={{ md: "flex", lg: "none" }}
            flexWrap={{ md: "wrap" }}
            height="300px"
            paddingBottom="70px"
            justifyContent={{ md: "space-around" }}
            overflow="scroll"
          >
            {keywords.map((keyword) => (
              <KeywordCard
                key={keyword.id}
                id={keyword.id}
                width={{ md: "40%", lg: "90%" }}
                japanese={keyword.japanese}
                chinese={keyword.chinese}
                start={Math.ceil(keyword.timestampStart / 1000)}
                end={Math.ceil(keyword.timestampEnd / 1000)}
                backgroundColor="white"
                isCanPlay={true}
                playerState={playerState}
                setCurrentKeywordCard={setCurrentKeywordCard}
                isCurrent={currentKeywordCard === keyword.id}
                onPlayVideo={onPlayVideo}
                setVideoStarted={setVideoStarted}
                setVideoEnded={setVideoEnded}
                cursor="pointer"
              />
            ))}
          </Box>
        )}
        {steps[currentStep].subType === "jpSubtitle" && (
          <Box
            display={{ base: "block", lg: "none" }}
            marginTop="10px"
            paddingBottom="50px"
            overflowY="scroll"
            height="300px"
            ref={mobileContainerRef}
          >
            {captions.map((value, index) => (
              <Box
                key={value.id}
                backgroundColor={
                  currentTime > value.start && currentTime < value.end
                    ? "white"
                    : ""
                }
                margin="0px 30px 10px 30px"
                padding="10px 30px"
                borderRadius="10px"
                ref={(el) => (mobileCaptionsRefs.current[index] = el)}
              >
                <CaptionsBlock text={value.line} />
              </Box>
            ))}
          </Box>
        )}
        {steps[currentStep].type === "QUIZ" && (
          <Flex
            display={{ md: "flex", lg: "none" }}
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            paddingBottom="100px"
          >
            <QuizCard
              subQuiz={subQuiz}
              currentSubQuiz={currentSubQuiz}
              answeredId={answeredId}
              second={second}
              handleNextClick={handleNextClick}
              setVideoStarted={setVideoStarted}
              setVideoEnded={setVideoEnded}
              setAnsweredId={setAnsweredId}
              setSecond={setSecond}
            />
          </Flex>
        )}
        {nextDisabled && <FinalSection text={finalText} />}
      </Box>
      <Flex
        display={{
          base: "flex",
          lg:
            steps[currentStep].subType === "noSubtitle" ||
            steps[currentStep].subType === "practiceKeyword"
              ? "block"
              : "none",
        }}
        zIndex="999"
        position="fixed"
        alignItems="center"
        justifyContent="center"
        bottom="0px"
        width={{ base: "100%", lg: "90%" }}
      >
        {!nextDisabled && (
          <Footer
            onNextClick={handleNextClick}
            onPrevClick={handlePrevClick}
            prevDisabled={prevDisabled}
            nextDisabled={
              (steps[currentStep].type === "QUIZ" && !answeredId) ||
              nextDisabled
            }
            visibleVideoControl={visibleVideoControl}
          />
        )}
      </Flex>
    </>
  );
};

export default VideoContent;
