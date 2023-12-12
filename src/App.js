import { Fragment } from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { publicRoutes,privateRoutes } from './routes';   
import DefaultLayout from './components/Layout/HeaderOnly';
// import Staff from './components/Layout/Staff'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {publicRoutes.map((route,index) => {
            
            const Layout = route.layout === null ? Fragment : DefaultLayout;
            // const Layout = route.layout === null ? Fragment : Staff;
            const Page = route.component;
            return (<Route key={index} path={route.path} element ={
                    <Layout>
                      <Page/>
                    </Layout>} 
                   />);
          })}
          {privateRoutes.map((route, index) => {
            const Page = route.component
            const Layout = route.layout === null ? Fragment : DefaultLayout;
            // const Layout = route.layout === null ? Fragment : Staff;
            return (<Route key={index} path={route.path} element ={
              <Layout>
                <Page/>
              </Layout>} 
             />);
          })}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
