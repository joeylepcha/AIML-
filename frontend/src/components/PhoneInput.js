import React, { forwardRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import PhoneInputField from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

const PhoneWrapper = styled.div`
  margin-bottom: 20px;
  position: relative;
  width: 100%;
  box-sizing: border-box;
  
  @media (max-width: 480px) {
    margin-bottom: 16px;
  }
`;

const StyledPhoneInput = styled(PhoneInputField)`
  && .PhoneInputInput {
    width: 100%;
    padding: 16px 20px;
    border: 2px solid #e1e5e9;
    border-radius: 12px;
    font-size: clamp(14px, 3vw, 16px);
    background: white;
    transition: all 0.3s ease;
    outline: none;
    font-family: inherit;
    box-sizing: border-box;
    
    @media (max-width: 480px) {
      padding: 14px 16px;
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
  }
  
  && .PhoneInputCountrySelect {
    border: none;
    background: transparent;
    margin-right: 8px;
    font-size: clamp(14px, 3vw, 16px);
  }
  
  && .PhoneInputCountryIcon {
    width: 24px;
    height: 18px;
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

const PhoneInput = forwardRef(({ 
  label, 
  error, 
  className = '', 
  value,
  onChange,
  placeholder = "Enter phone number",
  ...props 
}, ref) => {
  return (
    <PhoneWrapper>
      {label && <Label>{label}</Label>}
      <StyledPhoneInput
        international
        countryCallingCodeEditable={false}
        defaultCountry="IN"
        value={value}
        onChange={onChange}
        className={`${error ? 'error' : ''} ${className}`}
        placeholder={placeholder}
        {...props}
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </PhoneWrapper>
  );
});

PhoneInput.displayName = 'PhoneInput';

export default PhoneInput;