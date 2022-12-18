import styled from "styled-components";
import { myColors, tailwindColors } from "styles/colors";
import { toYYMMDD_DOT } from "Utils/time";

export const CurationTable = ({ curationData, handleRowClick }) => {
  return (
    <>
      <CurationListTable>
        <colgroup>
          <col style={{ width: "40%" }} />
          <col style={{ width: "12%" }} />
          <col style={{ width: "12%" }} />
          <col style={{ width: "8%" }} />
          <col style={{ width: "12%" }} />
          <col style={{ width: "8%" }} />
          <col style={{ width: "10%" }} />
        </colgroup>
        <thead>
          <tr>
            <th>제목</th>
            <th>대상 국가</th>
            <th>정책 분류</th>
            <th>문서 분류</th>
            <th>발급 기관 명</th>
            <th>페이지 수</th>
            <th>원문 발행일</th>
          </tr>
        </thead>
        <tbody>
          {curationData.map((item, index) => {
            return (
              <tr
                onClick={() => {
                  handleRowClick(item._id);
                }}
                key={index}
              >
                <td>
                  <div className="content">
                    <div className="img-container">
                      <img
                        src={
                          item.doc_thumbnail !== null
                            ? `http://1.214.203.131:3330${item.doc_thumbnail}`
                            : process.env.PUBLIC_URL +
                              "/img/curation_default_image.png"
                        }
                        alt="tubmnail"
                      />
                    </div>
                    <div className="title-container">
                      <div className="dc_title_kr">{item.doc_kor_title}</div>
                      <div className="dc_title_or">{item.doc_origin_title}</div>
                    </div>
                  </div>
                </td>
                <td className="center">{item.doc_country_list}</td>
                <td className="center">{item.doc_category_list}</td>
                <td className="center">{item.doc_content_type_list}</td>
                <td className="center">{item.doc_publisher}</td>

                <td className="center">{item.doc_page}쪽</td>
                <td className="center">
                  {toYYMMDD_DOT(item.doc_Publish_date)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </CurationListTable>
    </>
  );
};

const CurationListTable = styled.table`
  width: 100%;
  table-layout: fixed;
  font-size: 14px;

  thead {
    border-bottom: 1px solid ${tailwindColors["grey-400"]};
    background-color: ${tailwindColors["grey-100"]};
    font-weight: bold;
    text-align: center;
    white-space: nowrap;
  }

  th {
    padding: 0.5rem;
  }

  td {
    padding: 0.2rem;
    word-break: break-all;
  }

  & tbody {
    width: 100%;

    tr {
      width: 100%;
      height: 2.5rem;
      border-bottom: 1px solid ${tailwindColors["grey-400"]};
      background-color: ${tailwindColors.white};
      cursor: pointer;

      :hover {
        background-color: ${tailwindColors["grey-100"]};
      }
      /* :nth-of-type(2n) {
        background-color: ${tailwindColors["grey-50"]};
      } */

      td {
        :nth-of-type(1) {
          width: 40%;
        }
        :nth-of-type(2) {
          width: 12%;
        }
        :nth-of-type(3) {
          width: 12%;
        }
        :nth-of-type(4) {
          width: 8%;
        }
        :nth-of-type(5) {
          width: 12%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        :nth-of-type(6) {
          width: 10%;
        }
      }
    }
  }

  .center {
    text-align: center;
  }
  .content {
    display: flex;
    width: 100%;
    .img-container {
      width: 5rem;
      height: 5rem;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
    .title-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      width: calc(100% - 5rem);

      .dc_title_kr {
        width: 100%;
        padding: 0 0.5rem;

        font-weight: bold;
        font-size: 16px;
        color: ${tailwindColors.black};

        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .dc_title_or {
        padding: 0 0.5rem;

        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
`;
