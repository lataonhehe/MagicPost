import { Fragment, createContext, useState } from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { publicRoutes,privateRoutes } from './routes';
import Protected from './routes/protected';   
import DefaultLayout from './components/Layout/HeaderOnly';

export const LayoutContext = createContext(); 
function App() {
  const role = JSON.parse(localStorage.getItem("role"));
  const department = JSON.parse(localStorage.getItem("department"));
  const [isLogged, setIsLogged] = useState(localStorage.getItem("isLogged")); 

  return (
    <LayoutContext.Provider value={setIsLogged}>
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
                <Protected role ={role.role} department={department.department} path={route.path} >
                  <Layout>
                    <Page/>
                  </Layout>
                </Protected>
                } 
               />);
            }))}
          </Routes>
        </div>
      </Router>
    </LayoutContext.Provider >
  );
}

export default App;
