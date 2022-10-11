# nextrend(react) Backend

## Start Application

```
yarn start
```

## Project Confirmation
1. 서버 폴더 구조에 따른 기능 명시
    - controller(수정 필요) :  routes가 호출. http 오류 검출.
    - routes : http 요청을 직접 받는 부분. 
    - service(수정 필요) : controller 가 호출. migration이 통신하기 위해 쓰는 parameter를 직접 수정.
    - migration(추가 필요) : *작성 필요*


### Only use master branch
1인 개발의 사유로 인해 gitflow 원칙을 따르지 않습니다.

## Status Code Definition
> ### 200번대
> ---
> - 200 : 요청 성공
> - 201 : JWT 재생성 시
> <br>
>
> ### 400번대
> ---
> - 400 : 데이터 손상 혹은 잘못된 요청
> - 401 : 인증되지 않음
