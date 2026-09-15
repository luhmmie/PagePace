import { useState, useEffect} from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import { useDarkMode } from './hooks/useDarkMode.js';
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  useDarkMode();
  return <RouterProvider router={router} />;
}
 

export default App
