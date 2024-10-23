import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import StaffLogin from './components/staffLogin';
import AdminDashboard from './components/AdminDashboard';
import BookSearch from './components/BookSearch';
import Home from './components/Home';
import Navbar from './components/MainHome/Navbar';
import Info from './components/Info';
import IssueBooks from './components/Issue/IssueBooks';
import Reports from './components/AdminMain/Reports';
// import BookDetails from './components/Books/BookDetails';
// import StudentDetails from './components/Students/StudentDetails';
import Student from './components/Students/Student';
import AddBooks from './components/Books/AddBooks';
import AddStudent from './components/Students/AddStudent';
import Book from './components/Books/Book';
import UpdateDetails from './components/Books/updateDetails';
import UpdateStudentDetails from './components/Students/updateDetails';
import IssuedBooks from './components/Issue/IssuedBooks';
import StudentBookHistory from './components/StudentBookHistory';
import AddAdmin from './components/Admin/Addadmin';
import StudentLogin from './components/StudentLogin/studentLogin';
import StudentDashboard from './components/StudentLogin/studentDashboard';
import StudentDetails from './components/Students/studentDetails';
import PostMessage from './components/Admin/PostMessage';
import FeePayment from './components/Admin/FeePayment';
import MainHome from './components/MainHome/Home';
import CreateLibrary from './components/createLibrary/createLibrary';
import AdminLoginMain from './components/adminmainlogin';
import AdminMainHome from './components/AdminMain/AdminMainHome';
import AddAdminMain from './components/AdminMain/AddAdminMain';
import ShowLibraries from './components/AdminMain/ShowLibraries';
import AddHead from './components/AdminMain/AddHead';
import BookSearchAll from './components/BookSearchAll';
import StaffMessage from './components/Admin/StaffMessage';
import OrderBook from './components/Admin/Orderbook';
// import SendOverdueEmailsButton from './components/SendOverdueEmailsButton';

const App = () => {
  const[key,setKey]=useState("");
  const [books, setBooks] = useState([]);
  const [data, setData] = useState();
  const [studentdata, setStudentdata] = useState();
  const[student,setdetails]=useState(null);
  const[studnetlogin,setstudentlogin]=useState(false);
  const[studentdatatoadmin,setstudentdatatoadmin]=useState(null);
  return (
    <Router>
      <div>
      <Navbar studnetlogin={studnetlogin} setstudentlogin={setstudentlogin} />
        <Routes>
        <Route exact path="/" element={<MainHome />} />
          <Route exact path="/adminlogin" element={<StaffLogin setKey={setKey}/>} />
          <Route path="/dashboard" element={<AdminDashboard  key={key}/>}> 
              <Route path="addadmin" element={<AddAdmin/>} />
              <Route path="issuebooks" element={<IssueBooks />} />
              <Route path="studentdetails" element={<Student setstudentdata={setStudentdata} setstudentdatatoadmin={setstudentdatatoadmin}  />} />
              <Route path="addbook" element={<AddBooks />} />
              <Route path="addstudent" element={<AddStudent />} />
              <Route path="bookdetails" element={<Book books={books} setBooks={setBooks} setData={setData} />} />
              <Route path="updateDetails" element={<UpdateDetails data={data} />} />
              <Route path="updateStudentDetails" element={<UpdateStudentDetails studentdata={studentdata} />} />
              <Route path="issuedbooks" element={<IssuedBooks/>} />
              <Route path="feepayment" element={<FeePayment/>} />
              <Route path='showStudentDetail' element={<StudentDetails student={studentdatatoadmin} ></StudentDetails>}></Route>
              <Route path="staffMessage" element={<StaffMessage/>} />
              <Route path="orderbook" element={<OrderBook/>} />

              {/* <Route path="overdue" element={<SendOverdueEmailsButton/>} /> */}
          </Route>
          <Route path='/adminmainhome' element={<AdminMainHome></AdminMainHome>} >
                  <Route path="addlibrary" element={<CreateLibrary />} /> 
                  <Route path="addadmin" element={<AddAdminMain />} />
                  <Route path="" element={<ShowLibraries />} />
                  <Route path="addhead" element={<AddHead />} />
                  <Route path="postmessage" element={<PostMessage/>} />
                  <Route path="show-reports" element={<Reports/>} />


                    
          </Route>
          <Route path="/booksearch" element={<BookSearch/>} />
          <Route path="/studentbookhistory" element={<StudentBookHistory/>} />
          <Route path="/info" element={<Info />} />
          <Route path='/studentLogin' element={<StudentLogin setdetails={setdetails} setstudentlogin={setstudentlogin}></StudentLogin>}></Route>
          <Route path='/studentDashboard' element={<StudentDashboard student={student} ></StudentDashboard>}></Route>
          <Route path="/booksearchall" element={<BookSearchAll/>} />
          <Route path="/adminmainlogin" element={<AdminLoginMain />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
