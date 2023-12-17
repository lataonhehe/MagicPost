import { Fragment } from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { publicRoutes,privateRoutes } from './routes';   
import DefaultLayout from './components/Layout/HeaderOnly';
// import Staff from './components/Layout/Staff'

function App() {
  const username = JSON.parse(localStorage.getItem("username"));
  const role = JSON.parse(localStorage.getItem("role"));
  const department = JSON.parse(localStorage.getItem("department"));
  const isLogged = JSON.parse(localStorage.getItem("isLogged"));


  // function resetUser() {
    
  // }

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
          
          {isLogged && (privateRoutes.map((route, index) => {
            const Page = route.component
            let Layout = DefaultLayout;
            if (route.layout) {
              Layout = route.layout;
            } else if (route.layout === null) {
              Layout = Fragment;
            }
            // const Layout = route.layout === null ? Fragment : Staff;
            return (<Route key={index} path={route.path} element ={
              <Layout reset>
                <Page/>
              </Layout>} 
             />);
          }))}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
