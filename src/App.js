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

const theme = createTheme({
  palette: {
    type: "dark",
  },
});

export const App = observer(() => {

  useEffect(() => {
    logicAndState.initialize();
  }, [])

  return (
    <StyledApp>
      <ThemeProvider theme={theme}>
        <Content>
          <Header />
          <LoginAndPlaylistToAddRemovedSongsToInput />
          <SongDisplay />
          <KeepOrRemoveInput />
        </Content>
      </ThemeProvider>
    </StyledApp>
  );
});