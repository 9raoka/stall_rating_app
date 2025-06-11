import React from 'react';
import Header from './components/Header';
import MainContent from './components/MainContent';
import styled from 'styled-components';

const App = () => {
  return (
    <AppContainer>
      <MainContent />
    </AppContainer>
  );
};

export default App;

const AppContainer = styled.div`
  font-family: 'Arial', sans-serif;
  color: #333;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  z-index: 1;

  /* 背景画像 */
  background-image: url('/matsuri.jpg');
  background-size: contain;
  background-position: center;
  background-attachment: fixed;

  /* 非線形グラデーション */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      rgba(255, 99, 71, 0.7) 0%,   /* 上部は透明 */
      rgba(255, 99, 71, 0.7) 20%, /* 緩やかに半透明 */
      rgba(255, 99, 71, 0) 100%   /* 下部は完全に白 */
    );
    z-index: -1;
  }
`;

