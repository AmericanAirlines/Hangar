import React from 'react';
import { Tr, Td, useTheme, Link } from '@chakra-ui/react';

export interface VideoTableRowProps {
  video: {
    title: string;
    durationInSeconds: number;
    url: string;
  };
}

export const VideoTableRow: React.FC<VideoTableRowProps> = ({ video }) => {
  const theme = useTheme();

  // Convert durationInSeconds
  var hours = Math.floor(video.durationInSeconds / 3600);
  var minutes = Math.floor((video.durationInSeconds - hours * 3600) / 60);
  var seconds = video.durationInSeconds % 60;

  // Format time values
  const formattedHours = hours.toString().padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedSeconds = seconds.toString().padStart(2, '0');

  return (
    <Tr>
      <Td>
        <Link href={video.url}>{video.title}</Link>
      </Td>
      <Td>
        {formattedHours}:{formattedMinutes}:{formattedSeconds}
      </Td>
    </Tr>
  );
};
