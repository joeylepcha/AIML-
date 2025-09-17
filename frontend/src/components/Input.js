import React, { forwardRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const InputWrapper = styled.div`
  margin-bottom: 20px;
  position: relative;
  width: 100%;
  box-sizing: border-box;
  
  @media (max-width: 480px) {
    margin-bottom: 16px;
  }
`;

const StyledInput = styled(motion.input).attrs(props => ({
  as: props.as || 'input'
}))`
  width: 100%;
  padding: 16px ${props => props.hasMultipleIcons ? 'clamp(70px, 15vw, 90px)' : props.hasIcon ? '50px' : '20px'} 16px 20px;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  font-size: clamp(14px, 3vw, 16px);
  background: white;
  transition: all 0.3s ease;
  outline: none;
  resize: ${props => props.as === 'textarea' ? 'vertical' : 'none'};
  min-height: ${props => props.as === 'textarea' ? '100px' : 'auto'};
  font-family: inherit;
  box-sizing: border-box;
  
  @media (max-width: 480px) {
    padding: 14px ${props => props.hasMultipleIcons ? 'clamp(60px, 12vw, 80px)' : props.hasIcon ? '46px' : '16px'} 14px 16px;
    border-radius: 10px;
  }
  
  &:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  &::placeholder {
    color: #9ca3af;
  }
  
  &.error {
    border-color: #ef4444;
    animation: shake 0.3s ease-in-out;
  }
  
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: clamp(12px, 2.5vw, 14px);
  font-weight: 600;
  color: #374151;
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 12px;
  margin-top: 4px;
  margin-left: 4px;
`;

const IconWrapper = styled.div`
  position: absolute;
  right: ${props => props.isSecondary ? '50px' : '16px'};
  top: ${props => props.hasLabel ? '36px' : '12px'};
  color: #9ca3af;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(16px, 3vw, 18px);
  z-index: 1;
  width: 20px;
  height: 20px;
  
  @media (max-width: 480px) {
    right: ${props => props.isSecondary ? '46px' : '12px'};
    top: ${props => props.hasLabel ? '32px' : '10px'};
    font-size: 16px;
  }
`;

const Input = forwardRef(({ 
  label, 
  error, 
  icon, 
  secondaryIcon,
  hasMultipleIcons = false,
  className = '', 
  ...props 
}, ref) => {
  return (
    <InputWrapper>
      {label && <Label>{label}</Label>}
      <div style={{ position: 'relative' }}>
        <StyledInput
          ref={ref}
          className={`${error ? 'error' : ''} ${className}`}
          hasIcon={!!icon}
          hasMultipleIcons={hasMultipleIcons}
          whileFocus={{ scale: 1.02 }}
          {...props}
        />
        {icon && (
          <IconWrapper hasLabel={!!label}>
            {icon}
          </IconWrapper>
        )}
        {secondaryIcon && (
          <IconWrapper hasLabel={!!label} isSecondary>
            {secondaryIcon}
          </IconWrapper>
        )}
      </div>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </InputWrapper>
  );
});

Input.displayName = 'Input';

export default Input;