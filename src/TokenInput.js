import { Button, TextField } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import spotifyLogo from "./spotifyLogo.png";
import { observer } from "mobx-react-lite";
import { logicAndState } from "./logicAndState";

const TokenInputContainer = styled.div`
  display: flex;
  width: 100%;
  height: 7vh;
`;

const StyledTextField = styled(TextField)`
    && {
        margin-top: 2rem;
        font-size: 4rem;

    }
`;

export const TokenInput = observer(() => {
  const { token } = logicAndState;
  return (
    <TokenInputContainer>
        <Button onClick={() => logicAndState.login()}>login</Button>
      {/* <StyledTextField fullWidth label={"Please enter your token. You Can find your token here https://developer.spotify.com/documentation/web-playback-sdk/quick-start/#"} size={"medium"} value={token} onChange={(event) => logicAndState.setToken(event.target.value)} /> */}
    </TokenInputContainer>
  );
});
