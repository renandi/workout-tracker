import { Routes, Route } from 'react-router-dom';
import { useTheme } from './hooks/useTheme';
import { MyWorkouts } from './pages/MyWorkouts';
import { Library } from './pages/Library';
import { BottomNav } from './components/BottomNav';

export default function App() {
  useTheme(); // aplica a classe dark no html

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      <Routes>
        <Route path="/" element={<MyWorkouts />} />
        <Route path="/biblioteca" element={<Library />} />
      </Routes>
      <BottomNav />
    </div>
  );
}