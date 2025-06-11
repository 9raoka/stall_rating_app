import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Login from './Login';  // ログインコンポーネントをインポート
import Register from './Register';  // ユーザー登録コンポーネントをインポート

const StallDetail = ({ stall, onClose }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 1, comment: '' });
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);  // ログイン状態の管理
  const [isLoginOpen, setIsLoginOpen] = useState(false);  // ログインモーダル
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);  // 登録モーダル
  const [reviewAverage, setReviewAverage] = useState(0); // ある店のレビューの平均値

  // ページスクロール無効化
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // ログイン状態を確認
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);  // トークンが存在する場合、ログイン状態に設定
    }
  }, []);

  // メニューとレビューをAPIから取得
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch(`http://localhost:8000/items/${stall.id}`);
        const data = await response.json();
        setMenuItems(data);
      } catch (err) {
        setError('メニューの取得に失敗しました');
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await fetch(`http://localhost:8000/reviews/stall/${stall.id}`);
        const data = await response.json();
        setReviews(data);
      } catch (err) {
        setError('レビューの取得に失敗しました');
      }
    };

    // レビューの平均値を計算
    const averageRating = async () => {
      try {
        const response = await fetch(`http://localhost:8000/reviews/average/${stall.id}`);
        const data = await response.json();
        setReviewAverage(Math.floor(data.average_rating *10)/10);
      } catch (err) {
        setError('レビューの取得に失敗しました');
      }
    }

    averageRating();
    fetchMenuItems();
    fetchReviews();
  }, [stall.id]);



  // レビュー投稿処理
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/reviews/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          stall_id: stall.id,
          rating: newReview.rating,
          comment: newReview.comment,
        })
      });

      const data = await response.json();
      setReviews([...reviews, data]); 
      setNewReview({ rating: 1, comment: '' });
    } catch (err) {
      setError('レビューの投稿に失敗しました');
    }
  };

  const openLogin = () => setIsLoginOpen(true);  // ログインモーダルを開く
  const openRegister = () => setIsRegisterOpen(true);  // 登録モーダルを開く
  const closeModal = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(false);
  };

  // 星を表示するためのコンポーネント
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<Star key={i}>&#9733;</Star>);  // 塗りつぶされた星
      } else if (i - rating < 1) {
        stars.push(<Star key={i}>&#9734;</Star>);  // 半分塗りつぶされた星
      } else {
        stars.push(<Star key={i}>&#9734;</Star>);  // 空の星
      }
    }
    return stars;
  };

  return (
    <Modal>
      <ModalContent>
        <CloseButton onClick={onClose}>×</CloseButton>
        <h2>{stall.stall_name}</h2>

        {/* メニュー一覧 */}
        <h3>メニュー</h3>
        {menuItems.length > 0 ? (
          <MenuList>
            {menuItems.map((item) => (
              <MenuItem key={item.id}>
                {item.item_name} - {item.price}円
              </MenuItem>
            ))}
          </MenuList>
        ) : (
          <p>メニューがありません。</p>
        )}

        {/* レビューと星評価 */}
        <ReviewHeader>
          <h3>レビュー</h3>
          <ReviewStats>
            <AverageRating>平均: {reviewAverage}</AverageRating>
            <StarContainer>{renderStars(reviewAverage)}</StarContainer>
            <ReviewCount>レビュー数: {reviews.length}</ReviewCount>
          </ReviewStats>
        </ReviewHeader>

        {/* レビュー一覧 */}
        {reviews.length > 0 ? (
          <ScrollableReviewList>
            {reviews.map((review) => (
              <ReviewItem key={review.id}>
                <strong>評価: {review.rating} ★</strong> - {review.comment}
              </ReviewItem>
            ))}
          </ScrollableReviewList>
        ) : (
          <p>レビューがありません。</p>
        )}

        {/* ログイン状態に応じてレビュー投稿フォームを表示 */}
        <h3>レビューを投稿する</h3>
        {isLoggedIn ? (
          <form onSubmit={handleReviewSubmit}>
            <label>
              評価:
              <select
                value={newReview.rating}
                onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
              >
                {[1, 2, 3, 4, 5].map((rating) => (
                  <option key={rating} value={rating}>
                    {rating}
                  </option>
                ))}
              </select>
            </label>
            <label>
              コメント:
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                required
              />
            </label>
            <SubmitButton type="submit">投稿</SubmitButton>
          </form>
        ) : (
          <p>
            レビューを投稿するには
            <LinkButton onClick={openLogin}>ログイン</LinkButton> または 
            <LinkButton onClick={openRegister}>ユーザー登録</LinkButton>してください。
          </p>
        )}

        {error && <p style={{ color: 'red' }}>{error}</p>}
      </ModalContent>

      {/* ログインモーダル */}
      {isLoginOpen && (
        <ModalOverlay>
          <Modal>
            <Login onLoginSuccess={() => setIsLoggedIn(true)}/>
            <CloseButton onClick={closeModal}>×</CloseButton>
          </Modal>
        </ModalOverlay>
      )}

      {/* 登録モーダル */}
      {isRegisterOpen && (
        <ModalOverlay>
          <Modal>
            <Register />
            <CloseButton onClick={closeModal}>×</CloseButton>
          </Modal>
        </ModalOverlay>
      )}
    </Modal>
  );
};

export default StallDetail;

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 1000px;
  max-height: 95vh;
  height: auto;  /* 高さを自動で調整 */
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 10;
  overflow: hidden;  /* モーダル全体のスクロールを抑制 */
  min-height: 400px;  /* 最低限の高さを指定 */
`;

const ModalContent = styled.div`
  position: relative;
  height: auto;  /* コンテンツに応じて高さを自動調整 */
  overflow-y: auto;  /* コンテンツが多い場合にスクロール */
  padding: 20px;
  max-height: calc(95vh - 40px); /* モーダル全体の最大高さから余白を引いた分だけ確保 */
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 10;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
  background: none;
  border: none;
  cursor: pointer;
`;

const MenuList = styled.ul`
  list-style: none;
  padding: 0;
  margin-bottom: 20px;
`;

const MenuItem = styled.li`
  font-size: 18px;
  margin-bottom: 10px;
`;

const ScrollableReviewList = styled.ul`
  list-style: none;
  padding: 0;
  max-height: 250px;
  overflow-y: auto;
  border-top: 1px solid #ccc;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const ReviewItem = styled.li`
  font-size: 16px;
  margin-bottom: 10px;
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ReviewStats = styled.div`
  display: flex;
  align-items: center;
  margin-left: 20px;
`;

const AverageRating = styled.span`
  font-size: 18px;
  font-weight: bold;
  margin-right: 10px;
`;

const StarContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Star = styled.span`
  font-size: 20px;
  color: gold;
  margin-right: 5px;
`;

const ReviewCount = styled.span`
  font-size: 16px;
  margin-left: 10px;
`;

const SubmitButton = styled.button`
  background-color: #ff6347;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background-color: #ff4500;
  }
`;

const LinkButton = styled.button`
  background: none;
  border: none;
  color: blue;
  text-decoration: underline;
  cursor: pointer;
  padding: 0;
  margin-left: 5px;
  font-size: 14px;
  &:hover {
    color: darkblue;
  }
`;
