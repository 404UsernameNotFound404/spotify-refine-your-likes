import React from "react";
import styled from "styled-components";
import { observer } from "mobx-react-lite";
import { logicAndState } from "./logicAndState";

const StyledSongDisplay = styled.div`
  width: fit-content;
  margin: auto;
`;

const AlbumImage = styled.img`
    display: block;
    margin: auto;
    height: 50vh;
    border-radius: 0.2rem;
`;

const SongTitle = styled.h4`
    color: white;
    width: 100%;
    margin: 0.5rem 0;
`;

const Artist = styled.p`
    color: grey;
    margin: 0;

`;

export const SongDisplay = observer(() => {
  const { selectedSong } = logicAndState;

  if (!selectedSong) return <></>;
  const {name, artists, image} = selectedSong;
  return (
    <StyledSongDisplay>
        <AlbumImage src={image} />
        <SongTitle>{name}</SongTitle>
        <Artist>{artists.map((ele, i) => (i + 1) !== artists.length ? ele + ", " : ele)}</Artist>
    </StyledSongDisplay>
  );
});
