import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const ButtonWrapper = styled(motion.button)`
  width: 100%;
  padding: 16px;
  background: ${props => props.variant === 'secondary' 
    ? 'transparent' 
    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  };
  color: ${props => props.variant === 'secondary' ? '#667eea' : 'white'};
  border: ${props => props.variant === 'secondary' ? '2px solid #667eea' : 'none'};
  border-radius: 12px;
  font-size: clamp(14px, 3vw, 16px);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-sizing: border-box;
  
  @media (max-width: 480px) {
    padding: 14px;
    border-radius: 10px;
    gap: 6px;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const Button = ({ 
  children, 
  variant = 'primary', 
  loading = false, 
  disabled = false,
  onClick,
  type = 'button',
  ...props 
}) => {
  const { whileHover, whileTap, ...restProps } = props;
  
  return (
    <ButtonWrapper
      variant={variant}
      onClick={onClick}
      disabled={disabled || loading}
      type={type}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      {...restProps}
    >
      {loading ? (
        <>          <div
            style={{
              width: '16px',
              height: '16px',
              border: '2px solid transparent',
              borderTop: '2px solid currentColor',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}
          />
          Loading...
        </>
      ) : (
        children
      )}
    </ButtonWrapper>
  );
};

export default Button;