import BlogPost from 'components/BlogPost';
import Footer from 'components/Footer';
import Header from 'components/Header';
import Markdown from 'components/Markdown';
import React from 'react';

const blogText = String.raw`
안녕하세요! 팀 나무컴퍼스가 만든 블로그 게시글 프로젝트입니다. 이 페이지는 markdown으로 쓰인 블로그 글을 예쁘게 보여줍니다. 상단에는 글의 목차를 뽑아서 보여줍니다.

$E = mc^2$입니다.

$$ dp[k] = \max_{i=1, \cdots, k-1} (dp[i] + ax^2 + bx + c) $$

$$ = \max_{i=1, \cdots, k-1} (dp[i] + a(S_k - S_i)^2 + b (S_k - S_i) + c) $$

$$ = \max_{i=1, \cdots, k-1} (dp[i] + a S_k^2 - 2 a S_k S_i + a S_i ^ 2 + b S_k - b S_i + c ) $$

$$ = \max_{i=1, \cdots, k-1} (dp[i] - 2 a S_k S_i + a S_i ^ 2 - b S_i ) + a S_k^2 + b S_k + c $$

$$ = \max_{i=1, \cdots, k-1} ( -2aS_i \times S_k + (dp[i] + a S_i^2 - b S_i) ) + a S_k^2 + bS_k + c$$

일까요?

## 이 곳은 크립토 프로젝트 블로그입니다.

여기에는 앞으로 유용한 글들이 올라올 예정입니다.

1. 번호 붙이는 것도 될 건데
2. [링크](https://junie.land)도 되고
   - 이런거도
   - 되는걸로?

### 오늘의 이야기입니다.

오늘 점심에 헬스를 갔다와서, 돌아오는 길이었습니다. 평소같이 저는 시장 단골 김밥집에서 땡초김밥 하나와 참치김밥 하나를 사오는 길이었습니다.

여기는 다른 가게와 달리 땡초김밥과 참치김밥이 2천원입니다. 저는 여기 자주 가서, 아주머니와 안면을 익혔습니다. 그렇지만, 더 많이 얹어주시는 것 같지는 않습니다. 요즘 경기가 안 좋잖아요. 오늘 지갑에 5만원짜리밖에 없어서, 김밥 값을 내면서 아주머니께 잔소리를 들었습니다. 이렇게 큰 돈을 주냐고~

그런데, 닫은 줄로만 알고 있었던 명랑 핫도그가 오늘 열려있는 겁니다! 그래서 김밥을 한 손에 들고, 명랑 핫도그를 다른 손에 사먹고 말았습니다. 오늘 운동한 의미는 별로 없어졌네요.

## 두 번째 챕터

배고팡~~

`;

function BlogPage() {
    return (
        <>
            <Header />
            <BlogPost text={blogText}/>
            <Footer />
        </>
    );
}

export default BlogPage;