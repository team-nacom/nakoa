
# 해야할 것

- [x] section cell 구현
- [x] section cell의 자식들 접기 기능

- [x] 레이턴시 줄이기 - 27.2ms + 43.2ms
 => 16.5ms + 24.9ms
 => 6.1ms + 23.6ms ...
 => 1~2ms + 8ms ...

React 구조상으로 할 만한 건 다 했다. bottleneck은 markdown parsing이다.

- [x] textarea를 autosize 가능하게
- [x] markdown renderer에서 mathMacroObj 적용할 수 있도록
- [x] 라벨링

- [ ] Display / Publish 모드 구현

- [x] cell 옮기기 기능

- [ ] cell <=> { rootId, cellData, structData } 양방향 변환
- [ ] 셀별 업로드
- [ ] 각 셀별 편집 히스토리 구현(?)
- [ ] 각 셀별 저자, 최근 수정 시각 구현
- [ ] 한 게시글(sheet)에서 셀을 모아서 다른 게시글로 만들기
  - 다른 저자의 셀을 사용해 그룹을 만든 다음 수정할 경우 자동 fork?


- [ ] 단축키
- [ ] 히스토리