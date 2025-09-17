import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
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

const PasswordWrapper = styled.div`
  position: relative;
`;


const ForgotPassword = styled(Link)`
  display: block;
  text-align: right;
  color: #667eea;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  margin: -10px 0 24px;
  
  &:hover {
    text-decoration: underline;
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

const SignupLink = styled.div`
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

const DemoCredentials = styled(motion.div)`
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;
  box-sizing: border-box;
  
  @media (max-width: 480px) {
    padding: 12px;
    margin-bottom: 20px;
  }
  
  h4 {
    color: #475569;
    font-size: clamp(12px, 2.5vw, 14px);
    font-weight: 600;
    margin-bottom: 8px;
  }
  
  p {
    color: #64748b;
    font-size: clamp(10px, 2vw, 12px);
    margin: 4px 0;
    word-break: break-all;
  }
`;

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showMobileModal, setShowMobileModal] = useState(false);
  const { login, socialLogin, mobileLogin, loading } = useAuth();
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm();

  const onSubmit = async (data) => {
    const result = await login(data);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  const fillDemoCredentials = () => {
    setValue('username', 'demo@example.com');
    setValue('password', 'demo123');
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
          Welcome to Smart Flow
        </Title>
        <Subtitle>Sign in to your intelligent workflow platform</Subtitle>
      </Header>

      <DemoCredentials
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        onClick={fillDemoCredentials}
        style={{ cursor: 'pointer' }}
      >
        <h4>👋 Demo Credentials (Click to fill)</h4>
        <p>Email: demo@example.com</p>
        <p>Password: demo123</p>
      </DemoCredentials>

      <Form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          label="Email or Username"
          type="text"
          placeholder="Enter your email or username"
          icon={<FiMail />}
          error={errors.username?.message}
          {...register('username', {
            required: 'Email or username is required'
          })}
        />

        <div style={{ position: 'relative' }}>
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
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
                value: 6,
                message: 'Password must be at least 6 characters'
              }
            })}
          />
        </div>

        <ForgotPassword to="#">Forgot Password?</ForgotPassword>

        <Button
          type="submit"
          loading={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Sign In
        </Button>

        <Divider>
          <span>Or continue with</span>
        </Divider>

        <SocialLoginButtons
          onGoogleLogin={handleGoogleLogin}
          onFacebookLogin={handleFacebookLogin}
          onMobileLogin={handleMobileLogin}
          loading={loading}
        />

        <Divider>
          <span>New to our platform?</span>
        </Divider>

        <Button
          as={Link}
          to="/signup"
          variant="secondary"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Create Account
        </Button>
      </Form>

      <SignupLink>
        Don't have an account? <Link to="/signup">Sign up</Link>
      </SignupLink>
      
      <MobileVerificationModal
        isOpen={showMobileModal}
        onClose={() => setShowMobileModal(false)}
        onSuccess={handleMobileSuccess}
      />
    </PageContainer>
  );
};

export default LoginPage;