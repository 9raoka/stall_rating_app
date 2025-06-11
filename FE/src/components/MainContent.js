import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Login from './Login'; // Loginコンポーネントをインポート
import Register from './Register'; // Registerコンポーネントをインポート
import StallList from './StallList'; // 屋台のカード一覧を表示するStallListコンポーネントをインポート

const MainContent = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // ログイン状態の管理
  const [topRatedStalls, setTopRatedStalls] = useState([]); // 上位店舗の状態管理

  useEffect(() => {
    // ログイン状態を確認（トークンが存在するかどうか）
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // 上位店舗を取得する関数
  const getTopRatedStalls = async () => {
    try {
      // バックエンドのAPIからトップ3の店舗情報を取得
      const response = await fetch('http://localhost:8000/reviews/top-ranking');
      const data = await response.json();

      // 上位店舗をセット
      setTopRatedStalls(data);
    } catch (error) {
      console.error('Error fetching top rated stalls:', error);
    }
  };

  // コンポーネントがマウントされたときに上位店舗を取得
  useEffect(() => {
    getTopRatedStalls();
  }, []);

  const openLogin = () => setIsLoginOpen(true);
  const openRegister = () => setIsRegisterOpen(true);
  const closeModal = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(false);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);  // ログイン成功時に状態を更新
    closeModal();         // モーダルを閉じる
  };

  const handleLogout = () => {
    // ログアウト処理（トークンの削除）
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return (
    <>
      <Suspace space={80}></Suspace>
      <ContentWrapper>
        <Overlay>
          <Title_WC>Welcome to 技育祭</Title_WC>
          <Title_WC>2024</Title_WC>
        </Overlay>
        <ContentArea>
        <Suspace space={300}></Suspace>

          <Description>今年のチャンピオンは誰だ？？</Description>

          {/* 上位3店舗の表示 */}
          <TopRatedSection>
            <TopRatedTitle>現在のTOP３</TopRatedTitle>
            <TopRatedList>
              {topRatedStalls.map((stall) => (
                <TopRatedItem key={stall.id}>
                  <StallName>{stall.stall_name}</StallName>
                  <AverageRating>平均評価: {Math.floor(stall.average_rating *10)/10} ★</AverageRating>
                  <ReviewCount>レビュー数: {stall.rating_count}</ReviewCount>
                </TopRatedItem>
              ))}
            </TopRatedList>
          </TopRatedSection>
          <Suspace space={150}></Suspace>
          {/* ログインしているかどうかで表示を切り替え */}
          {isLoggedIn ? (
            <>
              <WelcomeMessage>Welcome!!</WelcomeMessage>
              <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
            </>
          ) : (
            <>
              <CTAButton whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={openLogin}>
                Join the Festival
              </CTAButton>
              <CTAButton whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={openRegister}>
                Register Now
              </CTAButton>
            </>
          )}
        </ContentArea>
      </ContentWrapper>

      {/* タイトルをカード一覧の上に追加 */}
      <StallListSection>
        <StallListTitle>出店店舗一覧</StallListTitle>
        {/* StallListコンポーネント（屋台のカード一覧） */}
        <StallList />
      </StallListSection>

      {/* ログインモーダル */}
      {isLoginOpen && (
        <Modal>
          <Login onLoginSuccess={handleLoginSuccess} />
          <CloseButton onClick={closeModal}>×</CloseButton>
        </Modal>
      )}

      {/* 登録モーダル */}
      {isRegisterOpen && (
        <Modal>
          <Register />
          <CloseButton onClick={closeModal}>×</CloseButton>
        </Modal>
      )}
    </>
  );
};

export default MainContent;

const Suspace = styled.div`
  margin: ${(props) => props.space}px;
`;

const Title_WC = styled(motion.h1)`
  font-size: 100px;
  font-family: 'Brush Script MT', cursive;
  color: white;
  margin: 0;
  position: relative;

`;


const ContentWrapper = styled.div`
  padding: 50px;
  position: relative;
  text-align: center;
  min-height: 100vh;
  background-image: url('/path-to-your-background-image.jpg');
  background-size: cover;
  background-position: center;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
`;

const Title = styled.h1`
  font-size: 64px;
  font-family: 'Brush Script MT', cursive;
  color: #333;
  text-align: center;
`;

const ContentArea = styled.div`
  margin-top: 100px;
`;

const Description = styled.p`
  font-size: 60px;
  font-weight: bold;
  margin: 20px 0;
  font-family: "Kozuka Mincho Pro", cursive;
  color: #444;
`;

const CTAButton = styled(motion.button)`
  background-color: #ff6347;
  color: white;
  padding: 15px 30px;
  font-size: 18px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: #ff4500;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 10;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 20px;
  background: none;
  border: none;
  cursor: pointer;
`;

const WelcomeMessage = styled.h2`
  color: #333;
  font-size: 60px;
  font-family: 'Brush Script MT', cursive;
`;

const LogoutButton = styled(motion.button)`
  background-color: #ff6347;
  color: white;
  padding: 15px 30px;
  font-size: 18px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  margin-top: 20px;

  &:hover {
    background-color: #ff4500;
  }
`;

/* 出店店舗一覧セクションのスタイル */
const StallListSection = styled.div`
  padding: 50px;
  background-color: #f8f8f8;
`;

const StallListTitle = styled.h2`
  font-size: 40px;
  text-align: center;
  margin-bottom: 30px;
  color: #333;
`;

/* 上位店舗表示用のスタイル */
const TopRatedSection = styled.div`
  margin-top: 50px;
  text-align: center;
`;

const TopRatedTitle = styled.h2`
  font-size: 36px;
  color: #333;
  margin-bottom: 20px;
`;

const TopRatedList = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
`;

const TopRatedItem = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 250px;
  text-align: center;
`;

const StallName = styled.h3`
  font-size: 20px;
  margin-bottom: 10px;
`;

const AverageRating = styled.p`
  font-size: 18px;
  color: #ff6347;
`;

const ReviewCount = styled.p`
  font-size: 16px;
  color: #333;
`;
