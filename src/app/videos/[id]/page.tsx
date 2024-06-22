import { Box, Flex } from "@chakra-ui/react";
import VideoContent from "../../components/VideoContent";
import axios from "axios";

async function getVideo(id: string) {
  const res = await axios.get(`https://jp-echo.onrender.com/video/${id}`);
  const video = await res.data;
  return video;
}

async function getCaptions(id: string) {
  const res = await axios.get(
    `https://jp-echo.onrender.com/video/${id}/subtitle`
  );
  const captions = await res.data;
  return captions;
}
type CaptionsData = {
  id: number;
  subtitleId: number;
  lineIndex: number;
  line: string;
  timestampStart: number;
  timestampEnd: number;
  start: number;
  end: number;
}[];

async function Home({ params }: { params: { id: string } }) {
  const { id } = params;

  const video = await getVideo(id);
  const captionsData: CaptionsData = await getCaptions(id);
  const captions = captionsData.map((captions) => ({
    ...captions,
    start: Math.ceil(captions.timestampStart / 1000),
    end: Math.ceil(captions.timestampEnd / 1000),
  }));

  return (
    <Flex width="100%" justifyContent="center">
      <VideoContent
        steps={video.steps}
        keywords={video.keywords}
        quiz={video.quiz}
        videoUrl={video.url}
        timestampStart={Math.ceil(video.timestampStart / 1000)}
        timestampEnd={Math.ceil(video.timestampEnd / 1000)}
        captions={captions}
      />
    </Flex>
  );
}

export default Home;
