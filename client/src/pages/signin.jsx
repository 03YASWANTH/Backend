import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignInPage = () => {
  const [selectedRole, setSelectedRole] = useState('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/v1/admin/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('adminInfo', JSON.stringify(data.admin));
        localStorage.setItem('userRole', 'admin');
        navigate('/admin');
      } else {
        setError(data.message || 'Failed to sign in');
      }
    } catch (err) {
      setError('An error occurred during sign in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900  to-indigo-800">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-[10px] opacity-50">
          
          
          {/* Small floating circles */}
          <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-blue-400 rounded-full opacity-40 animate-float-slow"></div>
          <div className="absolute top-1/3 right-1/3 w-6 h-6 bg-purple-400 rounded-full opacity-40 animate-float-medium"></div>
          <div className="absolute bottom-1/4 right-1/4 w-4 h-4 bg-pink-400 rounded-full opacity-40 animate-float-fast"></div>
          <div className="absolute top-2/3 left-1/3 w-5 h-5 bg-yellow-400 rounded-full opacity-40 animate-float-medium"></div>
          <div className="absolute bottom-1/3 right-1/2 w-7 h-7 bg-indigo-400 rounded-full opacity-40 animate-float-slow"></div>
          <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-blue-300 rounded-full opacity-40 animate-float-fast"></div>
        </div>
      </div>

      <div className="min-h-screen flex relative z-10">
        {/* Rest of the component remains the same */}
        {/* Left side with brand */}
        <div className="hidden lg:flex lg:flex-col lg:w-1/2 p-12 relative">
          <div className="flex flex-col h-full justify-center items-center text-white">
            <h1 className="text-6xl font-bold mb-8 tracking-tight">
              Counsellor
              <span className="bg-white text-blue-600 px-4 py-2 ml-2 rounded-md inline-block transform hover:scale-105 transition-transform">
                Connect
              </span>
            </h1>
            <p className="text-xl text-gray-200 max-w-md text-center leading-relaxed">
              Empowering connections, fostering growth, and building bridges in educational counseling.
            </p>
          </div>
        </div>

        {/* Right side with form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md space-y-8 bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl">
            {/* Mobile logo */}
            <h1 className="lg:hidden text-4xl font-bold text-white tracking-tight text-center mb-8">
              Counsellor
              <span className="bg-white text-blue-600 px-3 py-1 ml-2 rounded-md inline-block">
                Connect
              </span>
            </h1>

            <h2 className="text-3xl font-bold text-white">
              Welcome back
              <span className="block text-sm font-normal text-gray-200 mt-1">
                Please enter your details to sign in
              </span>
            </h2>

            {error && (
              <div className="bg-red-500/20 backdrop-blur-sm text-red-200 p-4 rounded-lg text-sm border border-red-500/30">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 mt-8">
              <div className="flex space-x-4 p-1 bg-white/5 rounded-lg backdrop-blur-sm">
                <button
                  type="button"
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all transform hover:scale-105 ${
                    selectedRole === 'admin'
                      ? 'bg-white text-blue-600 shadow-lg'
                      : 'text-white hover:bg-white/10'
                  }`}
                  onClick={() => setSelectedRole('admin')}
                >
                  Admin
                </button>
                <button
                  type="button"
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all transform hover:scale-105 ${
                    selectedRole === 'faculty'
                      ? 'bg-white text-blue-600 shadow-lg'
                      : 'text-white hover:bg-white/10'
                  }`}
                  onClick={() => setSelectedRole('faculty')}
                >
                  Counsellor
                </button>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-200">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 block w-full px-4 py-3 bg-white/10 border border-gray-200/20 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent text-white placeholder-gray-400 backdrop-blur-sm transition-all"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-200">
                    Password
                  </label>
                  <button 
                    type="button" 
                    className="text-sm text-blue-300 hover:text-white font-medium transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1 block w-full px-4 py-3 bg-white/10 border border-gray-200/20 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent text-white placeholder-gray-400 backdrop-blur-sm transition-all"
                  placeholder="Enter your password"
                />
              </div>

              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-200">
                  Remember me
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-medium text-white transition-all transform hover:scale-105 ${
                  isLoading 
                    ? 'bg-blue-400/50 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Updated styles for animations */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        @keyframes float {
          0% {
            transform: translate(0px, 0px);
          }
          50% {
            transform: translate(10px, -10px);
          }
          100% {
            transform: translate(0px, 0px);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animate-float-slow {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-medium {
          animation: float 4s ease-in-out infinite;
        }
        .animate-float-fast {
          animation: float 3s ease-in-out infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default SignInPage;