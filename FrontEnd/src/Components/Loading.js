import React from "react";
import { usePromiseTracker } from "react-promise-tracker";
import styled from "styled-components";
import BeatLoader from "react-spinners/BeatLoader";
import { myColors } from "styles/colors";
function Loading() {
  const { promiseInProgress } = usePromiseTracker();
  return (
    <>
      {promiseInProgress && (
        <>
          <Background>
            <LoaderContainer>
              <BeatLoader margin={7} size={20} color={myColors.blue300} />
            </LoaderContainer>
          </Background>
        </>
      )}
    </>
  );
}

const Background = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  z-index: 10;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
`;

const LoaderContainer = styled.div`
  display: block;
  z-index: 10;
`;

export default Loading;
