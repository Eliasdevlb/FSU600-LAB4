import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import apiEndpoints from '../configs/ApiEndpoints';

const SignupPage = () => {

  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };
  
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const user = {
      email: email,
      password: password,
      confirmPassword: confirmPassword
    };

    fetch(apiEndpoints.register, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          toast.success('Sign Up Successful! Redirecting You To Login', {
            position: 'top-center',
            autoClose: 2000,
            onClose: () => {
              navigate('/login');
            },
          });
        } else {
          toast.error('An error has occurred while signing up', {
            position: 'top-center',
            autoClose: 2000,
          });
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        toast.error('An error has occurred while signing up', {
          position: 'top-center',
          autoClose: 2000,
        });
      });
    };

  return (
    <div>
      <div className="bg-gradient-to-r from-red-500 to-yellow-500 to-green-500 to-blue-500 to-indigo-500 to-purple-500 h-1"></div>
      <header className="bg-white py-4 flex justify-between items-center">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-red-600 cursor-pointer" onClick={() => navigate('/')}>blocket</h1>
        </div>
      </header>
      <div className="flex justify-center items-center h-screen bg-cover bg-no-repeat bg-fixed" style={{ backgroundImage: "url('your-background-image-path.jpg')" }}>
        <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
          <h1 className="text-3xl text-red-600 font-bold mb-4">blocket</h1>
          <p className="mb-4">Skapa ett konto för en bättre upplevelse</p>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                Ange din e-postadress *
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={handleEmailChange}
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                Välj ett lösenord *
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={handlePasswordChange}
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">
                Bekräfta ditt lösenord *
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Registrera
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={2000} hideProgressBar newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover style={{ zIndex: 9999 }} />
    </div>
  );
};

export default SignupPage;
