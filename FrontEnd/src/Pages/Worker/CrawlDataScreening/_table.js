import { BsArrowDown, BsArrowUp } from "react-icons/bs";
import styled from "styled-components";
import { myColors, tailwindColors } from "styles/colors";
import { SORT_ORDER } from "./CrawlDataScreeningContainer";

export const ScreeningTable = ({
  screeningData,
  stageDataList,
  keepDataList,
  deleteDataList,
  onChangeCheckedAll,
  checkedAll,
  onChangeEach,
  sort,
  sortState,
}) => {
  return (
    <Table sortState={sortState}>
      <thead>
        <tr>
          <th>
            <div>
              <span>완료</span>
              <input
                type="checkbox"
                value="stage"
                onChange={onChangeCheckedAll}
                checked={checkedAll === "stage"}
              />
            </div>
          </th>
          <th>
            <div>
              <span>보류</span>
              <input
                type="checkbox"
                value="keep"
                onChange={onChangeCheckedAll}
                checked={checkedAll === "keep"}
              />
            </div>
          </th>
          <th>
            <div>
              <span>삭제</span>
              <input
                type="checkbox"
                value="delete"
                onChange={onChangeCheckedAll}
                checked={checkedAll === "delete"}
              />
            </div>
          </th>
          <th>원문요약</th>
          <th>HOST명</th>
          <th onClick={() => sort("date")}>
            <span>원문수집일</span>
            {sortState.type === "date" &&
              SORT_ORDER[sortState.order] === "asc" && <BsArrowUp />}
            {sortState.type === "date" &&
              SORT_ORDER[sortState.order] === "desc" && <BsArrowDown />}
          </th>
          <th>
            <span onClick={() => sort("language")}>언어</span>
            {sortState.type === "language" &&
              SORT_ORDER[sortState.order] === "asc" && <BsArrowUp />}
            {sortState.type === "language" &&
              SORT_ORDER[sortState.order] === "desc" && <BsArrowDown />}
          </th>
          <th onClick={() => sort("page")}>
            <span>페이지</span>
            {sortState.type === "page" &&
              SORT_ORDER[sortState.order] === "asc" && <BsArrowUp />}
            {sortState.type === "page" &&
              SORT_ORDER[sortState.order] === "desc" && <BsArrowDown />}
          </th>
        </tr>
      </thead>
      <tbody>
        {screeningData.map((row, index) => (
          <tr key={index}>
            <td>
              <input
                type="radio"
                name={row.item_id}
                value={row.item_id}
                checked={stageDataList.includes(row.item_id)}
                onChange={(e) => {
                  onChangeEach(e, "stage");
                }}
              />
            </td>
            <td>
              <input
                type="radio"
                name={row.item_id}
                value={row.item_id}
                checked={keepDataList.includes(row.item_id)}
                onChange={(e) => {
                  onChangeEach(e, "keep");
                }}
              />
            </td>
            <td>
              <input
                type="radio"
                name={row.item_id}
                value={row.item_id}
                checked={deleteDataList.includes(row.item_id)}
                onChange={(e) => {
                  onChangeEach(e, "delete");
                }}
              />
            </td>
            <td>
              <a href={row.doc_url} target="_blank" rel="noreferrer">
                {row.doc_origin_summary ?? "요약 없음"}
              </a>
            </td>
            <td>{row.doc_host}</td>
            <td>{row.doc_collect_date}</td>
            <td>{row.doc_language}</td>
            <td>{row.doc_page}p</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

const Table = styled.table`
  width: 100%;
  table-layout: fixed;
  padding: 0 1rem;
  font-size: 14px;
  border: 1px solid ${tailwindColors["grey-400"]};

  tr {
    display: flex;
    th,
    td {
      :nth-of-type(1),
      :nth-of-type(2),
      :nth-of-type(3) {
        width: 2.5rem;
      }
      :nth-of-type(4) {
        flex: 1;
      }
      :nth-of-type(5) {
        width: 15%;
        white-space: nowrap;
      }
      :nth-of-type(6) {
        width: 7rem;
        white-space: nowrap;
      }
      :nth-of-type(7) {
        min-width: 4rem;
        white-space: nowrap;
      }
      :nth-of-type(8) {
        min-width: 4rem;
        white-space: nowrap;
      }
    }
  }

  & thead {
    width: 100%;
    position: sticky;
    top: 0;
    background-color: ${tailwindColors["grey-100"]};

    th {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.5rem 0;
      border-bottom: 1px solid ${tailwindColors["grey-400"]};
      font-weight: bold;

      //원문수집일
      :nth-of-type(6) {
        color: ${(props) =>
          props.sortState.type === "date" && myColors.blue400};
        cursor: pointer;
      }
      //언어
      :nth-of-type(7) {
        color: ${(props) =>
          props.sortState.type === "language" && myColors.blue400};
        cursor: pointer;
      }
      //페지
      :nth-of-type(8) {
        color: ${(props) =>
          props.sortState.type === "page" && myColors.blue400};
        cursor: pointer;
      }

      div {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
    }
  }

  & tbody {
    display: block;
    width: 100%;
    overflow-y: auto;
    tr {
      overflow: hidden;
      border-bottom: 1px solid ${tailwindColors["grey-400"]};
      :nth-of-type(2n) {
        background-color: ${tailwindColors["grey-50"]};
      }
    }
    td {
      padding: 1rem 0.5rem;
      //라디오 버튼
      :nth-of-type(1),
      :nth-of-type(2),
      :nth-of-type(3) {
        text-align: center;
      }
      //원문요약
      :nth-of-type(4) {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        a:hover {
          text-decoration: underline;
        }
      }
      //host명
      :nth-of-type(5) {
        overflow: hidden;
        text-overflow: ellipsis;
      }
      //원문수집일
      :nth-of-type(6) {
        text-align: center;
      }
      //언어
      :nth-of-type(7) {
        text-align: center;
      }
      //페이지수
      :nth-of-type(8) {
        text-align: right;
      }
    }
  }
`;
