import React, { useEffect } from "react";
import styled from "styled-components";
import FormHeader from "../../../Components/FormHeader";
function UserCustomMenu({
  userList,
  currentUserId,
  setCurrentUserId,
  openCategoryModal,
  previewAxisMenu,
  axisCategoryInfo,
  saveUserAxisData
}) {
  return (
    <>
      <FormHeader type={"view"} title={"맞춤형 화면 생성"} />
      <Wrapper>
        <UserListCard>
          <div className="title">
            <div className="title-main">사용자 목록</div>
            <div className="title-sub">
              사용자 맞춤형 화면을 생성 또는 수정하시려면 사용자 목록에서
              사용자를 클릭하세요.
            </div>
          </div>
          <div className="content">
            {userList.map((user, index) => {
              return (
                <UserCard
                  key={index}
                  active={user.id === currentUserId}
                  onClick={() => {
                    setCurrentUserId(user.id);
                  }}
                >
                  <div className="name-and-id">
                    <div className="name">{user.Name}</div>
                    <div className="id">{user.userID}</div>
                  </div>
                  <div className="company">
                    {user.Company || "소속 없음"} /{" "}
                    {user.Position || "직책 없음"}
                  </div>
                </UserCard>
              );
            })}
          </div>
        </UserListCard>
        <MenuCustomCard>
          <div className="title">
            <div className="title-main">사용자 맞춤형 X축 및 Y축 설정</div>
            <div className="title-sub">
              해당 축에 표시할 분류를 선택하세요. 선택한 분류의 하위 분류가 해당
              축의 메뉴로 표출됩니다. 클릭시 모달창이 뜹니다. X축과 Y축이 동일한 카테고리 타입을 가질 수 없습니다.
            </div>
          </div>
          <div className="content">
            <AxisCardWrapper>
              <AxisCard>
                <button
                  className="axis-setting"
                  onClick={() => {
                    openCategoryModal("X");
                  }}
                >
                  X축 설정
                </button>
                <div className="axis-contents">
                  <div className="category-info">{axisCategoryInfo.X.category_type || "선택없음"}</div>
                  <div>{`>`}</div>
                  <div className="category-code">{axisCategoryInfo.X.select_category_name || "선택없음"}</div>
                </div>
              </AxisCard>
              <AxisCard>
                <button
                  className="axis-setting"
                  onClick={() => {
                    openCategoryModal("Y");
                  }}
                >
                  Y축 설정
                </button>
                <div className="axis-contents">
                  <div className="category-info">{axisCategoryInfo.Y.category_type || "선택없음"}</div>
                  <div>{`>`}</div>
                  <div className="category-code">{axisCategoryInfo.Y.select_category_name || "선택없음"}</div>
                </div>
              </AxisCard>
            </AxisCardWrapper>
            <PreviewMenuWrapper>
              <div className="axis-title">미리보기</div>
              <div className="axis-x-menu">
                {previewAxisMenu.X.map((item,index) => {
                  return <div key={index}>{item.ct_nm}</div>;
                })}
              </div>
              <div className="axis-y-menu">
              {previewAxisMenu.Y.map((item,index) => {
                  return <div key={index}>{item.ct_nm}</div>;
                })}
              </div>
              <div className="contents-body">해당 위치에 조건에 맞는 자료가 표출됩니다.</div>
            </PreviewMenuWrapper>
            <div className="action">
              <SaveButton onClick={saveUserAxisData}>저장</SaveButton>
            </div>
          </div>
        </MenuCustomCard>
      </Wrapper>
    </>
  );
}

const Wrapper = styled.div`
  display: flex;
  padding: 1rem;
  font-size: 14px;
  min-height: 1280px;
  background-color: #eee;
  color: rgb(59, 59, 59);
`;

const PreviewMenuWrapper = styled.div`
  padding: 0.5rem;
  display: grid;
  grid-template-columns: 1fr 8fr;
  grid-template-rows: 50px minmax(200px, auto);
  .axis-title {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: white;
    grid-column: 1 / 2;
    grid-row: 1 / 2;
    color: #009999;
    font-weight:bold;
  }
  .axis-x-menu {
    display: flex;
    align-items: center;
    flex-direction: row;
    color: white;
    background-color: #435269;
    grid-column: 2 / 3;
    grid-row: 1 / 2;
    div {
      display: flex;
      align-items: center;
      height: 100%;
      padding-left: 1.5rem;
      padding-right: 1.5rem;
      text-align: center;
      &:hover {
        background-color: rgba(255, 255, 255, 0.2);
      }
    }
  }
  .axis-y-menu {
    display: flex;
    flex-direction: column;
    background-color: #eee;
    grid-column: 1 / 2;
    grid-row: 2 / 3;
    div {
      padding: 0.5rem;
      text-align: center;
      &:hover {
        background-color: #d6d6d6;
      }
    }
  }
  .contents-body {
    grid-column: 2 / 3;
    grid-row: 2 / 3;
    display:flex;
    justify-content:center;
    align-items:center;
  }
`;
const CardWrapper = styled.div`
  margin: 1rem 0.5rem 1rem 0.5rem;
  border-radius: 4px;
  box-shadow: 0 0 0.875rem 0 rgba(33, 37, 41, 0.05);
  background-color: white;
  height: 100%;
  .title {
    font-weight: bold;
    border-bottom: 1px solid #e6e9ed;
    padding: 1rem;
  }
  .title-main {
    font-size: 18px;
    color: rgb(59, 59, 59);
    padding-bottom: 0.25rem;
  }
  .title-sub {
    font-size: 12px;
    color: #939ba2;
  }
  .content {
    padding: 1rem;
    height: 100%;
  }
`;

const MenuCustomCard = styled(CardWrapper)`
  width: 80%;
  .content {
    min-height: 35rem;
  }
`;
const SaveButton = styled.button`
  margin: 0.5rem;
  height: 2rem;
  border: none;
  padding: 0 1rem 0 1rem;
  border-radius: 5px;
  background-color: #435269;
  color: white;
  font-weight: bold;
  cursor: pointer;
`;
const UserListCard = styled(CardWrapper)`
  width: 20%;
  .content {
    background-color: #f6f6f6;
    height: 35rem;
    overflow: scroll;
  }
`;
const UserCard = styled.div`
  background-color: ${(props) =>
    props.active ? "rgba(67,82,105,0.05)" : "white"};

  border-radius: 4px;
  box-shadow: 0 0 0.875rem 0 rgba(33, 37, 41, 0.05);
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  border-left: ${(props) => (props.active ? "solid 5px #435269" : null)};
  &:hover {
    transform: scale(1.02);
    cursor: pointer;
  }
  .name-and-id {
    display: flex;
  }
  .name {
    color: #009999;
    font-weight: bold;
    font-size: 16px;
    margin-right: 1rem;
  }
  .id {
    color: #939ba2;
  }
  .company {
    font-size: 12px;
    margin-top: 0.25rem;
  }
`;
const AxisCardWrapper = styled.div`
  display: flex;
`;
const AxisCard = styled.div`
  padding: 0.5rem;
  display: flex;
  .axis-setting {
    cursor: pointer;
    border: none;
    display: flex;
    background-color: #435269;
    color: white;
    font-weight: bold;
    border-radius: 4px;
    padding: 0.5rem 1rem 0.5rem 1rem;
    align-items: center;
    margin-right: 0.5rem;
  }
  .axis-contents {
    display: flex;
    border: 1px solid #e6e9ed;
    border-radius: 4px;
    padding: 0.5rem 1rem 0.5rem 1rem;
    align-items: center;
    .category-info {
      color: #435269;
      font-size: 16px;
      font-weight: bold;
      padding: 4px;
    }
    .category-code {
      padding: 4px;
    }
  }
`;
export default UserCustomMenu;
