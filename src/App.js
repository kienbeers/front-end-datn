import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { publicRoutes } from "./routes/route";
import DefaultLayout from "./components/layout/DefaultLayout/index";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "antd/dist/antd.min.css";
import { Fragment } from "react";
import AppUser from "./pages/customer/AppUser";
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {publicRoutes.map((route, index) => {
            const Layout = route.Layout === null ? Fragment : DefaultLayout;
            const LayoutCustomer = route.Layout === null ? Fragment : AppUser;
            const Page = route.component;
            if (route.path.includes("/admin")) {
              return (
                <Route
                  key={index}
                  path={route.path}
                  element={
                    <Layout>
                      <Page />
                    </Layout>
                  }
                />
              );
            } else {
              return (
                <Route
                  key={index}
                  path={route.path}
                  element={
                    <LayoutCustomer>
                      <Page />
                    </LayoutCustomer>
                  }
                />
              );
            }
          })}
        </Routes>
      </div>
    </Router>
  );
}
export default App;
