import React from 'react';
import styled from 'styled-components';

const StallCard = ({ stall, onClick }) => {
  return (
    <Card onClick={onClick}>  {/* onClickを渡す */}
      <CardImage src={stall.thumbnail_URL} alt={stall.thumbnail_URL} />
      <CardContent>
        <CardTitle>{stall.stall_name}</CardTitle>
        <CardOwner>オーナー: {stall.owner_name}</CardOwner>
      </CardContent>
    </Card>
  );
};

export default StallCard;

const Card = styled.div`
  width: 300px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: white;
  overflow: hidden;
  transition: transform 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const CardContent = styled.div`
  padding: 20px;
`;

const CardTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 10px;
  color: #333;
`;

const CardOwner = styled.p`
  font-size: 16px;
  color: #666;
`;
