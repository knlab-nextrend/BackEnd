import React, { useState,useEffect } from "react";
import styled from "styled-components";
import { FetchUsersApi } from "../../Utils/api";

function UserSelectCard({ currentUserIdHandler,setCurrentUserId}) {
  const [userList, setUserList] = useState([]); // 유저 목록
  const getUserList = () => {
    FetchUsersApi().then((res) => {
      setUserList(
        res.data.filter((user) => {
          return user.Category !== "0";
        })
      );
    });
  };
  useEffect(() => {
    getUserList();
  }, []);
  useEffect(() => {
    if (userList.length !== 0) {
      setCurrentUserId(userList[0].id); // 첫번째 사용자를 초기 사용자로 세팅.
    }
  }, [userList]);

  return (
    <CardWrapper>
      <div className="title">
        <select className="user-select" onChange={currentUserIdHandler}>
          {userList.map((user, index) => {
            return (
              <option key={index} value={user.id}>
                {user.Name} [ {user.userID} ]
              </option>
            );
          })}
        </select>
        <div className="sub">의 작업 통계 입니다.</div>
      </div>
    </CardWrapper>
  );
}

const CardWrapper = styled.div`
  margin: 1rem 0.5rem 1rem 0.5rem;
  border-radius: 4px;
  box-shadow: 0 0 0.875rem 0 rgba(33, 37, 41, 0.05);
  background-color: white;
  color: rgb(59, 59, 59);
  display: flex;
  padding: 1rem;
  .title {
    display: flex;
    align-items: center;
  }
  .user-select {
    font-size: 18px;
    color: rgb(59, 59, 59);
    margin-right: 0.5rem;
    border: none;
    &:focus {
      outline: none;
    }
    & option {
      font-size: 12px;
    }
  }
  .sub {
    font-size: 14px;
    color: #939ba2;
  }
  .content {
    height: 100%;
  }
  ul {
    display: flex;
    margin: 0;
    padding: 0;
  }
`;

export default UserSelectCard;
