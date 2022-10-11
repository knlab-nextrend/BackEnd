import React from "react";
import FormHeader from "../../../Components/FormHeader";
import styled from "styled-components";
import {
  AiOutlineUserDelete,
  AiOutlineUserAdd,
  AiOutlineStop,
  AiOutlineStepForward,
} from "react-icons/ai";
import { RiUserSettingsLine } from "react-icons/ri";
function UserManagement({
  userData,
  openUserModifyModal,
  deleteUser,
  restrictUser,
  openUserAddModal,
  PERMISSON_DATA
}) {
  return (
    <>
      <FormHeader type={"view"} title={"사용자 관리"} />
      
      <TableWrapper>
        <CustomTable>
          <colgroup>
            <col style={{ width: "5%" }} />
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
              <th>UID</th>
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
                  <td>{user.id}</td>
                  <td>{user.userID}</td>
                  <td>{user.Name}</td>
                  <td>{user.Email}</td>
                  <td>{user.Tel}</td>
                  <td>{user.Company}</td>
                  <td>{user.Position}</td>
                  <td>{user.CreateAt.substring(0, 19).replace("T", " ")}</td>
                  <td>{PERMISSON_DATA[user.Category]}</td>
                  <td>
                    <ButtonWrapper>
                      <Button
                        onClick={() => {
                          openUserModifyModal(user);
                        }}
                      >
                        <RiUserSettingsLine size="22" color="white" />
                        <p>수정</p>
                      </Button>
                      <Button
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
                          onClick={() => {
                            restrictUser(user.id,false);
                          }}
                        >
                        <AiOutlineStepForward size="22" color="white" />
                          <p>재개</p>
                        </Button></>
                      ) : (
                        <>
                        <Button
                          onClick={() => {
                            restrictUser(user.id,true);
                          }}
                        >
                        <AiOutlineStop size="22" color="white" />
                          <p>중지</p>
                        </Button></>
                      )}
                    </ButtonWrapper>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </CustomTable>
      </TableWrapper>
      <Button
        color="#435269"
        onClick={() => {
          openUserAddModal();
        }}
      >
        <AiOutlineUserAdd size="22" color="white" />
        <p>사용자 추가</p>
      </Button>
    </>
  );
}

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
    border-bottom: solid 1px #d6d6d6;
    position: sticky;
    top: 0px;
    background-color: white;
  }
  tr {
    height: 2.5rem;
  }
  tr:nth-child(2n) {
    background-color: #eee;
  }
  input[type="checkbox"] {
    width: 20px; /*Desired width*/
    height: 20px; /*Desired height*/
  }
`;

export default UserManagement;
