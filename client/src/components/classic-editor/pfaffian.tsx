export const pfaffian = `
$$
\\providecommand{\\pf}{\\mathrm{pf}}
\\providecommand{\\sgn}{\\mathrm{sgn}}
\\providecommand{\\mt}{\\mathcal{M}[2n]}
\\providecommand{\\et}{\\mathcal{E}[2n]}
\\providecommand{\\abs}[1]{\\left\\lvert #1 \\right\\rvert}
$$

# Pfaffian Identity
# Introduction
어떤 행렬 $A = (a_{ij})$가 $a_{ij} = -a_{ji}$, 즉 $A = -A^{t}$를 만족하면 $A$를 skew-symmetric matrix라고 합니다.\n일반적으로 $m \\times m$ 행렬 $B = (b_{ij})$의 *Determinant* $\\det(B)$는 아래와 같이 정의한다는 사실이 잘 알려져 있습니다.
$$
\\det B = \\sum_{\\sigma \\in S_{m}} \\sgn(\\sigma) b_{1,\\sigma(1)}a_{2, \\sigma(2)} \\cdots b_{m, \\sigma(m)}
$$
만약 $m$이 홀수인 경우, $B$가 skew-symmetric이면 $\\det B = 0$이 됩니다. $\\det B = \\det B^{t} = \\det(-B) = (-1)^{m} \\det (B)$이기 때문입니다.\n따라서 오늘 글에서는 크기가 $2n \\times 2n$인 skew-symmetric matrix $A$에 대해서만 생각하기로 합니다. 이러한 $A$에 대해, *Pfaffian* $\\pf(A)$를 다음과 같이 정의합니다.
$$
\\pf(A) = \\frac{1}{n! \\cdot 2^{n}} \\sum_{\\sigma \\in S_{2n}} \\sgn(\\sigma) a_{\\sigma(1)\\sigma(2)} \\cdots a_{\\sigma(2n-1)\\sigma(2n)}
$$
이 글에서는 조합론적인 방법으로 다음 등식을 보입니다.
$$
\\det(A) = \\pf(A)^{2}
$$
# Proof
## Gathering Pfaffian terms
수식(%c11%)의 분모에 있는 $n! \\cdot 2^{n}$을 먼저 제거해줍시다.\r\n\r\n순열 $\\sigma \\in S_{2n}$을 정점이 $[2n] = \\{1, \\cdots, 2n\\}$인 완전그래프 $K_{2n}$의 완전 매칭으로 생각합시다. $\\sigma(1)$과 $\\sigma(2)$를 간선 $e_{1}$으로, $\\sigma(3)$과 $\\sigma(4)$를 간선 $e_{2}$로, ... , $\\sigma(2n-1)$과 $\\sigma(2n)$을 간선 $e_{n}$으로 이어주었다고 생각합니다. 이 때 간선은 방향이 있고, 방향은 $\\sigma(2k-1)$에서 $\\sigma(2k)$로 가는 쪽입니다. 즉, 길이 $2n$의 순열은 하나의 oriented-labeled perfect matching으로 생각할 수 있습니다.\r\n한편, $\\sigma \\in S_{2n}$에 대해 $\\mathrm{sgn}(\\sigma) a_{\\sigma(1)\\sigma(2)} \\cdots a_{\\sigma(2n-1)\\sigma(2n)}$을 $P(\\sigma)$라고 정의합시다. 즉, (%c11%)를 다시 쓰면 아래와 같습니다.
$$
\\pf(A) = \\frac{1}{n! \\cdot 2^{n}}\\sum_{\\sigma \\in S_{2n}} P(\\sigma)
$$
이 때 순열 $\\sigma$에서 간선의 *label* $e_{1}, \\cdots, e_{n}$을 제거하고, 방향성을 제거하면 하나의 perfect matching $M$을 유일하게 추출할 수 있습니다. 만약 두 순열 $\\sigma, \\tau \\in S_{2n}$에서 추출할 수 있는 매칭이 $M$으로 같다면 $\\sigma \\equiv_{M} \\tau$라고 씁시다.\r\n\r\n**Proposition 1.** $\\sigma\\equiv_{M} \\tau$이면 $P(\\sigma) = P(\\tau)$.\r\n\r\n*Proof.* 한 간선의 방향성을 바꿔 다는 연산, 두 간선의 label을 맞교환하는 연산에 대해 $P(\\cdot)$가 보존된다는 것을 보이면 충분합니다. 전자는 $A$가 skew-symmetric이기 때문에 성립하고, 후자는 두 간선의 label을 맞교환하는 연산을 짝수 번의 transposition으로 구현할 수 있기 때문에 성립합니다.
아래 관찰은 자명합니다.\r\n**Proposition 2.** 어떤 $M$이 있어 $\\sigma \\equiv_{M} \\tau$이면 $\\sigma \\sim \\tau$라고 쓸 때, $\\sim$은 Equivalence relation이고 equivalence class의 크기는 $n! \\cdot 2^{n}$.\r\n\r\n따라서 equivalence class의 개수는 $(2n)! / (n! \\cdot 2^{n})$은 $(2n-1)!! = (2n-1)(2n-3) \\cdots 1$임을 계산할 수 있는데, 이는 여러 방법으로 셀 수 있는 완전그래프 $K_{2n}$의 perfect matching 개수와 같다는 것을 쉽게 알 수 있습니다.
$P(\\sigma)$는 equivalence class에 대해 보존되므로, 추출된 perfect matching $M$에 대해 $P(M)$을 자연스럽게 정의할 수 있습니다. 편의상 $K_{2n}$의 완전 매칭들을 모아둔 집합을 $\\mathcal{M}[2n]$으로 정의합시다. 그렇다면 이제 (%c11%), (%c23%)을 다음과 같이 다시 쓸 수 있습니다.
$$
\\pf(A) = \\sum_{M \\in \\mathcal{M}[2n]} P(M)
$$
## Canonical Mapping
본격적인 증명을 위해, 한 가지 조합론적인 관찰을 하고 들어갑시다.\n\n두 perfect matching $M, N \\in \\mt$에 대해, $M, N$의 간선을 합친 그래프 $j(M, N)$을 생각해봅시다.\n\n$j(M, N)$의 모든 정점은 차수가 $2$이기 때문에 사이클로만 구성된 그래프입니다. 또한, 모든 사이클의 크기는 짝수여야 합니다. 그렇지 않으면 $M, N$ 중 한 매칭에 두 번 연결된 정점이 존재하게 됩니다.\n\n
짝수 크기의 사이클로만 이루어진 그래프들의 모임을 $\\et$이라고 합시다. 아무 $G \\in \\et$에 대해, $j(M, N) = G$인 $M, N \\in \\mt$이 존재합니다. 각 사이클을 두 개로 쪼개면 되니까요. 다시 말해, $j : \\mt \\times \\mt \\to \\et$는 Surjection입니다.\n만약 $G$가 짝수 사이클 $k$개로 이루어져 있다면, $j(M, N)  = G$인 $(M, N)$의 개수는 정확히 $2^{k}$가 되는 것을 알 수 있습니다. 즉 $j$가 injective하지는 않은 것이죠. 일단은 이 $2^{k}$라는 수를 반드시 기억해두도록 합시다. 편의상 $k$를 $G$의 betti number $\\beta(G)$로 쓰면, $\\abs{j^{-1}(G)} = 2^{\\beta(G)}$가 됩니다.
## Gathering Determinant Terms
아무 순열 $\\sigma \\in S_{2n}$이 주어져 있을 때, $i \\to \\sigma(i)$ 간선을 이어주면 방향성 있는 사이클로만 이루어진 그래프가 됩니다. 여기서 방향성을 제거해서 얻은 그래프들은 사이클로만 이루어져 있으면 되니 $\\et$보다 좀 더 다양합니다.\n마찬가지로 $\\sigma, \\tau$에서 얻을 수 있는 그래프가 $H$로 동일하면 $\\sigma \\equiv \\tau$, $H$를 강조하고 싶을 때는 $\\sigma \\equiv_{H} \\tau$로 정의하고, $P(\\sigma)$와 비슷하게 $D(\\sigma)$를 $\\sgn(\\sigma) \\times a_{1 \\sigma(1)} \\cdots a_{2n \\sigma(2n)}$로 정의합시다.
특별히 각 equivalence class를 $[H]$와 같이 쓴다고 할 때, 다음이 성립합니다.\n\n**Proposition 3.**\n- $H \\notin \\et$이면, $\\sigma, \\tau \\in [H]$에 대해 $D(\\sigma) = \\pm D(\\tau)$. $\\sum_{\\sigma \\in [H]} D(\\sigma) = 0$.\n- $H \\in \\et$이면, $\\sigma, \\tau \\in [H]$에 대해 $D(\\sigma) = D(\\tau)$. $\\sum_{\\sigma \\in [H]} D(\\sigma) = 2^{\\beta(H)}D(\\sigma_{0})$ for any $\\sigma_{0} \\in [H]$.
$$
\\det A = \\sum_{\\sigma \\in S_{2n}} D(\\sigma)
$$
*Proof.* Equivalence class의 원소들은 사실상 한 원소 $\\sigma_{0}$를 고정하고, 각 사이클의 방향성을 뒤집는 것으로 모두 생성할 수 있습니다. 이후의 과정은 생략.
따라서 $D(H)$를 자연스럽게 정의하면 다음과 같이 쓸 수 있습니다.
$$
\\det A = \\sum_{H \\in \\et} 2^{\\beta(H)} D(H)
$$
## Product Relation
사실 $D$와 $P$ 사이에는 이제야 한 줄로 쓸 수 있게 된, 다음과 같이 자명한 관계가 있습니다. $M, N \\in \\mt$에 대해
$$
P(M)P(N) = D(j(M, N))
$$
이로부터, 바로 (%c13%)을 증명할 수 있습니다.
$$
\\begin{aligned}\n\\pf(A) \\cdot \\pf(A) &= \\sum_{M \\in \\mt} P(M) \\sum_{N \\in \\mt} P(N)&(\\because 3.1.2) \\\\\n&=\\sum_{M, N \\in \\mt} P(M)P(N) = \\sum_{M, N} D(j(M, N))&(\\because 3.4.1)\\\\\n&= \\sum_{G \\in \\et} \\sum_{j(M, N) = G} D(G)&\\\\\n&= \\sum_{G \\in \\et} 2^{\\beta(G)} D(G) &(\\because 3.2.1)\\\\\n&= \\det A & (\\because 3.3.2)\n\\end{aligned}
$$
$$
\\abs{j^{-1}(G)} = 2^{\\beta(G)}
$$
`