import React, { useState, useEffect } from "react";
import CategoryManagement from "./CategoryManagement";
import {
  categoryListFetchApi,
  categoryItemAddApi,
  categoryItemDeleteApi,
  categoryItemEditApi,
  sessionHandler,
} from "../../../Utils/api";
import { useDispatch } from "react-redux";
import { trackPromise } from "react-promise-tracker";
import { LoadingWrapper } from "../../../Components/LoadingWrapper";
function CategoryManagementContainer() {
  const dispatch = useDispatch();

  const [editableCode, setEditableCode] = useState(0);
  /* 수정할 항목의 코드를 저장한다.
  0일 경우 수정 할 항목이 지정되지 않은 상태이다.
  그러므로, 수정 확인 또는 수정 취소 시 해당 값을 0으로 다시 지정해 주어야 한다.
  */

  const CATEGOROY_CODE_LIST = {
    정책분류: 1,
    유형분류: 2,
    국가분류: 3,
    언어: 4,
    토픽분류: 5,
    기관맞춤형분류: 6,
  };

  const [addCategoryName, setAddCategoryName] = useState(""); // 새롭게 등록할 카테고리 이름
  const [editCategoryName, setEditCategoryName] = useState(""); // 수정할 카테고리 이름

  const [type, setType] = useState(1); // 정책분류 , 유형구분 , 국가 분류, 언어
  const [categoryList, setCategoryList] = useState([
    { length: 2, list: [] },
    { length: 4, list: [] },
    { length: 6, list: [] },
  ]);
  const [upperCode, setUpperCode] = useState({ 2: null, 4: null, 6: null });
  const [length, setLength] = useState(2); // 대분류 (2) 중분류 (4) 소분류 (6)

  const typeHandler = (type) => {
    setCategoryList([
      { length: 2, list: [] },
      { length: 4, list: [] },
      { length: 6, list: [] },
    ]);
    setUpperCode({ 2: null, 4: null, 6: null });
    setLength(2);
    setType(type);
  };
  const onChangeEditInput = (e) => {
    setEditCategoryName(e.target.value);
  };
  const onChangeAddInput = (e) => {
    setAddCategoryName(e.target.value);
  };

  const upperCodeHandler = (code, length) => {
    let _upperCode = { ...upperCode };
    _upperCode[length] = code;
    setUpperCode(_upperCode);
  };
  const lengthHandler = (length) => {
    setLength(length);
  };

  const categoryEdit = (item) => {
    setEditableCode(item.CODE);
    setEditCategoryName(item.CT_NM);
  };
  const categoryEditConfirm = (code) => {
    categoryItemEditApi(type, code, editCategoryName).then((res) => {
      if (res.status === 200) {
        alert("성공적으로 수정되었습니다.");
        dataFetch();
        categoryEditCancel();
      }
    });
  };
  const categoryEditCancel = () => {
    setEditableCode(0);
    setEditCategoryName("");
  };
  const categoryAdd = (length) => {
    if (addCategoryName === "") {
      alert("카테고리 이름을 입력해주세요");
      return;
    }
    if (length === 4 && upperCode[2] === null) {
      alert("대분류를 먼저 선택해주세요.");
      return;
    } else if (length === 6 && upperCode[4] === null) {
      alert("중분류를 먼저 선택해주세요.");
      return;
    } else {
      const code = length === 2 ? null : upperCode[length - 2];
      categoryItemAddApi(type, length, addCategoryName, code).then((res) => {
        if (res.status === 200) {
          alert("성공적으로 등록되었습니다.");
          dataFetch();
          // setAddCategoryName(""); input 초기화 왜 안되는거지
        }
      });
    }
  };
  const categoryDelete = (code) => {
    if (
      confirm(
        "해당 카테고리를 삭제하시겠습니까? 연관된 문서에서 카테고리 설정이 삭제됩니다."
      )
    ) {
      categoryItemDeleteApi(type, code).then((res) => {
        if (res.status === 200) {
          alert("성공적으로 삭제되었습니다.");
          dataFetch();
        }
      });
    }
  };
  /* 데이터 불러오기 */
  const dataFetch = () => {
    trackPromise(
      categoryListFetchApi(type, length, upperCode[length - 2])
        .then((res) => {
          dataCleansing(res.data);
        })
        .catch((err) => {
          sessionHandler(err, dispatch).then((res) => {
            categoryListFetchApi(type, length, upperCode[length - 2]).then(
              (res) => {
                dataCleansing(res.data);
              }
            );
          });
        })
    );
  };
  const dataCleansing = (rawData) => {
    const index = categoryList.findIndex((i) => i.length == length);
    let _categoryList = [...categoryList];
    _categoryList[index] = { length, list: rawData };
    setCategoryList(_categoryList);
  };

  useEffect(() => {
    dataFetch();
    console.log(upperCode[2]);
  }, [type, length, upperCode]);

  return (
    <LoadingWrapper>
      <CategoryManagement
        CATEGOROY_CODE_LIST={CATEGOROY_CODE_LIST}
        categoryList={categoryList}
        type={type}
        typeHandler={typeHandler}
        editableCode={editableCode}
        editCategoryName={editCategoryName}
        categoryEdit={categoryEdit}
        categoryEditConfirm={categoryEditConfirm}
        categoryEditCancel={categoryEditCancel}
        onChangeEditInput={onChangeEditInput}
        upperCodeHandler={upperCodeHandler}
        lengthHandler={lengthHandler}
        onChangeAddInput={onChangeAddInput}
        categoryAdd={categoryAdd}
        categoryDelete={categoryDelete}
        upperCode={upperCode}
      />
    </LoadingWrapper>
  );
}

export default CategoryManagementContainer;
