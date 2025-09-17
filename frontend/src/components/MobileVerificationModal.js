import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiPhone, FiCheck } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { isValidPhoneNumber } from 'libphonenumber-js';
import PhoneInput from './PhoneInput';
import Button from './Button';
import Input from './Input';

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  box-sizing: border-box;
`;

const ModalContent = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 32px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  position: relative;
  box-sizing: border-box;
  
  @media (max-width: 480px) {
    padding: 24px;
    border-radius: 16px;
    margin: 20px;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  
  .back-button {
    background: none;
    border: none;
    padding: 8px;
    cursor: pointer;
    color: #64748b;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:hover {
      background: #f1f5f9;
      color: #1e293b;
    }
  }
`;

const Title = styled.h2`
  font-size: clamp(20px, 4vw, 24px);
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  flex: 1;
`;

const Description = styled.p`
  color: #64748b;
  font-size: clamp(14px, 3vw, 16px);
  margin-bottom: 24px;
  line-height: 1.5;
`;

const StepIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 32px;
  
  .step {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 600;
    
    &.active {
      background: #667eea;
      color: white;
    }
    
    &.completed {
      background: #10b981;
      color: white;
    }
    
    &.inactive {
      background: #e2e8f0;
      color: #64748b;
    }
  }
  
  .line {
    flex: 1;
    height: 2px;
    background: #e2e8f0;
    
    &.completed {
      background: #10b981;
    }
  }
`;

const OtpContainer = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  margin: 24px 0;
  
  @media (max-width: 480px) {
    gap: 8px;
  }
`;

const OtpInput = styled.input`
  width: 48px;
  height: 48px;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  background: white;
  transition: all 0.3s ease;
  outline: none;
  
  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }
  
  &:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  &.filled {
    border-color: #10b981;
    background: #f0fdf4;
  }
`;

const ResendContainer = styled.div`
  text-align: center;
  margin: 20px 0;
  
  p {
    color: #64748b;
    font-size: 14px;
    margin-bottom: 8px;
  }
  
  button {
    color: #667eea;
    background: none;
    border: none;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    text-decoration: underline;
    
    &:hover {
      color: #5a67d8;
    }
    
    &:disabled {
      color: #9ca3af;
      cursor: not-allowed;
      text-decoration: none;
    }
  }
`;

const MobileVerificationModal = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState(1); // 1: phone, 2: otp
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const { register, handleSubmit, formState: { errors }, setError, clearErrors } = useForm();

  const handlePhoneSubmit = async (data) => {
    if (!phoneNumber || !isValidPhoneNumber(phoneNumber)) {
      setError('phone', { message: 'Please enter a valid phone number' });
      return;
    }

    setLoading(true);
    try {
      // Simulate sending OTP
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Move to OTP step
      setStep(2);
      startResendTimer();
      clearErrors();
    } catch (error) {
      setError('phone', { message: 'Failed to send OTP. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.querySelector(`input[name="otp-${index + 1}"]`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.querySelector(`input[name="otp-${index - 1}"]`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleOtpSubmit = async () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      return;
    }

    setLoading(true);
    try {
      // Simulate OTP verification
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success
      const userData = {
        phone: phoneNumber,
        name: 'Mobile User',
        verified: true
      };
      
      onSuccess && onSuccess(userData);
      onClose();
    } catch (error) {
      // Handle error
      console.error('OTP verification failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const startResendTimer = () => {
    setResendTimer(30);
    const timer = setInterval(() => {
      setResendTimer(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    
    setLoading(true);
    try {
      // Simulate resending OTP
      await new Promise(resolve => setTimeout(resolve, 1000));
      startResendTimer();
    } catch (error) {
      console.error('Failed to resend OTP:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
      setOtp(['', '', '', '', '', '']);
    } else {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <ModalContent
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <Header>
          <button className="back-button" onClick={handleBack}>
            <FiArrowLeft size={20} />
          </button>
          <Title>
            {step === 1 ? 'Enter Phone Number' : 'Verify OTP'}
          </Title>
        </Header>

        <StepIndicator>
          <div className={`step ${step === 1 ? 'active' : 'completed'}`}>
            {step === 1 ? <FiPhone size={16} /> : <FiCheck size={16} />}
          </div>
          <div className={`line ${step === 2 ? 'completed' : ''}`} />
          <div className={`step ${step === 2 ? 'active' : 'inactive'}`}>
            2
          </div>
        </StepIndicator>

        {step === 1 ? (
          <form onSubmit={handleSubmit(handlePhoneSubmit)}>
            <Description>
              We'll send you a verification code to confirm your phone number.
            </Description>
            
            <PhoneInput
              label="Phone Number"
              value={phoneNumber}
              onChange={setPhoneNumber}
              error={errors.phone?.message}
              placeholder="Enter your phone number"
            />

            <Button
              type="submit"
              loading={loading}
              disabled={!phoneNumber}
            >
              Send OTP
            </Button>
          </form>
        ) : (
          <div>
            <Description>
              Enter the 6-digit code we sent to {phoneNumber}
            </Description>

            <OtpContainer>
              {otp.map((digit, index) => (
                <OtpInput
                  key={index}
                  name={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  className={digit ? 'filled' : ''}
                />
              ))}
            </OtpContainer>

            <ResendContainer>
              <p>Didn't receive the code?</p>
              <button
                onClick={handleResendOtp}
                disabled={resendTimer > 0 || loading}
              >
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
              </button>
            </ResendContainer>

            <Button
              onClick={handleOtpSubmit}
              loading={loading}
              disabled={otp.join('').length !== 6}
            >
              Verify & Continue
            </Button>
          </div>
        )}
      </ModalContent>
    </ModalOverlay>
  );
};

export default MobileVerificationModal;