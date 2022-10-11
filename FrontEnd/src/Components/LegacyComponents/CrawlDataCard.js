import React from "react";
import styled from "styled-components";
function CrawlDataCard({ crawlDataItem }) {
  return (
    <>
      <Card>
        <Wrapper>
          <ItemID>{crawlDataItem._id}</ItemID>
        </Wrapper>

        <Content>
          <div className="title">{crawlDataItem.dc_title_kr}</div>
          <div className="subTitle">{crawlDataItem.dc_title_or}</div>
          <div className="writeDate">{crawlDataItem.dc_dt_collect}</div>
          <Keywords>
            {crawlDataItem.dc_keyword.map((keyword, i) => {
              return <Chips key={i}>{keyword}</Chips>;
            })}
          </Keywords>
        </Content>
      </Card>
    </>
  );
}

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 10%;
  &:nth-child(1) {
    font-size: 20px;
  }
`;
const ItemID = styled.div``;
const Card = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: row;
  background-color: white;
  border: solid 1px #d6d6d6;
  /* box-shadow: 3px 3px 15px 3px rgba(0, 0, 0, 0.1); */
  box-shadow : rgb(9 30 66 / 25%) 0px 1px 1px;
  border-radius: 4px;
  align-items: center;
  padding: 1rem;
  margin: 1rem 0 1rem 0;
  justify-content: space-between;
  &:hover {
    transition: all 0.2s;
    filter: blur(2px);
    background-color: #eee;
  }
`;
const Keywords = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;
const Content = styled.div`
  margin-left: 1rem;
  flex-grow: 10;
  display: flex;
  flex-direction: column;
  width: 80%;
  .title,
  .subTitle,
  .writeDate {
    margin-bottom: 0.5rem;
    word-break: break-all;
  }
  .title {
    font-size: 24px;
  }
`;
const Chips = styled.div`
  padding: 3px 12px;
  border-radius: 32px;
  font-size: 13px;
  background-color: #d6d6d6;
  margin: 3px 3px 3px 0px;
`;

export default CrawlDataCard;
