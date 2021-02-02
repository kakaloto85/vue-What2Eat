<template>
  <div id="app">
    <div id="nav">
      <CTabs variant="pills" :active-tab="0">
        <CTab title="Home" router-link to="/"> </CTab>
        <CTab title="Mypage" router-link to="/mypage"> </CTab>
      </CTabs>
    </div>
    <router-view />
  </div>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Noto+Sans+KR&display=swap");

#app {
  font-family: "Noto Sans KR", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
