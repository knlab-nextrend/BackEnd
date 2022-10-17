import React, { useEffect } from "react";
import { usePromiseTracker } from "react-promise-tracker";
import styled from "styled-components";
import BeatLoader from "react-spinners/BeatLoader";
function Loading() {
  const { promiseInProgress } = usePromiseTracker();
  return (
    <>
      {promiseInProgress && (
        <>
          <Background>
            <LoaderContainer>
              <BeatLoader margin={7} size={20} color={"#435269"} />
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
  background-color: rgba(0, 0, 0, 0.1);
`;

const LoaderContainer = styled.div`
  display: block;
  z-index: 10;
  /* position: fixed; */
  /* left: 50%; */
  /* top: 50%; */
`;

export default Loading;
