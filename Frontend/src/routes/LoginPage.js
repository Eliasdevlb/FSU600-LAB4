import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import apiEndpoints from '../configs/ApiEndpoints';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const { authData } = useAuth();
  const navigate = useNavigate();

  const handleEmailChange = (event) => setEmail(event.target.value);
  const handlePasswordChange = (event) => setPassword(event.target.value);

  useEffect(() => {
    if (authData && authData.token) {
      navigate('/');
    }
  }, [authData, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const loginData = { email, password };
    const response = await fetch(apiEndpoints.login, {
      method: 'POST',
      redirect: 'follow',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginData)
    });

    if (response.ok) {
      const data = await response.json();
      login(data);
      toast.success('Login Successful! Redirecting...', {
        position: "top-center",
        autoClose: 1000,
        onClose: () => {
          navigate('/');
        }
      });
    } else {
      toast.error(<div><i className="fa fa-times-circle" aria-hidden="true"></i> Login Failed! Please Check Your Credentials</div>, {
        position: "top-center"
      });      
    }
  };


  return (
    <div>
      <div className="bg-gradient-to-r from-red-500 to-yellow-500 to-green-500 to-blue-500 to-indigo-500 to-purple-500 h-1"></div>
      <header className="bg-white py-4 flex justify-between items-center">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-red-600 cursor-pointer" onClick={() => navigate('/')}>blocket</h1>
        </div>
      </header>
      <div className="bg-gradient-to-r from-red-500 to-yellow-500 to-green-500 to-blue-500 to-indigo-500 to-purple-500 h-1 flex justify-center items-center h-screen bg-cover bg-no-repeat bg-fixed" style={{ backgroundImage: "url('your-background-image-path.jpg')" }}>
        <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
          <h1 className="text-3xl text-red-600 font-bold mb-4">blocket</h1>
          <p className="mb-4">Logga in för en bättre upplevelse</p>
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
                Ange ditt lösenord *
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={handlePasswordChange}
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-6">
              <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Fortsätt
              </button>
            </div>
            <div className="mb-4">
              <button onClick={() => navigate('/signup')} className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
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

export default LoginPage;
