import { Heading, Table, Thead, Tr, Th, Tbody, Text } from '@chakra-ui/react';
import { NextPage } from 'next';
import React from 'react';
import { AppLayout } from '../../components/Layout';
import { VideoTableRow } from '../../components/Videos';

export interface Video {
  id: string;
  title: string;
  durationInSeconds: number;
  url: string;
}

const Videos: NextPage = () => {
  const [videos, setVideos] = React.useState<Video[]>([]);

  React.useEffect(() => {
    const fetchVideos = async () => {
      // Get all videos
      const res = await fetch('/api/videos');
      const videosList = await res.json();

      // Set page status
      setVideos(videosList);
    };

    fetchVideos();
  }, []);

  return (
    <AppLayout>
      <Heading>Videos</Heading>
      {videos.length <= 0 ? (
        <Text>No Videos Found</Text>
      ) : (
        <Table>
          <Thead>
            <Tr>
              <Th>Title</Th>
              <Th>Duration</Th>
            </Tr>
          </Thead>
          <Tbody>
            {videos.map((video) => (
              <VideoTableRow key={video.id} video={video} />
            ))}
          </Tbody>
        </Table>
      )}
    </AppLayout>
  );
};

export default Videos;
