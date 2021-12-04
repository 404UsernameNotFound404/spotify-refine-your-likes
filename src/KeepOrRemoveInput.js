import React from "react";
import styled from "styled-components";
import { observer } from "mobx-react-lite";
import { logicAndState } from "./logicAndState";
import { Button } from "@material-ui/core";

const StyledKeepOrRemoveInput = styled.div`
  width: 50%;
  margin: auto;
  margin-top: 2rem;
  display: flex;
  justify-content: space-between;
`;

export const KeepOrRemoveInput = () => {
  return (
    <StyledKeepOrRemoveInput>
        <Button onClick={() => logicAndState.removeSong()} variant="contained" color="secondary">Remove</Button>
        <Button onClick={() => logicAndState.goToNextSong()} variant="contained" color="primary">Keep</Button>
    </StyledKeepOrRemoveInput>
  );
};
