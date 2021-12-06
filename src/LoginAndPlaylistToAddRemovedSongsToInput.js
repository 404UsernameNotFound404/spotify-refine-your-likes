import { Button, TextField } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import spotifyLogo from "./spotifyLogo.png";
import { observer } from "mobx-react-lite";
import { logicAndState } from "./logicAndState";

const TokenInputContainer = styled.div`
  /* display: flex; */
  width: 100%;
  height: 20vh;
`;

const StyledTextField = styled(TextField)`
    && {
        margin-top: 2rem;
        font-size: 4rem;

    }
`;

export const LoginAndPlaylistToAddRemovedSongsToInput = observer(() => {
  const { token } = logicAndState;
  const [playlistLink, setPlaylistLink] = useState("");

  useEffect(() => {
    if (playlistLink.length < 33) return;
    const idAndSearch = playlistLink.substring(34, playlistLink.length - 1);
    const id = idAndSearch.split("?")[0];
;    logicAndState.setPlaylistToAddRemovedSongsTo(id);
  }, [playlistLink]);

  return (
    <TokenInputContainer>
      <Button onClick={() => logicAndState.login()}>login</Button>
      <StyledTextField value={playlistLink} onChange={(event) => setPlaylistLink(event.target.value)} fullWidth label={`Enter the playlist you want the songs moved to (if left blank it will just be removed from your likes). To get link go to playlist and click the 3 dots and hover over share and click "Copy link to playlist"`} size={"medium"} />
    </TokenInputContainer>
  );
});

// https://open.spotify.com/playlist/1Fw6IhYdgy8cxENSChS9iv?si=4ab89b4f0ce143c3

// https://open.spotify.com/playlist/05Vc5hCIkkZCnql6Xt9Qtn?si=ba20a9bfcde8451c