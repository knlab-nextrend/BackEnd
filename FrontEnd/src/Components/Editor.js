import React from "react";

import CKEditorInspector from '@ckeditor/ckeditor5-inspector';
import { CKEditor } from "@ckeditor/ckeditor5-react";

// NOTE: Use the editor from source (not a build)!
import ClassicEditor from "@ckeditor/ckeditor5-editor-classic/src/classiceditor";
import Clipboard from "@ckeditor/ckeditor5-clipboard/src/clipboard";

import InlineEditor from "@ckeditor/ckeditor5-editor-classic/src/classiceditor";
import Essentials from "@ckeditor/ckeditor5-essentials/src/essentials";
import Paragraph from "@ckeditor/ckeditor5-paragraph/src/paragraph";
import Bold from "@ckeditor/ckeditor5-basic-styles/src/bold";
import Italic from "@ckeditor/ckeditor5-basic-styles/src/italic";
import Underline from "@ckeditor/ckeditor5-basic-styles/src/underline";
import Strikethrough from "@ckeditor/ckeditor5-basic-styles/src/strikethrough";
import BlockQuote from "@ckeditor/ckeditor5-block-quote/src/blockquote";
import Link from "@ckeditor/ckeditor5-link/src/link";
import MediaEmbed from "@ckeditor/ckeditor5-media-embed/src/mediaembed";
import PasteFromOffice from "@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice";
import Heading from "@ckeditor/ckeditor5-heading/src/heading";
import Font from "@ckeditor/ckeditor5-font/src/font";

import Image from "@ckeditor/ckeditor5-image/src/image";
import ImageStyle from "@ckeditor/ckeditor5-image/src/imagestyle";
import ImageToolbar from "@ckeditor/ckeditor5-image/src/imagetoolbar";
import ImageUpload from "@ckeditor/ckeditor5-image/src/imageupload";
import ImageCaption from "@ckeditor/ckeditor5-image/src/imagecaption";
import ImageResize from "@ckeditor/ckeditor5-image/src/imageresize";
import ImageResizeEditing from "@ckeditor/ckeditor5-image/src/imageresize/imageresizeediting";
import ImageResizeHandles from "@ckeditor/ckeditor5-image/src/imageresize/imageresizehandles";
import List from "@ckeditor/ckeditor5-list/src/list";
import Alignment from "@ckeditor/ckeditor5-alignment/src/alignment";
import Table from "@ckeditor/ckeditor5-table/src/table";
import TableToolbar from "@ckeditor/ckeditor5-table/src/tabletoolbar";
import TableProperties from "@ckeditor/ckeditor5-table/src/tableproperties";
import TableCellProperties from "@ckeditor/ckeditor5-table/src/tablecellproperties";
import TextTransformation from "@ckeditor/ckeditor5-typing/src/texttransformation";
import Indent from "@ckeditor/ckeditor5-indent/src/indent";
import IndentBlock from "@ckeditor/ckeditor5-indent/src/indentblock";
import Base64UploadAdapter from "@ckeditor/ckeditor5-upload/src/adapters/base64uploadadapter";
import LinkImage from "@ckeditor/ckeditor5-link/src/linkimage";
import HorizontalLine from "@ckeditor/ckeditor5-horizontal-line/src/horizontalline";
import ImageUploadEditing from "@ckeditor/ckeditor5-image/src/imageupload/imageuploadediting";
import UpcastWriter from "@ckeditor/ckeditor5-engine/src/view/upcastwriter";
import styled from "styled-components";

import FormData from 'form-data';
import { documentPastedImageApi,documentDetachImageApi } from "../Utils/api";

const editorConfiguration = {
  plugins: [
    ImageUploadEditing,
    PasteFromOffice,
    Essentials,
    Paragraph,
    Bold,
    Italic,
    Heading,
    Underline,
    Strikethrough,
    BlockQuote,
    Link,
    MediaEmbed,
    Font,
    Image,
    ImageStyle,
    ImageToolbar,
    ImageUpload,
    ImageCaption,
    ImageResize,
    ImageResizeEditing,
    Clipboard,
    ImageResizeHandles,
    LinkImage,
    List,
    Alignment,
    Table,
    TableToolbar,
    TextTransformation,
    TableProperties,
    TableCellProperties,
    Indent,
    IndentBlock,
    Base64UploadAdapter,
    InlineEditor,
    HorizontalLine,
  ],
  toolbar: [
    "heading",
    "|",
    "bold",
    "italic",
    "underline",
    "strikethrough",
    "|",
    "fontSize",
    "fontColor",
    "fontBackgroundColor",
    "fontFamily",
    "|",
    "bulletedList",
    "numberedList",
    "|",
    "alignment:left",
    "alignment:right",
    "alignment:center",
    "alignment:justify",
    "|",
    "blockQuote",
    "HorizontalLine",
    "|",
    "insertTable",
    "imageUpload",
    "link",
    "mediaEmbed",
  ],

  heading: {
    options: [
      {
        model: "paragraph",
        view: "p",
        title: "본문",
        class: "ck-heading_paragraph",
      },
      {
        model: "heading1",
        view: "h1",
        title: "헤더1",
        class: "ck-heading_heading1",
      },
      {
        model: "heading2",
        view: "h2",
        title: "헤더2",
        class: "ck-heading_heading2",
      },
      {
        model: "heading3",
        view: "h3",
        title: "헤더3",
        class: "ck-heading_heading3",
      },
    ],
  },
  fontSize: {
    options: [9, 10, 11, 12, 13, 14, 15, 16, 20, 24, 28],
  },
  alignment: {
    options: ["justify", "left", "center", "right"],
  },
  table: {
    contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
  },
  image: {
    toolbar: [
      "imageStyle:alignLeft",
      "imageStyle:full",
      "imageStyle:alignRight",
      "|",
      "imageStyle:align-block-left",
      "imageStyle:align-block-right",
      "imageStyle:block",
      "|",
      "imageTextAlternative",
      "|",
      "resizeImage",
      "toggleImageCaption",
      "linkImage",
    ],
    resizeUnit: "%",
    resizeOptions: [
      {
        name: "resizeImage:original",
        value: null,
        icon: "original",
      },
      {
        name: "resizeImage:25",
        value: "25",
        icon: "small",
      },
      {
        name: "resizeImage:50",
        value: "50",
        icon: "medium",
      },
      {
        name: "resizeImage:75",
        value: "75",
        icon: "large",
      },
    ],
  },

  typing: {
    transformations: {
      remove: [
        "enDash",
        "emDash",
        "oneHalf",
        "oneThird",
        "twoThirds",
        "oneForth",
        "threeQuarters",
      ],
    },
  },
  placeholder: "본문을 입력하세요.",
  fontFamily: {
    options: [
      "default",
      "Ubuntu, Arial, sans-serif",
      "Ubuntu Mono, Courier New, Courier, monospace",
    ],
  },
};
function Editor({ _docContentHandler = null, data = null, readOnly = false ,_id=null , height=null}) {

  /*data props에 나중에 데이터 불러와서 넣으면 됨.
   */

  const paste = async (event,data,editor)=>{
      if (data.dataTransfer.files.length > 0) {
        // 기존 파이프라인에서 추가된 컨텐츠 삭제
        editor.model.deleteContent(editor.model.document.selection);

        // file 정보 받아오기
        const file = data.dataTransfer.files[0];
        const images = new FormData();
        images.append('file',file);
        images.append('_id',_id);

        // 객체 생성
        const result = await documentPastedImageApi(images);
        editor.model.change(writer => {
          const imageElement = writer.createElement('imageInline', {
            src: 'http://'+result.data
          });
          // 현재 에디터의 모델이 선택하고 있는 영역에 새로 만든 컨텐츠를 삽입.
          editor.model.insertContent(imageElement, editor.model.document.selection);
        });
      }
      //이벤트를 종료함으로써 이후 로직을 무시
      event.stop();

    
    
  }
  return (
    <CustomCKEditor height={height}>
      <CKEditor
        disabled={readOnly}
        editor={ClassicEditor}
        data={data}
        _id={_id}
        config={editorConfiguration}
        onChange={(event, editor) => {
          if (!readOnly) {
            const data = editor.getData();
            _docContentHandler(data);
          }
        }}
        onReady={(editor) => {
          const documentView = editor.editing.view.document
          documentView.on('paste', (event,data)=>{paste(event,data,editor)}, { priority: 'lowest' });
          // priority가 가장 낮기 때문에 기존의 파이프라인 마지막 결과 컨텐츠에 접근할 수 있음.
          documentView.on('drop', (event,data)=>{paste(event,data,editor)}, { priority: 'lowest' });
          const toolbarElement = editor.ui.view.toolbar.element;
          if (readOnly) {
            toolbarElement.style.display = "none";
          }
        }}
      />
    </CustomCKEditor>
  );
}

const CustomCKEditor = styled.div`
  width: 100%;
  .ck-editor__editable_inline {
    height:${(props) => props.height || "1000px"};
    padding: 2rem;
  }
`;
export default Editor;
