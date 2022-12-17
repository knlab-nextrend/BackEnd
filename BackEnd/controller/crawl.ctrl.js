const solrCtrl = require("../service/solr/solrService");
const esCtrl = require("../service/es/esService");
const nasCtrl = require("../service/nas/nasService");
const poliCtrl = require("../service/politica/poliService");
const codeCtrl = require("../service/nextrend/subjectCode");
const libs = require("../lib/libs");
const fileCtrl = require("../service/file");
const workLogCtrl = require("../service/nextrend/workingLog");
const hostCtrl = require("../service/nextrend/host");
const testCtrl = require("../service/test");
const dayjs = require("dayjs");
/*
Document Status Code list
*/

const test = async (req, res) => {
  const result = await nasCtrl.getFileList(req.query.path);

  res.send(result);
};

const docCatViewer = (doc) =>
  new Promise(async (resolve, reject) => {
    let newDoc = Object.assign({}, doc);
    const fieldList = {
      doc_country: 3,
      doc_publish_country: 3,
      doc_category: 1,
      doc_language: 4,
      doc_content_type: 2,
      doc_custom: 6,
      doc_content_category: 2,
      doc_topic: 5,
      CATEGORY: 1,
      COUNTRY: 3,
      LANG: 4,
    };
    for (const [key, catType] of Object.entries(fieldList)) {
      try {
        let converted = [];
        doc[key] = Array.isArray(doc[key]) ? doc[key] : [doc[key]];
        if (doc[key].length !== 0) {
          for (let valueId of doc[key]) {
            const valueInfo = await codeCtrl.getInfoById(valueId, catType);
            if (valueInfo[0]) {
              converted.push(valueInfo[0]);
            }
          }
          if (key in newDoc) {
            newDoc[key] = converted;
          }
        }
      } catch (e) {
        continue;
      }
    }
    if ("doc_host" in newDoc) {
      if (newDoc.doc_host) {
        try {
          const data = await hostCtrl.read(newDoc.doc_host);
          newDoc.doc_host = data;
        } catch (e) {}
      }
    }
    resolve(newDoc);
  });

//router.put('/detail/:_id',crawlSearch.Keep);
//단일 데이터 기준
const crawlKeep = async (req, res) => {
  const _id = req.params._id;
  //안되면 params 시도 혹은 query 시도.
  if (_id === undefined) {
    res.status(400).send();
  } else {
    let statusCode = parseInt(req.body.statusCode);
    let result;
    try {
      switch (statusCode) {
        case 0:
        case 1:
          result = await solrCtrl.Keep(_id);
          break;
        case 2:
        case 3:
          // 일단 직접 지정...
          result = await esCtrl.Keep(_id, 3);
          // addEditLog의 workType 4는 보류.
          await workLogCtrl.addEditLog(req.uid, _id, statusCode, 4);
          break;
        case 4:
        case 5:
          result = await esCtrl.Keep(_id, 5);
          await workLogCtrl.addEditLog(req.uid, _id, statusCode, 4);
          break;
      }
      if (result) {
        res.send(result);
      } else {
        res.status(400).send();
      }
    } catch (e) {
      res.status(400).send(e);
    }
  }
};

//router.get('/detail/:_id',crawlSearch.Detail);
const crawlDetail = async (req, res) => {
  const _id = req.params._id;
  if (_id === undefined) {
    res.status(400).send({ message: "no _id" });
  } else {
    let statusCode = parseInt(req.query.statusCode);
    let result,
      error = "no status code";

    switch (statusCode) {
      case 0:
      case 1:
        result = await solrCtrl.Detail(_id);
        if (typeof result.docs === "object") {
          if (result.docs["stat"] === undefined) {
            result.docs["stat"] = 0;
          }
        } else {
          res.status(400).send({ message: "multiple documents exists" });
        }
        break;
      case 2:
      case 3:
      case 4:
      case 5:
      case 8:
        try {
          value = await esCtrl.Detail(_id);
          const document = value.body.hits.hits[0];
          result = {
            docs: document._source,
            _id: document._id,
          };
          result.docs = await docCatViewer(result.docs);
        } catch (e) {
          error = e;
        }
        // addEditLog의 workType 1은 조회.
        await workLogCtrl.addEditLog(req.uid, _id, statusCode, 1);
        break;
      case 6:
      case 7:
        try {
          value = await esCtrl.Detail(_id);
          const document = value.body.hits.hits[0];
          result = {
            docs: document._source,
            _id: document._id,
          };

          //이미지 폴더 url로부터 파일들을 가져와서 배열로 저장
          result.docs.doc_thumbnail = await nasCtrl.getImage(
            result.docs.doc_thumbnail,
          );
          result.docs = await docCatViewer(result.docs);
        } catch (e) {
          error = e;
        }
        // addEditLog의 workType 1은 조회.
        await workLogCtrl.addEditLog(req.uid, _id, statusCode, 1);
        break;
    }
    if (result) {
      res.send(result);
    } else {
      res.status(400).send({ message: error });
    }
  }
};
//router.get('/list/:statusCode',crawlSearch.Search);
const crawlSearch = async (req, res) => {
  
  const statusCode = parseInt(req.params.statusCode);
  const general = req.query.general === "true";

  delete req.query.general;

  if (statusCode === undefined) {
    res.status(400).send();
  } else {
    let result;
    switch (statusCode) {
      case 0:
      case 1:
        const condition = req.query;
        result = await solrCtrl.Search(
          condition,
          (stat = statusCode),
          (restrict = true),
        );
        break;
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
      case 8:
        const searchQuery = libs.reqToEsFilters(
          req.query,
          statusCode,
          [],
          [],
          [],
          general,
        );

        result = await esCtrl.Search(searchQuery);

        const document = [];
        for (let doc of result.docs) {
          doc = await docCatViewer(doc);
          document.push(doc);
        }
        result.docs = document;
        break;
    }
    if (result) {
      result.docs.forEach((doc) => {
        if (doc["stat"] === undefined) {
          doc["stat"] = 0;
        }
      });
      res.send(result);
    } else {
      res.status(400).send();
    }
  }
};

//router.delete('/detail/:_id',crawlSearch.Delete);
const crawlDelete = async (req, res) => {
  const _id = req.params._id;
  if (_id === undefined) {
    res.status(400).send();
  } else {
    let statusCode = parseInt(req.query.statusCode);
    let result;
    switch (statusCode) {
      case 0:
      case 1:
        result = await solrCtrl.Delete(req);
        break;
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
      case 8:
        //es 부터는 삭제가 아닌, status 9 로 부여한 후 관리.
        result = await esCtrl.Keep(_id, 9);
        // addEditLog의 workType 5는 삭제.
        await workLogCtrl.addEditLog(req.uid, _id, statusCode, 5);
        break;
    }
    if (result) {
      res.send(result);
    } else {
      res.status(400).send();
    }
  }
};

//router.post('/detail/:_id',authJWT,crawlService.Stage);
//Stage 의 경우, 내용 수정이 있기 때문에 Modify로 접근하는 것이 맞음.
const crawlStage = async (req, res) => {
  try {
    const _id = req.params._id;
    if (_id === undefined) {
      res.status(400).send();
    } else {
      let statusCode = parseInt(req.body.statusCode);
      let result;
      if (req.body.docs) {
        let doc = req.body.docs;
        doc["_id"] = _id;
        switch (statusCode) {
          case 0:
          case 1:
            // 순전히 추가하는 경우
            result = await esCtrl.Index(doc, 2);
            if (result) {
              //delete 에서 keep 으로 삭제는 이루어지지 않음. (stat=1로 부여함으로써 삭제 조치..)
              await solrCtrl.Keep(_id, 2);
              res.send();
            } else {
              res.status(400).send({ message: "some trouble in staging" });
            }
            break;
          case 2:
          case 3:
            result = await esCtrl.Index(doc, 4, _id);
            if (result) {
              // addEditLog의 workType 2은 이관.
              await workLogCtrl.addEditLog(
                req.uid,
                _id,
                statusCode,
                2,
                doc.doc_host,
              );
              res.send();
            } else {
              res.status(400).send({ message: "some trouble in staging" });
            }
            break;
          case 4:
          case 5:
            result = await esCtrl.Index(doc, 6, _id);
            if (result) {
              // addEditLog의 workType 2은 이관.
              await workLogCtrl.addEditLog(
                req.uid,
                _id,
                statusCode,
                2,
                doc.doc_host,
              );
              res.send();
            } else {
              res.status(400).send({ message: "some trouble in staging" });
            }
            break;
          case 6:
            if (req.body.requested) {
              value = await esCtrl.Detail(_id);
              const document = value.body.hits.hits[0]._source;
              result = await esCtrl.Index(document, 7, _id);
              if (result) {
                await workLogCtrl.addEditLog(
                  req.uid,
                  _id,
                  statusCode,
                  4,
                  doc.doc_host,
                );
                res.send();
              } else {
                res.status(400).send({ message: "es error" });
              }
              break;
            } else {
              result = await esCtrl.Index(doc, 8, _id);
              if (result) {
                // addEditLog의 workType 2은 이관.
                await workLogCtrl.addEditLog(
                  req.uid,
                  _id,
                  statusCode,
                  2,
                  doc.doc_host,
                );
                await workLogCtrl.addCurationLog(
                  req.uid,
                  _id,
                  null,
                  null,
                  doc.doc_content,
                );
                await poliCtrl.modSubmitStat(doc.item_id);
                res.send();
              } else {
                res.status(400).send({ message: "es error" });
              }
              res.send();
              break;
            }
          case 7:
            // 테스트 모듈 수정 요망..
            //const checked = await poliCtrl.checkStat(_id);
            result = await esCtrl.Index(doc, 8, _id);
            if (result) {
              // addEditLog의 workType 2은 이관.
              await workLogCtrl.addEditLog(
                req.uid,
                _id,
                statusCode,
                2,
                doc.doc_host,
              );
              await workLogCtrl.addCurationLog(
                req.uid,
                _id,
                null,
                null,
                doc.doc_content,
              );
              await poliCtrl.modSubmitStat(doc.item_id);
              res.send();
            } else {
              res.status(400).send({ message: "es error" });
            }
            res.send();
            break;
          case 8:
            const detailDoc = await esCtrl.Detail(_id);
            const docsBef = detailDoc.body.hits.hits[0]._source;
            result = await esCtrl.Index(doc, 8, _id);
            if (result) {
              // addEditLog의 workType 3은 수정. 기존 curation -> curation 의 경우임.
              await workLogCtrl.addEditLog(
                req.uid,
                _id,
                statusCode,
                3,
                doc.doc_host,
              );
              if (docsBef.doc_content !== doc.doc_content) {
                await workLogCtrl.addCurationLog(
                  req.uid,
                  _id,
                  null,
                  docsBef.doc_content,
                  doc.doc_content,
                );
              }
              await fileCtrl.deleteComparedContentImage(_id, doc.doc_content);
              res.send();
            } else {
              res.status(400).send({ message: "some trouble in staging" });
            }
            break;
        }
      } else {
        res.status(400).send({ message: "no document exists" });
      }
    }
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
};

// POST /thumbnail/:_id , es 데이터의 썸네일 추가
const AddThumbnails = async (req, res)=>{


  //document 불러오기
  const _id = req.params._id;
  
  let statusCode = parseInt(req.query.statusCode);

  if (_id === undefined || statusCode === NaN) {
    res.status(400).send();
  }

  
  value = await esCtrl.Detail(_id);
  const document = value.body.hits.hits[0]._source;

  const folderDate = dayjs().locale('se-kr').format('/YYYY/MM');
  let folderPath = folderDate + '/' + document.dc_domain + '/';

  //썸네일 업로드할 폴더 생성 후 파일 업로드
  const existErrorThumb = await nasCtrl.checkThenMakeFolder(folderPath, type = 'image');
  if (existErrorThumb) {
      throw 'error occured during access to nas';
  }

  // 파일을 업로드 함과 동시에 document.doc_thumbnail에 파일 이름 추가
  req.files.forEach(async file=>{
    const uploadErrorThumb = await nasCtrl.uploadFile(file, folderPath, type = 'image');
    if (uploadErrorThumb) {
        // 업로드 실패시 throw
        throw 'error occured put file to nas storage';
    } 

    document.doc_thumbnail.push(folderPath + file.originalname)
  })
  


  // es에 업데이트
  result = await esCtrl.Index(document, statusCode, _id);
  if (result) {
    await workLogCtrl.addEditLog(
      req.uid,
      _id,
      statusCode,
      4,
      document.doc_host,
    );
    res.send(document);
  } else {
    res.status(400).send({ message: "es error" });
  }
  
}

/* 이하 스크리닝 전용 라우터 함수
Detail 에서는 es 에서만 작업되기에 solr인 스크리닝은 분리.
 */
const screenGet = async (req, res) => {
  let condition = req.query;
  condition.host = condition.host ? "*" + condition.host + "*" : "*";
  let stat;
  stat = req.query.keep ? 3 : 0;
  let result = await solrCtrl.Search(
    condition,
    (stat = stat),
    (restrict = true),
  );
  if (result) {
    res.send(result);
  } else {
    res.status(400).send({ message: "got error during search screening data" });
  }
};

const screenStage = async (req, res) => {
  const stageList = req.body.list;
  if (stageList === undefined) {
    res.status(400).send({ message: "no given stage list" });
  } else {
    const errorList = [];
    stageList.forEach(async (itemId) => {
      const doc = await solrCtrl.Detail(itemId);
      let tempDocs = doc.docs;
      try {
        const hostInfo = await hostCtrl.getInfo(tempDocs.doc_url_intro);
        tempDocs.doc_host = hostInfo.idx;
        tempDocs["doc_publisher"] = hostInfo.name;
        tempDocs["doc_publish_country"] = hostInfo.country
          ? hostInfo.country.toString()
          : null;
        tempDocs["doc_language"] = hostInfo.lang
          ? hostInfo.lang.toString()
          : null;
      } catch (e) {
        tempDocs["doc_publisher"] = tempDocs.doc_host;
        tempDocs.doc_host = null;
        tempDocs["doc_publish_country"] = null;
        tempDocs["doc_language"] = null;
      }
      const result = await esCtrl.Index(tempDocs, 2);
      if (result) {
        //정상적으로 추가했을 때 solr 에서는 삭제 수행. (keep으로 stat=1 부여)
        await solrCtrl.Keep(itemId);
      } else {
        errorList.push(itemId);
      }
    });
    if (errorList.length) {
      // Log의 workType 2는 이관.
      await workLogCtrl.addScreeningLog(
        req.uid,
        2,
        2,
        stageList.length - errorList.length,
      );
      res
        .status(400)
        .send({ message: "cannot stage above list", list: errorList });
    } else {
      // Log의 workType 2는 이관.
      await workLogCtrl.addScreeningLog(req.uid, 2, 2, stageList.length);
      res.send();
    }
  }
};

const screenKeep = async (req, res) => {
  const keepList = req.body.list;
  if (keepList === undefined) {
    res.status(400).send({ message: "no given keep list" });
  } else {
    const errorList = [];
    keepList.forEach(async (itemId) => {
      //stat 3은 keep list.
      const result = await solrCtrl.Keep(itemId, 3);
      if (result) {
        //정상적인 값일 때, 아무것도 수행하지 않음.
      } else {
        errorList.push(itemId);
      }
    });
    if (errorList.length) {
      // Log의 workType 4는 보류.
      await workLogCtrl.addScreeningLog(
        req.uid,
        2,
        4,
        keepList.length - errorList.length,
      );
      res
        .status(400)
        .send({ message: "cannot keep above list", list: errorList });
    } else {
      // Log의 workType 4는 보류.
      await workLogCtrl.addScreeningLog(req.uid, 2, 4, keepList.length);
      res.send();
    }
  }
};

const screenDelete = async (req, res) => {
  const deleteList = req.query.list;
  if (deleteList === undefined) {
    res.status(400).send({ message: "no given delete list" });
  } else {
    const errorList = [];
    deleteList.forEach(async (itemId) => {
      //stat 2 부여함으로써 일단 추후 처리 도모... 기능상 이유는 없음.
      const result = await solrCtrl.Keep(itemId, 2);
      if (result) {
        //정상적인 값일 때, 아무것도 수행하지 않음.
      } else {
        errorList.push(itemId);
      }
    });
    if (errorList.length) {
      // Log의 workType 5는 삭제.
      await workLogCtrl.addScreeningLog(
        req.uid,
        2,
        5,
        deleteList.length - errorList.length,
      );
      res
        .status(400)
        .send({ message: "cannot delete above list", list: errorList });
    } else {
      // Log의 workType 5는 삭제.
      await workLogCtrl.addScreeningLog(req.uid, 2, 5, deleteList.length);
      res.send();
    }
  }
};

const crawlPatch = async (req, res) => {
  try {
    const _id = req.params._id;
    if (_id === undefined) {
      res.status(400).send();
    } else {
      let statusCode = parseInt(req.body.statusCode);
      let result;
      if (req.body.docs) {
        let doc = req.body.docs;
        doc["_id"] = _id;
        switch (statusCode) {
          case 2:
          case 3:
            result = await esCtrl.Index(doc, statusCode, _id);
            if (result) {
              // addEditLog의 workType 3은 수정
              await workLogCtrl.addEditLog(
                req.uid,
                _id,
                statusCode,
                3,
                doc.doc_host,
              );
              res.send();
            } else {
              res.status(400).send({ message: "some trouble in update" });
            }
            break;
          case 4:
          case 5:
            result = await esCtrl.Index(doc, 6, _id);
            if (result) {
              // addEditLog의 workType 3은 수정
              await workLogCtrl.addEditLog(
                req.uid,
                _id,
                statusCode,
                2,
                doc.doc_host,
              );
              res.send();
            } else {
              res.status(400).send({ message: "some trouble in update" });
            }
            break;
          case 6:
            result = await esCtrl.Index(doc, statusCode, _id);
            if (result) {
              // addEditLog의 workType 3은 수정
              await workLogCtrl.addEditLog(
                req.uid,
                _id,
                statusCode,
                3,
                doc.doc_host,
              );
              await poliCtrl.modSubmitStat(doc.item_id);
              res.send();
            } else {
              res.status(400).send({ message: "es error" });
            }
            res.send();
            break;

          case 7:
            // 테스트 모듈 수정 요망..
            //const checked = await poliCtrl.checkStat(_id);
            result = await esCtrl.Index(doc, statusCode, _id);
            if (result) {
              // addEditLog의 workType 2은 이관.
              await workLogCtrl.addEditLog(
                req.uid,
                _id,
                statusCode,
                2,
                doc.doc_host,
              );
              await workLogCtrl.addCurationLog(
                req.uid,
                _id,
                null,
                null,
                doc.doc_content,
              );
              res.send();
            } else {
              res.status(400).send({ message: "es error" });
            }
            res.send();
            break;
          case 8:
            const detailDoc = await esCtrl.Detail(_id);
            const docsBef = detailDoc.body.hits.hits[0]._source;
            result = await esCtrl.Index(doc, 8, _id);
            if (result) {
              // addEditLog의 workType 3은 수정.
              await workLogCtrl.addEditLog(
                req.uid,
                _id,
                statusCode,
                3,
                doc.doc_host,
              );
              if (docsBef.doc_content !== doc.doc_content) {
                await workLogCtrl.addCurationLog(
                  req.uid,
                  _id,
                  null,
                  docsBef.doc_content,
                  doc.doc_content,
                );
              }
              await fileCtrl.deleteComparedContentImage(_id, doc.doc_content);
              res.send();
            } else {
              res.status(400).send({ message: "some trouble in staging" });
            }
            break;
        }
      } else {
        res.status(400).send({ message: "no document exists" });
      }
    }
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
};




module.exports = {
  Search: crawlSearch,
  Detail: crawlDetail,
  Keep: crawlKeep,
  Delete: crawlDelete,
  Patch: crawlPatch,
  Stage: crawlStage,
  AddThumbnails : AddThumbnails,
  screenGet: screenGet,
  screenStage: screenStage,
  screenDelete: screenDelete,
  screenKeep: screenKeep,
  test: test,
  docCatViewer: docCatViewer,
  
};
