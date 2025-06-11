import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const Header = () => {
  return (
    <HeaderContainer>
      <Title
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        Welcome to Matsuri Festival
      </Title>
    </HeaderContainer>
  );
};

export default Header;

const HeaderContainer = styled.header`
  padding: 300px;
  text-align: center;
`;

const Title = styled(motion.h1)`
  font-size: 100px;
  color: white;
  margin: 0;
  position: relative;
  top: -180px; /* この値を調整して文字を上に移動 */
`;

