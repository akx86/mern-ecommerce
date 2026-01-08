import { RouterProvider } from 'react-router-dom';
import { router } from './router'
import { Toaster } from 'react-hot-toast';




 
function App() { 
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      
      {/* سطر واحد بيشغل التطبيق كله! */}
      <RouterProvider router={router} />
    </>
  );
}

export default App