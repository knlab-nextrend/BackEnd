import React from "react";
import styled from "styled-components";
import {
  AiOutlineUserDelete,
  AiOutlineUserAdd,
  AiOutlineStop,
  AiOutlineStepForward,
} from "react-icons/ai";
import { RiUserSettingsLine } from "react-icons/ri";
import { BsPersonLinesFill } from "react-icons/bs";

import { WorkerContentHeader } from "Components/WorkerContentHeader";
import { toYYYYMMDD_DOT } from "Utils/time";
import { myColors, tailwindColors } from "styles/colors";

function UserManagement({
  userData,
  openUserModifyModal,
  deleteUser,
  restrictUser,
  openUserAddModal,
  PERMISSON_DATA,
}) {
  return (
    <Wrap>
      <WorkerContentHeader title="사용자 관리" Icon={BsPersonLinesFill} />
      <AddUserWrap>
        <Button
          color="#435269"
          onClick={() => {
            openUserAddModal();
          }}
        >
          <AiOutlineUserAdd size="22" color="white" />
          <p>사용자 추가</p>
        </Button>
      </AddUserWrap>
      <TableWrapper>
        <CustomTable>
          <colgroup>
            <col style={{ width: "10%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: "8%" }} />
            <col style={{ width: "20%" }} />
          </colgroup>

          <thead>
            <tr>
              <th>사용자 ID</th>
              <th>사용자 이름</th>
              <th>이메일</th>
              <th>연락처</th>
              <th>소속</th>
              <th>직책</th>
              <th>계정 생성일</th>
              <th>사용자 권한</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {userData.map((user, index) => {
              return (
                <tr key={index}>
                  <td>{user.userID}</td>
                  <td>{user.Name}</td>
                  <td>{user.Email}</td>
                  <td>{user.Tel}</td>
                  <td>{user.Company}</td>
                  <td>{user.Position}</td>
                  <td>{toYYYYMMDD_DOT(user.CreateAt)}</td>
                  <td>{PERMISSON_DATA[user.Category]}</td>
                  <td>
                    <ButtonWrapper>
                      <Button
                        className="btn-edit"
                        onClick={() => {
                          openUserModifyModal(user);
                        }}
                      >
                        <RiUserSettingsLine size="22" color="white" />
                        <p>수정</p>
                      </Button>
                      <Button
                        className="btn-delete"
                        onClick={() => {
                          deleteUser(user.id);
                        }}
                      >
                        <AiOutlineUserDelete size="22" color="white" />
                        <p>삭제</p>
                      </Button>
                      {user.stat ? (
                        <>
                          <Button
                            className="btn-start"
                            onClick={() => {
                              restrictUser(user.id, false);
                            }}
                          >
                            <AiOutlineStepForward size="22" color="white" />
                            <p>재개</p>
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            className="btn-stop"
                            onClick={() => {
                              restrictUser(user.id, true);
                            }}
                          >
                            <AiOutlineStop size="22" color="white" />
                            <p>중지</p>
                          </Button>
                        </>
                      )}
                    </ButtonWrapper>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </CustomTable>
      </TableWrapper>
    </Wrap>
  );
}

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 1280px;
  width: 100%;
  padding: 1.5rem 3rem;
`;

const AddUserWrap = styled.div`
  display: flex;
  width: 100%;
  padding: 2rem 0 0.5rem;

  & button {
    padding: 0.5rem 1rem;
    margin: 0;
    background-color: ${myColors.blue500};
    border-radius: 0;
    p {
      font-size: 1rem;
    }
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const Button = styled.button`
  margin: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.3rem 1rem 0.3rem 1rem;
  border-radius: 5px;
  border: none;
  background-color: ${(props) => props.color || "grey"};
  cursor: pointer;
  min-width: 5rem;
  p {
    margin-left: 0.5rem;
    font-size: 12px;
    font-weight: bold;
    color: white;
  }

  &.btn-edit {
    background-color: ${myColors.blue500};
  }
  &.btn-delete {
    background-color: ${myColors.red};
  }
  &.btn-stop {
  }
  &.btn-start {
    background-color: ${myColors.green300};
  }
`;
const TableWrapper = styled.div`
  width: 100%;
  max-height: 65rem;
  overflow: auto;
  box-shadow: rgb(9 30 66 / 25%) 0px 1px 1px;
`;
const CustomTable = styled.table`
  width: 100%;
  text-align: center;
  border-collapse: collapse;
  thead {
    position: sticky;
    top: 0px;
    border-bottom: solid 1px ${tailwindColors["grey-400"]};
    background-color: ${tailwindColors["grey-100"]};
    color: ${tailwindColors.black};
    font-weight: bold;
  }
  tr {
    height: 2.5rem;
  }
  tr:nth-child(2n) {
    background-color: ${tailwindColors["grey-100"]};
  }
  input[type="checkbox"] {
    width: 20px; /*Desired width*/
    height: 20px; /*Desired height*/
  }
`;

export default UserManagement;
