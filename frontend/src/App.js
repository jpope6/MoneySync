import './global.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Hero from './components/Hero';
import Home from './components/Home';
import { AuthProvider } from './context/AuthContext';
import { UserProvider } from './context/UserContext';
import { BackendUrlProvider } from './context/BackendUrlContext';

function App() {
  return (
    <BackendUrlProvider>
      <UserProvider>
        <AuthProvider>
          <BrowserRouter>
            <div className="App">
              <Routes>
                <Route path='/' element={<Hero />} />
                <Route path='/home' element={<Home />} />
                <Route path='/signup' element={<SignUp />} />
                <Route path='/signin' element={<SignIn />} />
              </Routes>
            </div>
          </BrowserRouter>
        </AuthProvider>
      </UserProvider>
    </BackendUrlProvider>
  );
}

export default App;
