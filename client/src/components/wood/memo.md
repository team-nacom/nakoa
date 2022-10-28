# 노트 구조

22/09/23

## 셀(cell)

* 단일 타입의 데이터를 저장하는 단위

```ts
{
    id: string, //username + unique number?
    cellType: 'wood' | 'text' | 'math' | 'code' | 'board' | ... ,
    created: timestamp, //created timestamp
    modified: timestamp,
    arg1: ...
    arg2: ...
}
```

셀 아이디는
1. 로컬에서 생성됐다면 `l + (timestamp)`
2. DB에 등록할 땐 `(username) + : + (unique string generated from DB)`

### text cell

text cell에서 부가적으로 `%[cellId]` 같은 문법을 허용한다.
text cell에서 자체적으로 렌더링할 경우 해당 셀에 대한 링크로 대체한다.

### root cell

다음 절 참조.


## 나무(wood) ↔ wood cell

다른 셀을 트리구조로 엮을 수 있는 셀이다. 폴더인 셈이다.
다만 인제 여러 개의 나무가 한 셀을 가질 수 있다.

```ts
{
    id: string,
    cellType: 'wood',
    authors: string[],
    title: string,
    struct: { [cellId]: string[] }
    contextMath: string,
    ...
}
```
`title`이 제목, `struct[cellId]`가 자식 id들이다.

(DB에 올릴 때는 자식 셀이 먼저 다 올라와 있어야 한다.)

* 렌더 시 sanity check를 꼭 할 것. 다만 무한루프가 안 일어나게만 하면(즉 각각의 cell에 well-defined depth를 줄 수 있으면) 된다. 어차피 depth 5 이상은 끊을 것 같긴 하다...

* 나무 셀은 다른 나무 셀을 가질 수 있지만 




## 나무의 렌더링방식

* preview(셀을 작게, 가로 형태로 표시)
* 


## 에디터의 사용방법

각 셀별 에디터 컴포넌트를 준비한다.
텍스트 셀 에디터는 textarea가 뜨고, 필기 셀 에디터는 잉크입력을 받아들이는 식이다.

나무 에디터의 경우,
* 자신을 포함한 최대 1개의 셀을 에디터로 열 수 있으며 그 셀의 id를 상태로 가지고 있는다. 나머지는 프리뷰로 보여준다.
 
* 각 셀의 히스토리는 각 셀의 에디터가 관리한다.
    * 셀 에디터 안에서 undo 했을 경우 그 셀의 undo를 실시(bubbling 방지), 셀 에디터 밖(나무 에디터 활성화)에서 undo 했을 경우 나무 셀의 undo를 실시한다.


# 플랫폼으로서.

## 셀의 권한

읽기 : 나만 가능 / 특정 그룹만 가능 / 전체가 가능
쓰기, 삭제 : 나만 가능 / 특정 그룹만 가능 / 전체가 가능

## 노트 공유

노트를 공유할 수 있는 그룹을 만들어야 한다.
그룹은 username를 나열하는 방식으로 선언할 수도 있고 그룹을 관계형으로 따로 만들 수도 있다.
1. 
2. 

co-author 같은 경우엔 

## 어디까지 읽었나 표시.
구현 방법이 두 가지 있는데
하나는 어디까지 읽었나

---

# 에디터 상태에서 만들어야 하는 것

## 열려있는 셀.