import { Header } from "./header";
import styled from "styled-components";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { createTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import { LoginAndPlaylistToAddRemovedSongsToInput } from "./LoginAndPlaylistToAddRemovedSongsToInput";
import { logicAndState } from "./logicAndState";
import { SongDisplay } from "./SongDisplay";
import { KeepOrRemoveInput } from "./KeepOrRemoveInput";
import { Typography } from "@material-ui/core";

const StyledApp = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #121212;
`;

const Content = styled.div`
  width: 90%;
  height: 98vh;
  padding-top: 2vh;
  margin: auto;
`;

const RefinedAllLikesMessage = styled(Typography)`
  color: white;
  width: 100%;
  text-align: center;
  padding-top: 25vh;
`;

const theme = createTheme({
  palette: {
    type: "dark",
  },
});

export const App = observer(() => {
  const { refinedAllSongs } = logicAndState;

  useEffect(() => {
    loginAndGetLikes();
  }, []);

  const loginAndGetLikes = async () => {
    await logicAndState.initialize();
    logicAndState.getLikes();
  }

  return (
    <StyledApp>
      <ThemeProvider theme={theme}>
        <Content>
          <Header />
          <LoginAndPlaylistToAddRemovedSongsToInput />
          {!refinedAllSongs ? 
            <>
              <SongDisplay />
              <KeepOrRemoveInput />
            </> :
            <RefinedAllLikesMessage>You have refined all your likes, please refresh to page if you would like to refine again from the beginning.</RefinedAllLikesMessage>
          }
        </Content>
      </ThemeProvider>
    </StyledApp>
  );
});
