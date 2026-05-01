import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import CategoryPage from './pages/CategoryPage';
import Settings from './pages/Settings';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="/category/all" replace />} />
        <Route path="category/:categoryName" element={<CategoryPage />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App;
