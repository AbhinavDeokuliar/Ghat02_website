import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext';
import loginGif from '../assets/giphy.gif';
import { PiEyeClosedBold, PiEyeBold } from 'react-icons/pi';
import styled from 'styled-components';

const StyledWrapper = styled.div`
  .button {
    position: relative;
    overflow: hidden;
    height: 3rem;
    padding: 0 2rem;
    border-radius: 1.5rem;
    background: #D4C5A9;
    background-size: 400%;
    color: #5C4A3A;
    border: none;
    cursor: pointer;
    font-weight: 600;
  }

  .button:hover::before {
    transform: scaleX(1);
  }

  .button-content {
    position: relative;
    z-index: 1;
  }

  .button::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    transform: scaleX(0);
    transform-origin: 0 50%;
    width: 100%;
    height: inherit;
    border-radius: inherit;
    background: linear-gradient(
      82.3deg,
      rgba(212, 197, 169, 1) 10.8%,
      rgba(184, 167, 139, 1) 94.3%
    );
    transition: all 0.475s;
  }
`;

const Login = () => {
  const [isAdminLogin, setIsAdminLogin] = useState(true);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const response = await loginUser({
        phone,
        password
      });

      if (response.status === 'success') {
        // Check if the user's role matches the selected login type
        if ((isAdminLogin && response.data.user.role !== 'admin') || 
            (!isAdminLogin && response.data.user.role !== 'operator')) {
          setError(`Invalid credentials for ${isAdminLogin ? 'admin' : 'operator'} login`);
          return;
        }

        // Properly structure the user data for login
        const userData = {
          ...response.data.user,
          token: response.token
        };

        login(userData);

        // Add a small delay to ensure the auth context is updated
        setTimeout(() => {
          if (response.data.user.role === 'admin') {
            navigate('/', { replace: true });
          } else if (response.data.user.role === 'operator') {
            navigate('/operator', { replace: true });
          }
        }, 100);
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchLogin = () => {
    setIsAdminLogin(!isAdminLogin);
    setPhone('');
    setPassword('');
    setError('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSignIn();
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFF8DE] via-[#F5EDCD] to-[#E8DCBB] p-4">
      <div className="w-full max-w-md">
        {/* Login Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-[#E8DCBB]">
          {/* Logo and Welcome Section */}
          <div className="bg-gradient-to-br from-[#D4C5A9] to-[#B8A78B] p-8 text-center">
            {/* GIF Image with decorative border */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FFF8DE] to-[#E8DCBB] rounded-full blur-xl opacity-50"></div>
                <img 
                  src={loginGif} 
                  alt="Welcome Animation" 
                  className="relative w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg"
                />
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-[#5C4A3A] mb-2">
              Welcome Back!
            </h1>
            <h2 className="text-xl font-semibold text-[#6B5847]">
              {isAdminLogin ? 'Admin Portal' : 'Operator Portal'}
            </h2>
          </div>

          {/* Form Section */}
          <div className="p-8 bg-gradient-to-b from-[#FFFDF5] to-white">
            {/* Error message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-300 rounded-lg">
                <p className="text-red-600 text-sm text-center">{error}</p>
              </div>
            )}

            {/* Login form */}
            <form onKeyPress={handleKeyPress} className="space-y-6">
              {/* Phone input */}
              <div>
                <label className="block text-[#5C4A3A] text-sm font-bold mb-2" htmlFor="phone">
                  Phone Number
                </label>
                <input
                  className="w-full px-4 py-3 bg-[#FFF8DE]/30 text-gray-800 rounded-lg border border-[#D4C5A9] focus:outline-none focus:border-[#B8A78B] focus:ring-2 focus:ring-[#D4C5A9]/50 transition-all duration-300"
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              {/* Password input with toggle */}
              <div>
                <label className="block text-[#5C4A3A] text-sm font-bold mb-2" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <input
                    className="w-full px-4 py-3 bg-[#FFF8DE]/30 text-gray-800 rounded-lg border border-[#D4C5A9] focus:outline-none focus:border-[#B8A78B] focus:ring-2 focus:ring-[#D4C5A9]/50 transition-all duration-300 pr-12"
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B7355] hover:text-[#5C4A3A] focus:outline-none transition-colors duration-300"
                  >
                    {showPassword ? (
                      <PiEyeBold className="w-5 h-5" />
                    ) : (
                      <PiEyeClosedBold className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Buttons */}
              <StyledWrapper>
                <div className="flex flex-col space-y-4 mt-8">
                  <button
                    type="button"
                    onClick={handleSignIn}
                    disabled={isLoading}
                    className="button w-full font-semibold text-lg"
                  >
                    <span className="button-content">
                      {isLoading ? 'Signing In...' : 'Sign In'}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={handleSwitchLogin}
                    className="text-[#8B7355] hover:text-[#5C4A3A] transition-colors duration-300 text-sm font-semibold py-2"
                  >
                    Switch to {isAdminLogin ? 'Operator Login' : 'Admin Login'}
                  </button>
                </div>
              </StyledWrapper>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;