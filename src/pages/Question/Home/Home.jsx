

import  { useContext, useEffect, useState } from "react";
import classes from "./Home.module.css";
import { UserLoginInfo } from "../../../App"; 
import thumnail from "../../../assets/images/thumnail2.jpg";
import { Link } from "react-router-dom";
import axios from "../../../axiosConfig";
import { useNavigate } from "react-router-dom";


function Home() {
  const { user } = useContext(UserLoginInfo);
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State to hold search input

  const filteredQuestions = questions.filter((question) =>
    question.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // comment pagnation 

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of answers per page

  const totalAnswers = filteredQuestions.length;
  const totalPages = Math.ceil(totalAnswers / itemsPerPage);

  const currentAnswers = filteredQuestions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };


  const clickHandler = () => {
    navigate("/question");
  };

  const getQuestions = async () => {
    try {
      const questionData = await axios.get("/question/allquestion").then((res) => res.data);
      setQuestions(questionData.allquestions);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getQuestions();
  }, []);

  // Filtered questions based on searchTerm
  

  return (
    <div id="root">
      <div className={classes.container}>
        {/* Header Section */}
        <header className={classes.header}>
          <button className={classes.ask_btn} onClick={clickHandler}>
            Ask Question
          </button>
          <div>
            <span className={classes.welcome_text}>Welcome:</span>{" "}
            <span className={classes.username}>{user.username}</span>
          </div>
        </header>

        {/* Search Section */}
        <section className={classes.search_container}>
          <input
            type="text"
            placeholder="Search question"
            className={classes.search_bar}
            value={searchTerm} // Bind input value to searchTerm
            onChange={(e) => setSearchTerm(e.target.value)} // Update searchTerm on input change
          />
        </section>

        <h2 style={{ color: "#0056b3", paddingLeft: "20px" }}> Questions</h2>
        <hr />

        {/* Question List Section */}
        <section className={classes.question_container}>
          {currentAnswers.map((question) => (
            <Link key={question.questionid} to={`/answer/${question.questionid}`} className={classes.link}>
              <article className={classes.question}>
                <div className={classes.avatar}>
                  <img
                    src={thumnail}
                    alt="User Avatar"
                    className={classes.thumbnail}
                    width="25"
                    height="25"
                  />
                </div>
                <div className={classes.question_content}>
                  <p className={classes.question_title}>{question.title}</p>
                  <p className={classes.user_name}>{question.username}</p>
                </div>
                <div className={classes.arrow_icon}>&gt;</div>
              </article>
              <hr />
            </Link>
          ))}
        </section>
   
      </div>


      {totalPages > 1 && (
        <div className={classes.pagination_container}>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={currentPage === i + 1 ? "active" : ""}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
          
        </div>
      )}

    </div>
  );
  
}

export default Home;
