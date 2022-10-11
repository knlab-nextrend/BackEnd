import React, { useState } from "react";
import styled, { css } from "styled-components";
import { AiOutlineSearch, AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { BiRefresh } from "react-icons/bi";

function SearchOption() {
  const [optionIsOpen, setOptionIsOpen] = useState(false);
  const [startDate, setStartDate] = useState("1970-01-01"); // startDate
  const [endDate, setEndDate] = useState(
    new Date().toISOString().substring(0, 10)
  ); //endDate
  const [keyword, setKeyword] = useState(""); // keyword
  const [itemId, setItemId] = useState(""); // itemID
  const [lang, setLang] = useState(""); // language
  const [subscribed, setSubscribed] = useState(0); //subscribed

  const [subscribedOption, setSubscribedOption] = useState([
    { value: 0, label: "전체", color: "grey" },
    { value: 1, label: "기조회", color: "#6DAF44" },
    { value: 2, label: "미조회", color: "#F44336" },
  ]);

  const _keywordHandler = (e) => {
    setKeyword(e.target.value);
  };
  const _itemIdHandler = (e) => {
    setItemId(e.target.value);
  };
  const _langHandler = (e) => {
    setLang(e.target.value);
  };
  const _subscribedHandler = (value) => {
    setSubscribed(value);
  };
  const _calcDateDifference = (start, end) => {
    if (Date.parse(new Date()) - Date.parse(end) < 0) {
      // 현재 시점에서 미래의 날짜는 선택할 수 없음
      return false;
    }
    return Date.parse(end) - Date.parse(start) >= 0 || false; // endDate가 startDate보다 과거라면 해당 날짜는 선택할 수 없음.
  };
  const _startDateHandler = (e) => {
    setStartDate(e.target.value);
  };
  const _endDateHandler = (e) => {
    if (_calcDateDifference(startDate, e.target.value)) {
      setEndDate(e.target.value);
    } else {
      alert("시간 선택이 잘못되었습니다.");
      setEndDate(new Date().toISOString().substring(0, 10));
    }
  };
  const _OptionReset = () => {
    setKeyword("");
    setStartDate(new Date().toISOString().substring(0, 10));
    setEndDate(new Date().toISOString().substring(0, 10));
    setItemId("");
    setLang("");
    setSubscribed(0);
  };

  return (
    <>
      <Wrapper>
        <SearchBarContainer>
          <SearchBar>
            <AiOutlineSearch color="#BFBFBF" size="24" />
            <input
              type="text"
              placeholder="검색어를 입력하세요..."
              value={keyword}
              onChange={_keywordHandler}
            ></input>
          </SearchBar>
          <SearchButton
            color="#435269"
          >
            검색
          </SearchButton>
          {optionIsOpen ? (
            <SearchButton
              color="#888888"
              onClick={() => {
                setOptionIsOpen(false);
              }}
            >
              <AiOutlineMinus />
              검색 조건 접기
            </SearchButton>
          ) : (
            <SearchButton
              color="#888888"
              onClick={() => {
                setOptionIsOpen(true);
              }}
            >
              <AiOutlinePlus />
              검색 조건 펼치기
            </SearchButton>
          )}
        </SearchBarContainer>
        {optionIsOpen && (
          <OptionContainer>
            <OptionRow>
              <OptionCol>
                <OptionTitle>기간</OptionTitle>
                <OptionInput
                  onChange={_startDateHandler}
                  value={startDate}
                  type="date"
                ></OptionInput>
                <OptionInput
                  onChange={_endDateHandler}
                  value={endDate}
                  last
                  type="date"
                ></OptionInput>
              </OptionCol>
            </OptionRow>
            <OptionRow>
              <OptionCol>
                <OptionTitle>ITEM ID</OptionTitle>
                <OptionInput
                  min="0"
                  value={itemId}
                  type="number"
                  onChange={_itemIdHandler}
                ></OptionInput>
              </OptionCol>
              <OptionCol>
                <OptionTitle>언어</OptionTitle>
                <OptionSelect value={lang} onChange={_langHandler}>
                  <option value={""}>전체</option>
                  <option value="ko">한국</option>
                  <option value="us">미국</option>
                  <option value="jp">일본</option>
                  <option value="other">그외</option>
                </OptionSelect>
              </OptionCol>
            </OptionRow>
            <OptionRow>
              <OptionCol>
                <OptionTitle>조회 여부</OptionTitle>
                <OptionRadioGroup>
                  {subscribedOption.map((item, i) => {
                    return (
                      <OptionButton
                        key={i}
                        color={item.color}
                        value={item.value}
                        onClick={() => {
                          _subscribedHandler(item.value);
                        }}
                        active={subscribed === item.value}
                      >
                        {item.label}
                      </OptionButton>
                    );
                  })}
                </OptionRadioGroup>
              </OptionCol>
            </OptionRow>
            <ResetButton onClick={_OptionReset}>
              <BiRefresh size="24" />
              검색 조건 초기화
            </ResetButton>
          </OptionContainer>
        )}
      </Wrapper>
    </>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 2rem 0 2rem 0;
  width: 960px;
  justify-content: center;
`;
const SearchBarContainer = styled.div`
  display: flex;
  width: 100%;
`;
const SearchBar = styled.div`
  height: 3rem;
  display: flex;
  align-items: center;
  padding-left: 1rem;
  width: 100%;
  border: solid 1px #d6d6d6;
  input {
    border: none;
    &:focus {
      outline: none;
    }
  }
`;
const SearchButton = styled.button`
  min-width: 200px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  color: white;
  background-color: ${(props) => props.color || "grey"};
`;

const OptionContainer = styled.div`
  padding: 1rem 0 1rem 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  border: solid 1px #d6d6d6;
`;

const OptionRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 45px;
  margin: 1rem;
`;
const OptionCol = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  margin: 0 1rem 0 1rem;
`;
const OptionTitle = styled.div`
  width: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 45px;
  background-color: #d6d6d6;
  font-size: 12px;
  margin-right: 0.5rem;
`;

const OptionInput = styled.input`
  display: flex;
  align-items: center;
  height: 100%;
  width: 100%;
  border: solid 1px #d6d6d6;
  margin: 0 0.5rem 0 0.5rem;
  padding-left: 0.5rem;
`;

const OptionSelect = styled.select`
  display: flex;
  align-items: center;
  height: 100%;
  width: 100%;
  border: solid 1px #d6d6d6;
  margin: 0 0.5rem 0 0.5rem;
  padding-left: 0.5rem;
`;

const OptionRadioGroup = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  width: 100%;

  input[type="radio"] {
    display: none;
  }
`;

const OptionButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  width: 100%;
  height: 100%;
  font-size: 15px;
  background-color: white;
  color: ${(props) => props.color || "black"};
  border: solid 1px ${(props) => props.color || "black"};
  margin: 0 0.5rem 0 0.5rem;
  transition: all 0.2s;

  ${(props) =>
    props.active &&
    css`
      color: white;
      background-color: ${(props) => props.color || "black"};
      font-weight: bold;
    `};

  &:hover {
    color: white;
    font-weight: bold;
    background-color: ${(props) => props.color || "black"};
  }
`;
const ResetButton = styled.button`
  margin: 1rem;
  max-width: 150px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  background-color: #d6d6d6;
  &:hover {
    background-color: #eee;
  }
`;

export default SearchOption;
