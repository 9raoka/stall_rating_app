import React, { useState, useEffect } from "react";
import ReviewForm from "./ReviewForm";

const ShopDetails = ({ shop, setSelectedShop }) => {
  const [details, setDetails] = useState(null);
  const [authToken, setAuthToken] = useState(localStorage.getItem("authToken"));

  useEffect(() => {
    const fetchShopDetails = async () => {
      const response = await fetch(`http://localhost:5000/shops/${shop.id}`);
      const data = await response.json();
      setDetails(data);
    };

    if (shop) {
      fetchShopDetails();
    }
  }, [shop]);

  if (!details) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{shop.name}</h2>
      <p>評価: {details.rating ? details.rating : '評価なし'}</p>

      <h3>メニュー</h3>
      <ul>
        {details.menu && details.menu.length > 0 ? (
          details.menu.map((item, index) => (
            <li key={index}>{item.name} - ¥{item.price}</li>
          ))
        ) : (
          <p>メニューがありません</p>
        )}
      </ul>

      {/* レビュー一覧表示 */}
      <h3>レビュー</h3>
      {details.reviews && details.reviews.length > 0 ? (
        details.reviews.map((review, index) => (
          <div key={index}>
            <p>ユーザー: {review.user}</p>
            <p>評価: {review.rating}</p>
            <p>コメント: {review.comment}</p>
          </div>
        ))
      ) : (
        <p>レビューがありません</p>
      )}

      {/* ログインユーザーがいる場合のみレビュー投稿フォームを表示 */}
      {authToken ? (
        <ReviewForm shopId={shop.id} />
      ) : (
        <p>レビューを投稿するにはログインしてください</p>
      )}

      <button onClick={() => setSelectedShop(null)}>戻る</button>
    </div>
  );
};

export default ShopDetails;
