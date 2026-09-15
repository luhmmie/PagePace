import {createBrowserRouter} from 'react-router';
import RootLayout from "../layouts/RootLayout.jsx";
import Login from "../Pages/Login.jsx";
import Dashboard from "../Pages/Dashboard.jsx";
import Course from  "../Pages/Course.jsx";
import Settings from "../Pages/Settings.jsx";
import Reminder from '../Pages/Reminder.jsx';
import AddCourse from '../Pages/AddCourse.jsx';
import NotFound from '../Pages/NotFound.jsx';
import SignUp from "../Pages/SignUp.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import Calendar from "../Pages/Calendar.jsx"
import AllCourses from "../Pages/AllCourses.jsx"
const router = createBrowserRouter([
    {
        path:"/",
        element:<Login/>,
    },

    {
        path:"/signup",
        element:<SignUp/>,
    },
    {
        path:'/dashboard',
        element:<ProtectedRoute/>,
        children:[
            {
                element:<RootLayout/>,
                children:[
                     {
                index:true,
                element:<Dashboard/>
            },
            {
             path: 'courses',
                 element: <AllCourses/>
                },
            {
                path:'settings',
                element:<Settings/>
            },
            {
                path:'reminders',
                element:<Reminder/>
            },
            {
                path:'add-course',
                element:<AddCourse/>
            },
                {
                    path:'calendar',
                    element:<Calendar/>
                },
                {
                    path: 'courses/:id',
                    element: <Course/>
                    },
                  
                ]
            },
           
           
        ]
    },
     {
                path:'*',
                element:<NotFound/>
            }
])
export default router;