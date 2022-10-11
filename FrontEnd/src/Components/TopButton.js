import React from "react"
import styled from "styled-components"
import {BiArrowToTop} from "react-icons/bi"
function TopButton(){
    const scrollToTop = ()=>{
        window.scrollTo(0, 0);
    }
    return (<Top onClick={scrollToTop}><BiArrowToTop/></Top>)
}

const Top = styled.button`
  display: flex;
  position: fixed;
  align-items: center;
  justify-content: center;
  height: 3rem;
  width:3rem;
  border: none;
  border-radius: 3rem;
  font-size: 20px;
  background-color: #435269;
  color: white;
  border: solid 1px #d6d6d6;
  box-shadow: 0 0 0.875rem 0 rgba(33, 37, 41, 0.05);
  z-index: 999;
  right: 0;
  bottom: 0;
  margin: 2rem;
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    background-color: #d8dee6;
    color: #435269;
    font-weight: bold;
  }
  & * {
    margin: 4px;
  }
`;
export default TopButton;
