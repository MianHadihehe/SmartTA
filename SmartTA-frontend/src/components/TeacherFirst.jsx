import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styling/teachefirst.css'; 
import walkingRobo from '../assets/walking-robo.gif';
import loadingSpinner from '../assets/loading-spinner.gif'; 
import MessageBox from './MessageBox';
import { useEffect } from 'react';


const TeacherFirst = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { username } = location.state || {};
    const [assignments, setAssignments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [method, setMethod] = useState('');
    const [messageBoxVisible, setMessageBoxVisible] = useState(false);
    const [messageBoxContent, setMessageBoxContent] = useState('');  
    const [selectedAssignmentNumber, setselectedAssignmentNumber] = useState('');
    const [selectedAssignemntText, setselectedAssignemntText] = useState('');
    const [selectedAssignemntSolution, setselectedAssignemntSolution] = useState('');

    useEffect(()=>{
        fetchAssignments();
    },[]);

    const fetchAssignments = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:8080/api/save-assignment');
            
            if (!response.ok) {
                throw new Error('Failed to fetch');
            }
            const data = await response.json();
            setAssignments(data); 
        } catch (error) {
            showMessage(`❌ Error fetching assignments: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    console.log(assignments);
    
    useEffect(() => {
        fetchAssignments();
    }, []);
    
    
    const handleLogout = () => {
        navigate('/');
    };

    const selectMethod = (chosenMethod) => {
        setMethod(chosenMethod);
    };

    const showMessage = (message) => {
        setMessageBoxContent(message);
        setMessageBoxVisible(true);
        setTimeout(() => {
          setMessageBoxVisible(false);  // Automatically hide the message after 5 seconds
        }, 5000);
      };

    const handleNext = () =>{
        if(method===''){
            showMessage('❌ Please select any one method!');
            return;
        }
        if(method==='select'&& (!selectedAssignmentNumber || !selectedAssignemntText)){
            showMessage('❌ Assignment not selected from the dropdown menu!');
            return;
        }
        if(method==='upload'){
            navigate('/submit-question', { state: { username } });
        }
        else if(method==='select'){
            navigate('/teacher-home', { state: { username, assignmentNumber: selectedAssignmentNumber, uploadedData: selectedAssignemntText, modelSolution: selectedAssignemntSolution  } });
        }
    }

    console.log(selectedAssignmentNumber, selectedAssignemntText);

    const handleSelectChange = (event) => {
        const selectedOption = event.target.options[event.target.selectedIndex];
        const assignmentNumber = selectedOption.value;
        const assignmentText = selectedOption.getAttribute('data-text');
        const modelSolution = selectedOption.getAttribute('model-solution');
    
        setselectedAssignmentNumber(assignmentNumber);
        setselectedAssignemntText(assignmentText);
        setselectedAssignemntSolution(modelSolution);
    };

    // useEffect(() => {
    //     console.log(assignments.map(assignment => assignment._id)); // Check for uniqueness
    // }, [assignments]);
    
    

    return (
        <div className={`main-teacher-home`}> {/* Add a class for loading state */}
          <div className="teacher-lo-btn-cont">
            <button 
              className='teacher-lo-btn' 
              onClick={handleLogout} 
              disabled={isLoading} 
            >
              Logout
            </button>
          </div>
          <div className="logo"> 
            Smart<span style={{ color: "rgb(234,67,89)" }}>TA</span>
          </div>
          <div className="msg-robo-cont">
            <div className="welcome-msg"> 
                Prof {username}, please upload or select
            </div>
    
            <div className="walking-robo">
              <img className='walkingroboicon' src={walkingRobo} alt="" />
            </div>
          </div>

          {isLoading && (
        <div className="loading-indicator">
          <img src={loadingSpinner} alt="Loading..." />
          Loading...
        </div>
      )}

          {messageBoxVisible && <MessageBox message={messageBoxContent} />}

          <div 
            className={`upload ${method === 'upload' ? 'selected' : ''}`}
            onClick={() => selectMethod('upload')}
          >
            Upload New Question Paper
          </div>

          <div 
            className={`select ${method === 'select' ? 'selected' : ''}`}
            onClick={() => selectMethod('select')}
          >
            Select from Saved Question Papers

            {method === 'select' && 
            <div className='uploaded-assignments'>
            <select onChange={handleSelectChange}>
                <option value="">
                Select an Assignment
                </option>
                {assignments.map((assignment) => (
                    <option key={assignment._id} value={assignment.assignmentNumber} data-text={assignment.questionPaper} model-solution={assignment.modelSolution}>
                        Assignment #{assignment.assignmentNumber}
                    </option>
                ))}
            </select>
        </div>
    }
          </div>


          <div className='button-div'><button className='btn-next' disabled={isLoading} onClick={handleNext}>Next</button></div>
          
         
        </div>
      );
    };

export default TeacherFirst;