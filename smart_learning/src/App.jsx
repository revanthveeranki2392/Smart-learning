import "./App.css";
import {createBrowserRouter,RouterProvider} from "react-router-dom";
import RootLayout from "./RootLayout";
import Home from "./components/home/Home";
import Login from "./components/login/Login";
import Signup from "./components/signup/Signup";
import About from "./components/about/About"
import RoutingError from "./components/RoutingError";
import Forgotten from "./components/forgotpassword/Forgotten";
import WebHome from "./components/webpage2/userhome/WebHome"
import TechNews from "./components/webpage2/usertechnews/TechNews";
import UserLearn from "./components/webpage2/userlearn/UserLearning";
import AdminsHome from "./components/admin/adminhome/AdminsHome";
import Assignments from "./components/webpage2/userassignments/Assignments"
import Admintest from "./components/admin/adminassignments/Admintest";
import AdminAddSkill from "./components/admin/adminskill/AdminAddSkill";
import TestPage from "./components/webpage2/userassignments/TestPage";
import AdminLearn from "./components/admin/adminlearn/AdminLearn";
import AdminJobRoles from "./components/admin/adminjobroles/AdminJobRoles";
function App()
{
  const browserRouter = createBrowserRouter([
      {
        path: "",
        element:<RootLayout />,
        errorElement:<RoutingError />,
        children: [
          {
            path: "home",
            element:<Home />,
          },
          {
            path: "",
            element:<Home />,
          },
          {
            path: "login",
            element: <Login />
          },
          {
            path: "signup",
            element:<Signup />
          },
          {
            path: "about",
            element:<About />
          },
          {
            path: "forgot-password",
            element:<Forgotten />
          },
          {
            path: "webhome",
            element:<WebHome />
          },
          {
            path: "technews",
            element:<TechNews />,
          },
          {
            path: "userlearn",
            element:<UserLearn></UserLearn>,
          }
          ,
          {
            path: "adminhome",
            element:<AdminsHome />,
          }
          ,
          {
            path: "admintest",
            element:<Admintest />,
          }
          ,
          {
            path: "adminskills",
            element:<AdminAddSkill />,
          }
          ,
          {
            path: "assignments",
            element:<Assignments />,
          },
          {
            path: "test",
            element:<TestPage />,
          }
          ,
          {
            path: "adminlearn",
            element:<AdminLearn />,
          }
          ,
          {
            path: "adminjobrole",
            element:<AdminJobRoles />,
          }
        ]
      }
    ]);
  return (
    <div className="main">
      <RouterProvider router={browserRouter} />
    </div>
  );
}
export default App;