import React from "react";
import styled from "styled-components";
import { BsRulers } from "react-icons/bs";

import { WorkerContentHeader } from "Components/WorkerContentHeader";
import { myColors, tailwindColors } from "styles/colors";

function UserCustomMenu({
  userList,
  currentUserId,
  onClickUser,
  openCategoryModal,
  previewAxisMenu,
  axisCategoryInfo,
  saveUserAxisData,
}) {
  return (
    <Wrap>
      <WorkerContentHeader title="맞춤형 화면 생성" Icon={BsRulers} />
      <Content>
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
                    onClickUser(user.id);
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
              축의 메뉴로 표출됩니다. 클릭시 모달창이 뜹니다. X축과 Y축이 동일한
              카테고리 타입을 가질 수 없습니다.
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
                  주제 1
                </button>
                <div className="axis-contents">
                  <div className="category-info">
                    {axisCategoryInfo.X.name || "선택없음"}
                  </div>
                </div>
              </AxisCard>
              <AxisCard>
                <button
                  className="axis-setting"
                  onClick={() => {
                    openCategoryModal("Y");
                  }}
                >
                  주제 2
                </button>
                <div className="axis-contents">
                  <div className="category-info">
                    {axisCategoryInfo.Y.name || "선택없음"}
                  </div>
                </div>
              </AxisCard>
              <div className="action">
                <SaveButton onClick={saveUserAxisData}>저장</SaveButton>
              </div>
            </AxisCardWrapper>
            <PreviewMenuWrapper>
              <div className="menu-area">
                <div className="menu-container">
                  <div>{axisCategoryInfo.X.name}</div>
                  <div className="menu-item-container">
                    {previewAxisMenu.X.map((item, index) => (
                      <div key={index}>{item.ct_name}</div>
                    ))}
                  </div>
                </div>
                <div className="menu-container">
                  <div>{axisCategoryInfo.Y.name}</div>
                  <div className="menu-item-container">
                    {previewAxisMenu.Y.map((item, index) => (
                      <div key={index}>{item.ct_name}</div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="contents-body">
                해당 위치에 조건에 맞는 자료가 표출됩니다.
              </div>
            </PreviewMenuWrapper>
          </div>
        </MenuCustomCard>
      </Content>
    </Wrap>
  );
}

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 1024px;
  width: 100%;
  height: 100%;
  padding: 1.5rem 3rem;
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  font-size: 14px;
`;

const PreviewMenuWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  .menu-area {
    border: 1px solid ${tailwindColors["grey-200"]};
    & > * + * {
      .menu-item-container {
        border-top: 1px solid ${tailwindColors["grey-200"]};
      }
    }
  }

  .menu-container {
    display: flex;
    align-items: center;
    width: 100%;
    height: 3rem;

    & > div:first-of-type {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 140px;
      height: 100%;
      background-color: ${myColors.blue500};
      font-weight: bold;
      color: ${tailwindColors.white};
    }

    .menu-item-container {
      flex: 1;
      display: flex;
      align-items: center;
      overflow-x: auto;
      height: 100%;

      & > div {
        display: flex;
        align-items: center;
        height: 100%;
        padding: 0 1.5rem;
        :hover {
          background-color: ${tailwindColors["grey-100"]};
        }
      }
    }
  }
  .contents-body {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    margin-top: 5rem;
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
    display: flex;
    flex-direction: column;
    gap: 2rem;
    min-height: 35rem;
  }
`;
const SaveButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 1rem 2rem;
  background-color: ${myColors.green300};
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
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  border-radius: 4px;
  border-left: ${(props) =>
    props.active ? `solid 5px ${myColors.blue400}  ` : null};
  background-color: ${tailwindColors.white};
  box-shadow: 0 0 0.875rem 0 rgba(33, 37, 41, 0.05);

  &:hover {
    transform: scale(1.02);
    cursor: pointer;
  }
  .name-and-id {
    width: 100%;
    display: flex;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .name {
    color: ${(props) =>
      props.active ? myColors.blue400 : tailwindColors["grey-600"]};
    font-weight: bold;
    font-size: 16px;
    margin-right: 1rem;
  }
  .id {
    flex: 1;
    color: #939ba2;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .company {
    font-size: 12px;
    margin-top: 0.25rem;
  }
`;
const AxisCardWrapper = styled.div`
  display: flex;
  gap: 2rem;

  .action {
    margin-left: auto;
  }
`;
const AxisCard = styled.div`
  display: flex;
  .axis-setting {
    cursor: pointer;
    border: none;
    display: flex;
    background-color: ${myColors.blue500};
    color: white;
    font-weight: bold;
    padding: 0.5rem 1rem;
    align-items: center;
  }
  .axis-contents {
    display: flex;
    border: 1px solid #e6e9ed;
    padding: 0.5rem 1rem 0.5rem 1rem;
    align-items: center;
    .category-info {
      color: ${myColors.blue500};
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
