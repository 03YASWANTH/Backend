import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import stuff from '../assets/signin stuff.jpg';

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
        localStorage.setItem('userRole', 'admin'); // Add this to track user role
        navigate('/admin');
      } else 
      {
        setError(data.message || 'Failed to sign in');
      }
      
    } catch (err) {
      setError('An error occurred during sign in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side with image */}
      <div className="hidden lg:flex lg:flex-col lg:w-1/2 p-12 bg-gray-50 relative">
        <h1 className="absolute top-8 left-8 text-4xl font-bold text-blue-600 tracking-tight">
          Counsellor
          <span className="bg-blue-600 text-white px-3 py-1 ml-2 rounded-md">
            Connect
          </span>
        </h1>
        <img 
          src={stuff} 
          alt="Sign in illustration" 
          className="w-full h-full object-contain"
        />
      </div>

      {/* Right side with form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo - only shows on mobile */}
          <h1 className="lg:hidden text-3xl font-bold text-blue-600 tracking-tight text-center mb-8">
            Counsellor
            <span className="bg-blue-600 text-white px-3 py-1 ml-2 rounded-md">
              Connect
            </span>
          </h1>

          <h2 className="text-3xl font-bold text-gray-900">
            Welcome back
            <span className="block text-sm font-normal text-gray-600 mt-1">
              Please enter your details to sign in
            </span>
          </h2>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 mt-8">
            <div className="flex space-x-4 p-1 bg-gray-100 rounded-lg">
              <button
                type="button"
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  selectedRole === 'admin'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
                onClick={() => setSelectedRole('admin')}
              >
                Admin
              </button>
              <button
                type="button"
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  selectedRole === 'faculty'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
                onClick={() => setSelectedRole('faculty')}
              >
                Counsellor
              </button>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <button 
                  type="button" 
                  className="text-sm text-blue-600 hover:text-blue-500 font-medium"
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your password"
              />
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                isLoading 
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors`}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;







// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import stuff from '../assets/signin stuff.jpg';

// const SignInPage = ({ setRole }) => {
//   const [selectedRole, setSelectedRole] = useState('admin');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();
  
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setIsLoading(true);

//     try {
//       const response = await fetch('http://localhost:3000/api/v1/admin/signin', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           email,
//           password
//         }),
//       });

//       const data = await response.json();
      

//       if (response.ok && data.success) {
//         console.log(data.success);
//         localStorage.setItem('token', data.token);
//         localStorage.setItem('adminInfo', JSON.stringify(data.admin));
//         setRole('admin');
//         console.log(data.success);
//         navigate('/admin');
//         console.log(data.success);
        
//       } else 
//       {
        
//         setError(data.message || 'Failed to sign in');
//         navigate('/signin');
//       }
      
//     } catch (err) {
//       setError('An error occurred during sign ins');
//       navigate('/signin');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex">
//       {/* Left side with image */}
//       <div className="hidden lg:flex lg:flex-col lg:w-1/2 p-12 bg-gray-50 relative">
//         <h1 className="absolute top-8 left-8 text-4xl font-bold text-blue-600 tracking-tight">
//           Counsellor
//           <span className="bg-blue-600 text-white px-3 py-1 ml-2 rounded-md">
//             Connect
//           </span>
//         </h1>
//         <img 
//           src={stuff} 
//           alt="Sign in illustration" 
//           className="w-full h-full object-contain"
//         />
//       </div>

//       {/* Right side with form */}
//       <div className="flex-1 flex items-center justify-center p-8">
//         <div className="w-full max-w-md space-y-8">
//           {/* Mobile logo - only shows on mobile */}
//           <h1 className="lg:hidden text-3xl font-bold text-blue-600 tracking-tight text-center mb-8">
//             Counsellor
//             <span className="bg-blue-600 text-white px-3 py-1 ml-2 rounded-md">
//               Connect
//             </span>
//           </h1>

//           <h2 className="text-3xl font-bold text-gray-900">
//             Welcome back
//             <span className="block text-sm font-normal text-gray-600 mt-1">
//               Please enter your details to sign in
//             </span>
//           </h2>

//           {error && (
//             <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
//               {error}
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-6 mt-8">
//             <div className="flex space-x-4 p-1 bg-gray-100 rounded-lg">
//               <button
//                 type="button"
//                 className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
//                   selectedRole === 'admin'
//                     ? 'bg-white text-blue-600 shadow-sm'
//                     : 'text-gray-600 hover:text-blue-600'
//                 }`}
//                 onClick={() => setSelectedRole('admin')}
//               >
//                 Admin
//               </button>
//               <button
//                 type="button"
//                 className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
//                   selectedRole === 'faculty'
//                     ? 'bg-white text-blue-600 shadow-sm'
//                     : 'text-gray-600 hover:text-blue-600'
//                 }`}
//                 onClick={() => setSelectedRole('faculty')}
//               >
//                 Counsellor
//               </button>
//             </div>

//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                 Email
//               </label>
//               <input
//                 id="email"
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                 placeholder="your@email.com"
//               />
//             </div>

//             <div>
//               <div className="flex items-center justify-between">
//                 <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//                   Password
//                 </label>
//                 <button 
//                   type="button" 
//                   className="text-sm text-blue-600 hover:text-blue-500 font-medium"
//                 >
//                   Forgot password?
//                 </button>
//               </div>
//               <input
//                 id="password"
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                 placeholder="Enter your password"
//               />
//             </div>

//             <div className="flex items-center">
//               <input
//                 id="remember-me"
//                 type="checkbox"
//                 className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//               />
//               <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
//                 Remember me
//               </label>
//             </div>

//             <button
//               type="submit"
//               disabled={isLoading}
//               className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
//                 isLoading 
//                   ? 'bg-blue-400 cursor-not-allowed'
//                   : 'bg-blue-600 hover:bg-blue-700'
//               } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors`}
//             >
//               {isLoading ? 'Signing in...' : 'Sign in'}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignInPage;