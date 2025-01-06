import { FaCircleArrowRight } from "react-icons/fa6";
import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";

import { UserLoginInfo } from "../../App";
import axios from "../../axiosConfig";

import userAvatar from "../../assets/icons/user-avatar.svg";
import "./Answer.css";
import Swal from "sweetalert2";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { Button, Dialog, DialogActions, DialogContent,DialogContentText, DialogTitle, TextField } from "@mui/material";



function Answer() {

  
  //comment dialog box 
  const [open, setOpen] = useState(false);
  const [answerKey, setAnswerKey]=useState("");
  const [dialogAnswer, setDialogAnswer]=useState("");
  const [inputValue, setInputValue] = useState("");
  const [dialogText, setDialogText] = useState("");
  const [answerAdd, setAnswerAdd] = useState(""); 
  const { questionID } = useParams();
  const { user } = useContext(UserLoginInfo);
  
  const [loading, setLoading] = useState(false);
  const [answerText, setAnswerText] = useState(""); // State for textarea value
  const [editAnswerTxt, seteditAnswerTxt]= useState("");
  const [questionDetils, setQuestionDetils] = useState({
    title: "",
    description: "",
    answers: [],
  });
  const [delopen, setDelOpen] = useState(false);
  const [deletedmsg, setDeletedmsg] = useState("");
  const [deletedId, setDeletedId] = useState("");

  // comment pagnation 

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of answers per page

  const totalAnswers = questionDetils.answers.length;
  const totalPages = Math.ceil(totalAnswers / itemsPerPage);

  const currentAnswers = questionDetils.answers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };


//  comment: function to edition dialogbox

 const handleOpen = (answerId, answertext) => {
    setOpen(true);
    console.log(answertext)
    setDialogText(answertext);
    setAnswerKey(answerId);
    setDialogAnswer(answertext)
  }
    
  const handleClose = () => setOpen(false);
 
  const  handleSubmit = async(answerid, answerTxt)=> {
    console.log("Input Value:", answerid, answerTxt);
    setOpen(false) 
    setLoading(true);
    // e.preventDefault();
    if (!answerTxt)
      {
        
        await Swal.fire({
          title: "Error!",
          text: " The answer is not given!",
          icon: "error",
          confirmButtonText: "OK",
        });
        setLoading(false)
      }
      
      try {
        await axios.post("/answer/editanswer", {
          answerid: String(answerid),
          answer:editAnswerTxt // Send the current answer text
        });
        
        setLoading(false);
        
        await Swal.fire({
          title: "Success!",
          text: "Answer is successfully edit!",
          icon: "success",
          confirmButtonText: "OK",
        });
        setAnswerAdd((prev) => (prev === "add" ? "refresh" : "add"));
        // setAnswerText(""); // Clear the textarea after submission
      } catch (error) {
        console.error(error.response);
        await Swal.fire({
          title: "Error!",
          text: "Failed to edit your answer. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
      
      setAnswerAdd("add");
      
      setOpen(false);
    };
    // comment: for answer deletion 

    
    const handleDeleteOpen = (answerid, answerTxt) => {
      setDelOpen(true);
      setDeletedmsg(answerTxt)
      setDeletedId(answerid)
    };
  
    const handleDeleteClose = () => {
      setDelOpen(false);
    };
  
    const handleDeleteConfirm = async()=> {
      
      setDelOpen(false);
      setLoading(true);
      
        console.log(deletedId)
      try {
        await axios.delete(`/answer/deleteanswer`, {
          params: { answerid: deletedId }, // Pass data as query parameters
        });
          
        setAnswerAdd((prev) => (prev === "add" ? "refresh" : "add"));
        
       
        
        setLoading(false);
        
        await Swal.fire({
          title: "Success!",
          text: "Answer is deleted!",
          icon: "success",
          confirmButtonText: "OK",
        });
        setAnswerAdd((prev) => (prev === "add" ? "refresh" : "add"));
        // setAnswerText(""); // Clear the textarea after submission
      } catch (error) {
        console.error(error.response);
        await Swal.fire({
          title: "Error!",
          text: "Failed to edit your answer. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
      
      setAnswerAdd("add");
      
      
  
    };

    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];
      
  

  useEffect(() => {
    const fetchQuestionData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/question/getquestion/${questionID}`);
        setQuestionDetils(response.data);
      } catch (err) {
        console.error("Failed to post your answer. Please try again.", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionData();
  }, [questionID, answerAdd]);

  // Function to handle answer insertion
  async function hadleAnswerPost(e) {
    setLoading(true);
    e.preventDefault();
    if (!answerText)
    {

      await Swal.fire({
        title: "Error!",
        text: "Answer is not given!",
        icon: "error",
        confirmButtonText: "OK",
      });
      setLoading(false)
    }

    try {
      await axios.post("/answer/postanswer", {
        userid: String(user.userid),
        questionid: questionDetils.id,
        answer: answerText, // Send the current answer text
      });

      setLoading(false);

      await Swal.fire({
        title: "Success!",
        text: "Answer is successfully recorded!",
        icon: "success",
        confirmButtonText: "OK",
      });
      setAnswerAdd((prev) => (prev === "add" ? "refresh" : "add"));
      setAnswerText(""); // Clear the textarea after submission
    } catch (error) {
      console.error(error.response);
      await Swal.fire({
        title: "Error!",
        text: "Failed to post your answer. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }

    setAnswerAdd("add");
  }

  return (
    <div className="answer">
      <div className="answer--container">
        {/* Answer Header */}
        <div className="answer-header">
          <h1>Question</h1>
          <div className="answer-header-question">
            <div className="answer-header-question-title">
              <span>
                <FaCircleArrowRight size={20} />
              </span>
              <h4>{`Question Title: ${questionDetils.title}`}</h4>
            </div>
            <span className="answer-title-underline"></span>
            <div className="question_description2">
              <h3>Question Description:</h3>
              <span className="question_description">
                {questionDetils?.description || "No description available"}
              </span>
            </div>
            <span className="answer-header-question-date">
              {`Question created Date: ${formattedDate}`}
            </span>
          </div>
        </div>

        <hr />
        <h3>Answers From The Community</h3>
        <hr />
        {/* answer list */}
    {questionDetils.answers.length > 0 ? (
      currentAnswers.map((answer, index) => (
    <div className="content-container" key={index}>
      <img
        src={userAvatar}
        style={{ width: "30px", height: "30px" }}
        alt="user"
      />
      <span style={{ padding: '0px 10px' }} className="answer_list">{answer.username} :</span>
      {answer.username === user?.username ? (
        <>
          <span className="content-text">{answer.answer || "No text provided"}</span>
          <div className="action-buttons">
            <button
              className="edit-button"
              onClick={() => handleOpen(answer.answerid, answer.answer)}
            >
              <CiEdit size={20} /> Edit
            </button>
            <button
              className="delete-button"
              onClick={() => handleDeleteOpen(answer.answerid, answer.answer)}
            >
              <MdDeleteOutline size={20} /> Delete
            </button>
          </div>
        </>
      ): <span className="content-text"> {answer?.answer} </span>}
      <br />
    </div>
  ))
) : (
  <p>No answers available for this question.</p>
)}

{totalPages > 1 && (
  <div className="pagination-container">
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

       
        
      
        <form onSubmit={hadleAnswerPost} className="answer-content">
          <textarea
            name="answer_text_area"
            rows="6"
            cols="100"
            placeholder="Your answer ...."
            value={answerText} // Bind the state to the textarea value
            onChange={(e) => setAnswerText(e.target.value)} // Update state on change
          />
          <button type="submit">Post Answer</button>
        </form>
      </div>

      <div>
    
      <Dialog open={open} onClose={handleClose}  sx={{
          "& .MuiDialog-paper": {
            width: "800px", // Set width
            maxWidth: "1000px", // Maximum width
            height: "400px", // Set height
          },
        }}>
        <DialogTitle className="dialog-title">Edit the answer </DialogTitle>
        <DialogContent>
        <textarea
            autoFocus
            rows={5}
            style={{
              width: "100%", // Full width
              height:"250px", 
              fontSize: "16px", // Adjust font size
              padding: "10px", // Add padding
              borderRadius: "4px", // Rounded corners
              border: "1px solid #ccc", // Border style
              resize: "vertical", // Allow resizing vertically
            }}
            value={dialogText}
            onChange={(e) => {setDialogText(e.target.value)
              seteditAnswerTxt(e.target.value)
            }}
            
              
            
            placeholder="Type your answer here..."
          ></textarea>
         
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={()=>handleSubmit(answerKey, dialogAnswer)}>Edit</Button>
        </DialogActions>
      </Dialog>
    </div>




{/* critical deletion dialog box */}
<Dialog
          open={delopen} onClose={handleDeleteClose}  sx={{
          "& .MuiDialog-paper": {
            width: "650px", // Set width
            maxWidth: "600px", // Maximum width
            height: "280px", // Set height
          },
        }}>
      
        <DialogTitle className="critical-dialog-title">
          {"Are you sure you want to delete this answer?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="critical-dialog-description">
            {deletedmsg}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

    </div>

  );
}

export default Answer;
