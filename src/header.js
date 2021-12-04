import React from "react";
import styled from "styled-components";
import spotifyLogo from "./spotifyLogo.png";

const StyledHeader = styled.div`
  display: flex;
  width: 100%;
  height: 7vh;
`;

const Title = styled.h1`
  color: #1ab26b;
  margin: auto 0;
`;

const Logo = styled.img`
  height: 100%;
  width: auto;
  margin: auto 0;
  margin-right: 1rem;
`;

export const Header = () => {
  return (
    <StyledHeader>
      <Logo src={spotifyLogo} />
      <Title>Refine Your Likes</Title>
    </StyledHeader>
  );
};
