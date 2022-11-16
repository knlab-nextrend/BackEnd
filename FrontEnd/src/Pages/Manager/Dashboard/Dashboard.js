import React from "react";

import TitleCard from "../../../Components/DashboardComponents/TitleCard";
import DocumentStatCard from "../../../Components/DashboardComponents/DocumentStatCard";

import UserSelectCard from "../../../Components/DashboardComponents/UserSelectCard";
import WorkStatCard from "../../../Components/DashboardComponents/WorkStatCard";
import ChartCard from "../../../Components/DashboardComponents/ChartCard";
import ProcessMenu from "../../../Components/DashboardComponents/ProcessMenu";
import DateRange from "../../../Components/DashboardComponents/DateRange";
import Map from "./Map";
import LineGraph from "./LineGraph";
import styled from "styled-components";
import Duration from "../../../Components/DashboardComponents/Duration";
import { ResponsivePie } from "@nivo/pie"; // 원형차트 임시...
import { FaSort } from "react-icons/fa";
import { myColors } from "styles/colors";

function Dashboard({
  countryPieChartData,
  menuType,
  menuHandler,
  process,
  processHandler,
  rowClickHandler,
  crawlHostList,
  selectedHostId,
  currentCrawlHostLog,
  crawlSum,
  setCurrentUserId,
  currentUserIdHandler,
  setDateGte,
  lineGraphData,
  setDuration,
  duration,
  curationWorkModalOpen,
  curationWorkList,
  userWorkAllData,
  workAllLogData,
  workAllStatus,
  workAllStatusHandler,
  processTitle,
  countryDocumentData,
  getCountryMapChartData,
  crawlCountSort,
}) {
  return (
    <Wrap>
      <Tab>
        <div className="button-group">
          <TabButton
            active={menuType === "docs_country"}
            value="docs_country"
            onClick={menuHandler}
          >
            문서 전체 통계 & 국가별 통계
          </TabButton>
          <TabButton
            active={menuType === "docs_worker"}
            value="docs_worker"
            onClick={menuHandler}
          >
            작업자별 작업 통계 및 현황
          </TabButton>
          <TabButton
            active={menuType === "crawl"}
            value="crawl"
            onClick={menuHandler}
          >
            크롤러 작동 현황
          </TabButton>
          {/*
                    <TabButton
            active={menuType === "system_access"}
            value="system_access"
            onClick={menuHandler}
          >
            시스템 접속 통계
          </TabButton>
          */}
        </div>
      </Tab>
      <Wrapper>
        {menuType === "docs_country" && (
          <>
            <>
              <WorkStatCard
                workAllLogData={workAllLogData}
                workAllStatus={workAllStatus}
                workAllStatusHandler={workAllStatusHandler}
              />

              <CountryContentWrapper>
                <TitleCard
                  title={"국가별 문서 현황"}
                  subtitle={
                    "국가를 클릭하면 해당 국가에 대한 문서 작업 현황을 확인할 수 있습니다."
                  }
                >
                  <Map getCountryMapChartData={getCountryMapChartData} />
                </TitleCard>
                <div>
                  <ChartCard>
                    <ResponsivePie
                      data={countryPieChartData}
                      margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                      innerRadius={0.5}
                      padAngle={0.7}
                      cornerRadius={3}
                      activeOuterRadiusOffset={8}
                      borderWidth={1}
                      borderColor={{
                        from: "color",
                        modifiers: [["darker", 0.2]],
                      }}
                      arcLinkLabelsSkipAngle={10}
                      arcLinkLabelsTextColor="#333333"
                      arcLinkLabelsThickness={2}
                      colors={{ scheme: "set3" }}
                      arcLinkLabelsColor={{ from: "color" }}
                      arcLabelsSkipAngle={10}
                      arcLabelsTextColor={{
                        from: "color",
                        modifiers: [["darker", 2]],
                      }}
                      defs={[
                        {
                          id: "dots",
                          type: "patternDots",
                          background: "inherit",
                          color: "rgba(255, 255, 255, 0.3)",
                          size: 4,
                          padding: 1,
                          stagger: true,
                        },
                        {
                          id: "lines",
                          type: "patternLines",
                          background: "inherit",
                          color: "rgba(255, 255, 255, 0.3)",
                          rotation: -45,
                          lineWidth: 6,
                          spacing: 10,
                        },
                      ]}
                      legends={[
                        {
                          anchor: "right",
                          direction: "column",
                          justify: false,
                          translateX: 180,
                          translateY: 0,
                          itemsSpacing: 3,
                          itemWidth: 180,
                          itemHeight: 18,
                          itemTextColor: "#999",
                          itemDirection: "left-to-right",
                          itemOpacity: 1,
                          symbolSize: 11,
                          symbolShape: "circle",
                          effects: [
                            {
                              on: "hover",
                              style: {
                                itemTextColor: "#000",
                              },
                            },
                          ],
                        },
                      ]}
                    />
                  </ChartCard>
                  <DocumentStatCard
                    countryDocumentData={countryDocumentData}
                  ></DocumentStatCard>
                </div>
              </CountryContentWrapper>
              <TitleCard
                title={"기간별 통계"}
                subtitle={
                  "전체 사용자의 단계별, 기간별 작업량 통계를 확인하세요."
                }
              >
                <DateRange setDateGte={setDateGte} />
                <Duration setDuration={setDuration} />
                <LineGraphWrapper>
                  {userWorkAllData.map((item, index) => {
                    return (
                      <div className="graph-title-container">
                        <div className="graph-title">{processTitle[index]}</div>
                        <LineGraph
                          divName={"chartdiv" + index}
                          lineGraphData={item}
                          duration={duration}
                          key={index}
                        />
                      </div>
                    );
                  })}
                </LineGraphWrapper>
              </TitleCard>
            </>
          </>
        )}
        {menuType === "docs_worker" && (
          <>
            <UserSelectCard
              currentUserIdHandler={currentUserIdHandler}
              setCurrentUserId={setCurrentUserId}
            />

            <ProcessMenu processHandler={processHandler} process={process} />
            <TitleCard
              title={"기간별 통계"}
              subtitle={
                "해당 사용자의 단계별, 기간별 작업량 통계를 확인하세요."
              }
            >
              <DateRange setDateGte={setDateGte} />
              <Duration setDuration={setDuration} />
              <LineGraphOnlyOneWrapper>
                <LineGraph
                  divName={"chartdiv"}
                  lineGraphData={lineGraphData}
                  duration={duration}
                />
              </LineGraphOnlyOneWrapper>
            </TitleCard>
            <TitleCard
              title={"큐레이션 작업 내역"}
              subtitle={
                "해당 작업자의 큐레이션 작업 내역을 문서별로 확인하세요. 작업 전/후 를 비교할 수 있습니다."
              }
            >
              <CrawlStatusTable>
                <colgroup>
                  <col width="50%" />
                  <col width="20%" />
                  <col width="10%" />
                  <col width="10%" />
                  <col width="10%" />
                </colgroup>
                <thead>
                  <tr>
                    <th>작업 문서 ID</th>
                    <th>작업 일시</th>
                    <th>컨텐츠 품질</th>
                    <th>작업 전</th>
                    <th>작업 후</th>
                  </tr>
                </thead>
                <tbody>
                  {curationWorkList.map((item, index) => {
                    return (
                      <tr>
                        <td>{item.ES_ID}</td>
                        <td>{item.DT}</td>
                        <td>{item.QUALITY}</td>
                        <td>
                          <button
                            onClick={() => {
                              curationWorkModalOpen(item.CONTENT_BEF || "");
                            }}
                          >
                            조회
                          </button>
                        </td>
                        <td>
                          <button
                            onClick={() => {
                              curationWorkModalOpen(item.CONTENT_CUR);
                            }}
                          >
                            조회
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </CrawlStatusTable>
            </TitleCard>
            <TitleCard
              title={"단계별 상세 로그"}
              subtitle={
                "단계별 작업 상세 로그를 확인하세요. 작업문서 ID, 작업 일시 등이 표시됩니다."
              }
            >
              {/*
                            <CrawlStatusTable>
                <thead>
                  <tr>
                    <th>작업 문서 ID</th>
                    <th>작업 일시</th>
                    <th>작업 단계</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>_abcdefghijklmnop</td>
                    <td>2022-04-07 13:36:00</td>
                    <td>스크리닝 완료</td>
                  </tr>
                </tbody>
              </CrawlStatusTable>
              */}
            </TitleCard>
          </>
        )}
        {menuType === "crawl" && (
          <>
            <TitleCard
              title={"파일 형태 별 수집 현황"}
              subtitle={
                "URL, HTML, PDF, WORD, EXCEL, PPT 등 다양한 문서 형태의 전체 수집 현황입니다."
              }
            >
              <CrawlFileTypeWrapper>
                <CrawlFileTypeStatCard color="#435269">
                  <div className="file-type">URL</div>
                  <div className="file-status">{crawlSum.url}</div>
                </CrawlFileTypeStatCard>
                <CrawlFileTypeStatCard color="#fccb00">
                  <div className="file-type">HTML</div>
                  <div className="file-status">{crawlSum.html}</div>
                </CrawlFileTypeStatCard>
                <CrawlFileTypeStatCard color="#b80000">
                  <div className="file-type">PDF</div>
                  <div className="file-status">{crawlSum.pdf}</div>
                </CrawlFileTypeStatCard>
                <CrawlFileTypeStatCard color="#3f51b5">
                  <div className="file-type">WORD</div>
                  <div className="file-status">{crawlSum.word}</div>
                </CrawlFileTypeStatCard>
                <CrawlFileTypeStatCard color="#4caf50">
                  <div className="file-type">EXCEL</div>
                  <div className="file-status">{crawlSum.excel}</div>
                </CrawlFileTypeStatCard>
                <CrawlFileTypeStatCard color="#db3e00">
                  <div className="file-type">PPT</div>
                  <div className="file-status">{crawlSum.ppt}</div>
                </CrawlFileTypeStatCard>
                <CrawlFileTypeStatCard color="#d6d6d6">
                  <div className="file-type">ETC</div>
                  <div className="file-status">{crawlSum.etc}</div>
                </CrawlFileTypeStatCard>
              </CrawlFileTypeWrapper>
            </TitleCard>
            <TitleCard
              title={"작업 목록"}
              subtitle={
                "크롤러 작업 대상 HOST 목록과 그 대상의 작업 현황을 볼 수 있습니다. HOST별 크롤링 작업 현황은 해당 컬럼을 클릭하면 확인할 수 있습니다. host 검색은 ctrl+F 로 가능합니다."
              }
            >
              <CrawlStatusTable>
                <colgroup>
                  <col width="10%" />
                  <col width="30%" />
                  <col width="5%" />
                  <col width="5%" />
                  <col width="5%" />
                  <col width="5%" />
                  <col width="5%" />
                  <col width="5%" />
                  <col width="5%" />
                  <col width="15%" />
                  <col width="10%" />
                </colgroup>
                <thead>
                  <tr>
                    <th rowSpan={2}>HOST ID</th>
                    <th rowSpan={2}>HOST 도메인</th>
                    <th colSpan={7}>작업 총량</th>
                    <th rowSpan={2}>작업 생성일</th>
                    <th rowSpan={2}>크롤링 상태</th>
                  </tr>
                  <tr>
                    <th>
                      URL
                      <FaSort
                        className="sort-btn"
                        onClick={() => {
                          crawlCountSort("url");
                        }}
                      />
                    </th>
                    <th>
                      HTML
                      <FaSort
                        className="sort-btn"
                        onClick={() => {
                          crawlCountSort("html");
                        }}
                      />
                    </th>
                    <th>
                      PDF
                      <FaSort
                        className="sort-btn"
                        onClick={() => {
                          crawlCountSort("pdf");
                        }}
                      />
                    </th>
                    <th>
                      WORD
                      <FaSort
                        className="sort-btn"
                        onClick={() => {
                          crawlCountSort("word");
                        }}
                      />
                    </th>
                    <th>
                      EXCEL
                      <FaSort
                        className="sort-btn"
                        onClick={() => {
                          crawlCountSort("excel");
                        }}
                      />
                    </th>
                    <th>
                      PPT
                      <FaSort
                        className="sort-btn"
                        onClick={() => {
                          crawlCountSort("ppt");
                        }}
                      />
                    </th>
                    <th>
                      ETC
                      <FaSort
                        className="sort-btn"
                        onClick={() => {
                          crawlCountSort("etc");
                        }}
                      />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {crawlHostList.map((item, index) => {
                    return (
                      <>
                        <tr
                          key={index}
                          onClick={() => {
                            rowClickHandler(item.job_id);
                          }}
                        >
                          <td>{item.job_id}</td>
                          <td>{item.host}</td>
                          <td>{item.url}</td>
                          <td>{item.html}</td>
                          <td>{item.pdf}</td>
                          <td>{item.word}</td>
                          <td>{item.excel}</td>
                          <td>{item.ppt}</td>
                          <td>{item.etc}</td>
                          <td>{item.created_at}</td>
                          <td style={{ fontWeight: "bold" }}>
                            {item.status.toUpperCase()}
                          </td>
                        </tr>
                        {selectedHostId === item.job_id && (
                          <tr key={index + 999}>
                            <td colSpan="11">
                              <div className="work-log-wrapper">
                                {currentCrawlHostLog.length === 0 ? (
                                  <div>작업 로그가 없습니다.</div>
                                ) : (
                                  currentCrawlHostLog.map((log, index) => {
                                    return (
                                      <div key={index} className="work-log">
                                        <div>[시작일] {log.start_time}</div>
                                        <div>[종료일] {log.end_time}</div>
                                        <div>[url] {log.url}</div>
                                        <div>[html] {log.html}</div>
                                        <div>[pdf] {log.pdf}</div>
                                        <div>[word] {log.word}</div>
                                        <div>[excel] {log.excel}</div>
                                        <div>[ppt] {log.ppt}</div>
                                      </div>
                                    );
                                  })
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })}
                </tbody>
              </CrawlStatusTable>
            </TitleCard>
          </>
        )}
      </Wrapper>
    </Wrap>
  );
}

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 1280px;
`;

const Wrapper = styled.div`
  background-color: #eee;
  padding: 1rem;
  min-height: 1280px;
`;

const CountryContentWrapper = styled.div`
  display: grid;
  grid-template-columns: 7fr 3fr;
`;

const Tab = styled.div`
  height: 4rem;
  border-bottom: solid 1px rgba(0, 0, 0, 0.1);
  align-items: bottom;
  display: flex;
  align-items: end;
  padding: 0 1.5rem 0 1.5rem;
  .button-group {
  }
`;
const TabButton = styled.button`
  color: ${(props) => props.active && myColors.blue400};
  border: none;
  border-bottom: ${(props) => props.active && `solid 3px ${myColors.blue400};`};
  font-weight: bold;
  background-color: white;
  cursor: pointer;
  padding: 1rem;
`;

const CrawlFileTypeWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
const CrawlFileTypeStatCard = styled.div`
  border: solid 1px #d6d6d6;
  border-radius: 4px;
  box-shadow: rgb(9 30 66 / 25%) 0px 1px 1px;
  padding: 1rem;

  border-left: ${(props) => `solid 5px ${props.color}` || "solid 5px #eee"};
  margin: 1rem;
  min-width: 7rem;

  .file-type {
    color: #435269;
    font-size: 12px;
  }
  .file-status {
    color: #5a5c69;
    font-size: 20px;
    font-weight: bold;
  }
`;

const CrawlStatusTable = styled.table`
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  text-align: left;
  font-size: 14px;
  color: rgb(59, 59, 59);
  th {
    color: #323d4d;
    background-color: #d8dee6;
  }
  th,
  td {
    border-bottom: 1px solid #d6d6d6;
    padding: 10px;
    word-wrap: break-word;
  }

  tr:first-child,
  tr:last-child {
    border: none;
  }
  input[type="text"] {
    width: 100%;
  }
  .work-log-wrapper {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
  }
  .work-log {
    margin: 10px;
    border: solid 1px #d6d6d6;
    border-radius: 4px;
    box-shadow: rgb(9 30 66 / 25%) 0px 1px 1px;
    padding: 1rem;
    min-width: 190px;
  }
  .sort-btn {
    cursor: pointer;
  }
`;

const LineGraphOnlyOneWrapper = styled.div`
  padding: 3rem;
`;

const LineGraphWrapper = styled.div`
  padding: 3rem;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;

  .graph-title-container {
    display: flex;
    flex-direction: column;
    .graph-title {
      display: flex;
      padding-left: 3rem;
      font-size: 14px;
      font-weight: bold;
      color: #435269;
    }
  }
`;

export default Dashboard;
