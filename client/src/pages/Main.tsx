import React from 'react';
import Header from 'components/Header';
import ReactMarkdown from 'react-markdown';
import markdownConfig from 'etc/markdownConfig';

const mainText = `
# Team WoodenCompass
안녕하세요! 팀 나무컴퍼스입니다.

## 이 곳은 웹사이트입니다.

1. 오늘 점심에 헬스를 갔다와서, 돌아오는 길이었습니다.
2. 평소같이 저는 시장 단골 김밥집에서 땡초김밥 하나와 참치김밥 하나를 사오는 길이었습니다.
   * 여기는 다른 가게와 달리 땡초김밥과 참치김밥이 2천원입니다.
   * 저는 여기 자주 가서, 아주머니와 안면을 익혔습니다. 그렇지만, 더 많이 얹어주시는 것 같지는 않습니다. 요즘 경기가 안 좋잖아요.
   * 오늘 지갑에 5만원짜리밖에 없어서, 김밥 값을 내면서 아주머니께 잔소리를 들었습니다. 이렇게 큰 돈을 주냐고~
3. 그런데, 닫은 줄로만 알고 있었던 명랑 핫도그가 오늘 열려있는 겁니다!
4. 그래서 김밥을 한 손에 들고, 명랑 핫도그를 다른 손에 사먹고 말았습니다.
5. 오늘 운동한 의미는 별로 없어졌네요.

## 
`;

function Main() {
    return (
        <>
            <Header/>
            <ReactMarkdown source={mainText} renderers={markdownConfig} />
        </>
    );
}

export default Main;