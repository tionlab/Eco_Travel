# Eco Travel 웹 애플리케이션

<p align="center">
  <img src="./public/logo.png" alt="로고" />
</p>

<p align="left">
  <strong>Available README Languages :</strong>
  <a href="./README.md">KR</a> | <a href="./README_EN.md">EN</a> | <a href="./README_ZH.md">ZH</a>
</p>
<p align="center">
  <strong>에코-트래블 웹 애플리케이션에 오신 것을 환영합니다!</strong><br>
  이 애플리케이션은 지속 가능한 여행과 환경 보호를 촉진하기 위해 설계되었습니다. Next.js로 구축된 이 애플리케이션은 여행자가 친환경적인 선택을 하고, 환경에 미치는 영향을 이해할 수 있도록 다양한 기능을 제공합니다.
</p>

## 주요 기능

### 🌍 지속 가능한 여행 추천

### 📚 정보 및 자료 제공

### 💬 유저간 정보 공유

### 🧠 지능형 어시스턴스

### ♻️ 탄소 발자국 계산기 (만보기)

## 데모
> https://eco-travel.netlify.app 에서 직접 사용해보세요! (구글 유료 서비스를 제외한 모든 기능을 사용할 수 있습니다)

### 로그인 / 회원가입
<p align="center">
  <img src="./demo/login.png" height="500"/>
</p>

### 홈 화면
<p align="center">
  <img src="./demo/home.png" height="500"/>
</p>

### 커뮤니티
<p align="center">
  <img src="./demo/chat.png" height="500"/>
</p>

### 여행 추천 상품 페이지
<p align="center">
  <img src="./demo/suggest.png" height="500"/>
</p>

### 탄소 발자국 만보기
<div style="display: flex; justify-content: space-between;">
  <img src="./demo/walk.png" height="500">
  <img src="./demo/walk2.png" height="500">
</div>

### 여행지 검색 페이지
<p align="center">
  <img src="./demo/search.png" height="500"/>
</p>

### 리워드 자격확인/수령 페이지
<p align="center">
  <img src="./demo/reward.png" height="500"/>
</p>

### 리워드 광고 페이지
<p align="center">
  <img src="./demo/ad.png" height="500"/>
</p>

### 마이페이지
<div style="display: flex; justify-content: space-between;">
  <img src="./demo/mypage.png" height="500">
  <img src="./demo/mypage2.png" height="500">
  <img src="./demo/mypage3.png" height="500">
</div>

### 앱 사용 AI 도우미
<p align="center">
  <img src="./demo/ai.png" height="500"/>
</p>

## 시작하기

프로젝트를 시작하려면 아래 단계를 따르세요:

1. **레포지토리 클론**

```base
   git clone https://github.com/tionlab/eco-trav.git
```

2. **프로젝트 디렉터리로 이동**

```base
   cd eco-travel-app
```

3. **의존성 설치**

```base
   npm install
```

4. **.env.local 수정**

.env를 본인의 키로 수정하세요.

4. **개발 서버 실행**

```base
   npm run dev
```

앱은 http://localhost:3000 에서 실행됩니다.

## 알림

-   pages/download.js 는 public/ecotravel.apk를 사용합니다. 이에 대해 APK를 만들어 추가하거나 pages/download.js를 삭제하여 기능을 삭제하십시오.
-   pages/aichat.js 는 AI 채팅기능이 기본적으로 구축되있지 않습니다. 해당 파일에서 직접 AI 채팅기능을 구축하시길 바랍니다.
-   pages/\_app.js에 있는 ClickIndicator의 주석을 해제하여 ClickIndicator 기능을 활성화 할 수 있습니다.
-   일부 이미지 파일 생성에 생성형 AI가 사용되었습니다.
-   리워드 지급 시 보여지는 데모광고는 [환경부에서 제작한 공익광고](https://www.youtube.com/watch?v=cCW6eKySZjk)를 사용하였습니다.

## 기여하기

에코-트래블 웹 애플리케이션의 개선을 위한 기여를 환영합니다! 제안, 버그 신고 또는 기능 요청이 있으시면 이슈를 생성하거나 풀 리퀘스트를 제출해 주세요.

1. **레포지토리 포크**
2. **기능 브랜치 생성**

```base
   git checkout -b feature/your-feature
```

3. **변경사항 커밋**

```base
   git commit -am '새 기능 추가'
```

4. **브랜치에 푸시**

```base
   git push origin feature/your-feature
```

5. **풀 리퀘스트 생성**

