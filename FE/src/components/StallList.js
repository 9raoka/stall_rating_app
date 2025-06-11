import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import StallCard from './StallCard';
import StallDetail from './StallDetail';  // StallDetailコンポーネントをインポート

const StallList = () => {
  const [stalls, setStalls] = useState([]); // 屋台リストの状態
  const [selectedStall, setSelectedStall] = useState(null);  // モーダル表示のための選択状態
  const [loading, setLoading] = useState(true); // 読み込み中の状態
  const [error, setError] = useState(null); // エラーメッセージの状態

  // APIから屋台一覧を取得
  useEffect(() => {
    const fetchStalls = async () => {
      try {
        const response = await fetch('http://localhost:8000/stalls/'); // FastAPIのエンドポイント
        if (!response.ok) {
          throw new Error('データの取得に失敗しました');
        }
        const data = await response.json();
        setStalls(data); // 屋台データを状態にセット
        setLoading(false); // 読み込み完了
      } catch (err) {
        setError(err.message);
        setLoading(false); // エラーでも読み込み完了
      }
    };

    fetchStalls();
  }, []);

  const handleCardClick = (stall) => {
    setSelectedStall(stall);  // カードクリックで選択されたお店の情報をセット
  };

  const handleCloseDetail = () => {
    setSelectedStall(null);  // モーダルを閉じる
  };

  if (loading) {
    return <p>読み込み中...</p>; // 読み込み中の表示
  }

  if (error) {
    return <p>エラー: {error}</p>; // エラー発生時の表示
  }

  return (
    <div>
      <StallListWrapper>
        {stalls.map((stall) => (
          <StallCard key={stall.id} stall={stall} onClick={() => handleCardClick(stall)} />
        ))}
      </StallListWrapper>

      {/* 選択されたお店の詳細を表示するモーダル */}
      {selectedStall && (
        <StallDetail stall={selectedStall} onClose={handleCloseDetail} />
      )}
    </div>
  );
};

export default StallList;

const StallListWrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
  padding: 20px;
  background-color: #f8f8f8;
`;
