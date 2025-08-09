
import { BrowserRouter, Routes ,Route} from 'react-router-dom';
import Home from './pages/home/Home';
import Layout from './pages/layout/Layout';
import MyUrls from './pages/my-url/MyUrls';



function App() {
  return (
     <BrowserRouter>
      <Routes>
        
        <Route element= {<Layout />}>
          <Route path="/" element= {<Home/>}  />
          <Route path="/my-urls" element= {<MyUrls/>}  />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
