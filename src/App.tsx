import { Navigate, Route, Routes } from "react-router-dom";
import { AppNavbar } from "./components/AppNavbar.tsx";
import { AboutPage } from "./pages/AboutPage.tsx";
import { HomePage } from "./pages/HomePage.tsx";
import { SkinDetectionPage } from "./pages/SkinDetectionPage.tsx";

function App() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-rose-50 via-stone-100 to-pink-100'>
      <AppNavbar />
      <div className='container mx-auto px-4 py-6 md:px-8 md:py-10'>
        <Routes>
          <Route path='/' element={<Navigate to='/home' replace />} />
          <Route path='/home' element={<HomePage />} />
          <Route path='/about' element={<AboutPage />} />
          <Route path='/skin-detection' element={<SkinDetectionPage />} />
          <Route path='*' element={<Navigate to='/home' replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
