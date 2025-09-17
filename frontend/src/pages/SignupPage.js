import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../utils/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';
import SocialLoginButtons from '../components/SocialLoginButtons';
import MobileVerificationModal from '../components/MobileVerificationModal';

const PageContainer = styled.div`
  min-height: 100%;
  padding: 24px;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  box-sizing: border-box;
  overflow-y: auto;
  
  @media (max-width: 768px) {
    padding: 16px;
    min-height: 100vh;
  }
  
  @media (max-width: 480px) {
    padding: 12px;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 32px;
  
  @media (max-width: 768px) {
    margin-bottom: 24px;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 20px;
  }
`;

const Title = styled(motion.h1)`
  font-size: clamp(24px, 5vw, 32px);
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
`;

const Subtitle = styled.p`
  font-size: clamp(14px, 3vw, 16px);
  color: #64748b;
  font-weight: 500;
  line-height: 1.4;
`;

const Form = styled(motion.form)`
  flex: 1;
  max-width: 100%;
  width: 100%;
  box-sizing: border-box;
`;



const PasswordStrength = styled.div`
  margin-top: 8px;
  margin-bottom: 16px;
  
  .strength-bar {
    height: 4px;
    background: #e2e8f0;
    border-radius: 2px;
    overflow: hidden;
    margin-bottom: 8px;
    
    .strength-fill {
      height: 100%;
      transition: all 0.3s ease;
      border-radius: 2px;
    }
  }
  
  .strength-text {
    font-size: 12px;
    font-weight: 500;
  }
`;

const TermsText = styled.div`
  font-size: 12px;
  color: #64748b;
  text-align: center;
  margin: 20px 0;
  line-height: 1.5;
  
  a {
    color: #667eea;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 32px 0;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #e2e8f0;
  }
  
  span {
    padding: 0 16px;
    color: #64748b;
    font-size: 14px;
    font-weight: 500;
  }
`;

const SigninLink = styled.div`
  text-align: center;
  margin-top: 24px;
  color: #64748b;
  font-size: 14px;
  
  a {
    color: #667eea;
    text-decoration: none;
    font-weight: 600;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showMobileModal, setShowMobileModal] = useState(false);
  const { register: registerUser, socialLogin, mobileLogin, loading } = useAuth();
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger
  } = useForm();

  const password = watch('password');
  const confirmPassword = watch('confirmPassword');

  const calculatePasswordStrength = (password) => {
    if (!password) return 0;
    
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    return strength;
  };

  useEffect(() => {
    const strength = calculatePasswordStrength(password);
    setPasswordStrength(strength);
  }, [password]);

  const getStrengthColor = (strength) => {
    if (strength < 2) return '#ef4444';
    if (strength < 4) return '#f59e0b';
    return '#10b981';
  };

  const getStrengthText = (strength) => {
    if (strength < 2) return 'Weak';
    if (strength < 4) return 'Medium';
    return 'Strong';
  };

  const onSubmit = async (data) => {
    const { confirmPassword, ...userData } = data;
    const result = await registerUser(userData);
    if (result.success) {
      navigate('/login');
    }
  };

  const handleGoogleLogin = async (googleUser) => {
    const result = await socialLogin('google', googleUser);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  const handleFacebookLogin = async (facebookUser) => {
    const result = await socialLogin('facebook', facebookUser);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  const handleMobileLogin = () => {
    setShowMobileModal(true);
  };

  const handleMobileSuccess = async (mobileData) => {
    const result = await mobileLogin(mobileData);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <PageContainer>
      <Header>
        <Title
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Join Smart Flow
        </Title>
        <Subtitle>Create your account for intelligent workflow management</Subtitle>
      </Header>

      <Form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          label="Full Name"
          type="text"
          placeholder="Enter your full name"
          icon={<FiUser />}
          error={errors.full_name?.message}
          {...register('full_name', {
            required: 'Full name is required',
            minLength: {
              value: 2,
              message: 'Full name must be at least 2 characters'
            }
          })}
        />

        <Input
          label="Username"
          type="text"
          placeholder="Choose a username"
          icon={<FiUser />}
          error={errors.username?.message}
          {...register('username', {
            required: 'Username is required',
            minLength: {
              value: 3,
              message: 'Username must be at least 3 characters'
            },
            pattern: {
              value: /^[a-zA-Z0-9_]+$/,
              message: 'Username can only contain letters, numbers, and underscores'
            }
          })}
        />

        <Input
          label="Email"
          type="email"
          placeholder="Enter your email address"
          icon={<FiMail />}
          error={errors.email?.message}
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address'
            }
          })}
        />

        <div style={{ position: 'relative' }}>
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Create a strong password"
            icon={<FiLock />}
            secondaryIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#9ca3af',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            }
            hasMultipleIcons={true}
            error={errors.password?.message}
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters'
              },
              validate: (value) => {
                const strength = calculatePasswordStrength(value);
                if (strength < 3) {
                  return 'Password should contain uppercase, lowercase, numbers, and special characters';
                }
                return true;
              }
            })}
          />
        </div>

        {password && (
          <PasswordStrength>
            <div className="strength-bar">
              <div 
                className="strength-fill"
                style={{
                  width: `${(passwordStrength / 5) * 100}%`,
                  backgroundColor: getStrengthColor(passwordStrength)
                }}
              />
            </div>
            <div 
              className="strength-text"
              style={{ color: getStrengthColor(passwordStrength) }}
            >
              Password strength: {getStrengthText(passwordStrength)}
            </div>
          </PasswordStrength>
        )}

        <div style={{ position: 'relative' }}>
          <Input
            label="Confirm Password"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm your password"
            icon={<FiLock />}
            secondaryIcon={
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#9ca3af',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            }
            hasMultipleIcons={true}
            error={errors.confirmPassword?.message}
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (value) => {
                if (value !== password) {
                  return 'Passwords do not match';
                }
                return true;
              }
            })}
          />
        </div>

        <TermsText>
          By creating an account, you agree to our{' '}
          <Link to="#">Terms of Service</Link> and{' '}
          <Link to="#">Privacy Policy</Link>
        </TermsText>

        <Button
          type="submit"
          loading={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Create Account
        </Button>

        <Divider>
          <span>Or sign up with</span>
        </Divider>

        <SocialLoginButtons
          onGoogleLogin={handleGoogleLogin}
          onFacebookLogin={handleFacebookLogin}
          onMobileLogin={handleMobileLogin}
          loading={loading}
        />

        <Button
          as={Link}
          to="/login"
          variant="secondary"
          style={{ marginTop: '16px' }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Back to Sign In
        </Button>
      </Form>

      <SigninLink>
        Already have an account? <Link to="/login">Sign in</Link>
      </SigninLink>
      
      <MobileVerificationModal
        isOpen={showMobileModal}
        onClose={() => setShowMobileModal(false)}
        onSuccess={handleMobileSuccess}
      />
    </PageContainer>
  );
};

export default SignupPage;
