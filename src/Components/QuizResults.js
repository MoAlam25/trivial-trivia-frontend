import React, { useContext, useEffect, useState } from 'react'
import { Context } from './Context'
import { Link, Navigate } from 'react-router-dom'
import '../styles/QuizResults.css'
import axios from 'axios'

export default function QuizResults(props) {
    const { correctAnswersCount, numberOfQuizQuestions, selectedCategoryNumber, userName, quizJSON, answersTracker, reassignUserInfo } = useContext(Context);
    const [displayResults, setDisplayResults] = useState(false)
    console.log(selectedCategoryNumber)
    console.log(quizJSON);
    const [displayResultsText, setDisplayResultsText] = useState("View quiz results details");

    const sendQuizScore = async (quizRecord) => {
        const res = await axios.post(`https://trivial-trivia-backend.herokuapp.com/quizscore`, quizRecord)
    }

    const updateBestCategoryAndScore = async (userName, categoryText, quizRecord) =>{
        const res = await axios.get(`https://trivial-trivia-backend.herokuapp.com/user/${userName}`);
        if(res.data.bestScore <= quizRecord.score){
            const newUserInfo = {
                userName : userName,
                bestCategory : categoryText,
                bestScore : quizRecord.score
            }
            console.log(newUserInfo)
            const res = await axios.put(`https://trivial-trivia-backend.herokuapp.com/user/updateUserInfo`, newUserInfo);
            console.log(res)
            reassignUserInfo(res.data.newData)
        }
    }

    useEffect(()=>{
        document.title = "Quiz Results - Trivial Trivia"
        let categoryText = "No test taken yet"

        switch(selectedCategoryNumber) {
            case '9': 
                categoryText = "General Knowledge"
                break;
            case '18':
                categoryText = "Science: Computer"
                break;
            case '23':
                categoryText = "History"
                break;
            case '20':
                categoryText = "Mythology"
                break;
            case '27':
                categoryText = "Animals"
                break;
            case '26':
                categoryText = "Celebrities"
                break;
            case '15':
                categoryText = "Entertainment: Video Games";
                break;
            case 'TTP':
                categoryText = "TTP"
                break;
            default:
                break;
        }

        let today = new Date(),
        date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        const quizRecord = {
            category : categoryText,
            score : correctAnswersCount,
            QuizDate : date,
            userUserName : userName
        }
        
        sendQuizScore(quizRecord)

        updateBestCategoryAndScore(userName, categoryText, quizRecord)

    },[])

    const toggleResultsDisplay = () => {
        if (displayResultsText == "View quiz results details") {
            setDisplayResults(true);
            setDisplayResultsText("Hide quiz results details");
        } else {
            setDisplayResults(false);
            setDisplayResultsText("View quiz results details");
        }
    }

    const unRegify = (string) => {
        return string.replaceAll("&#039;", "'").replaceAll("&quot;", '"').replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&oacute;", "ó").replaceAll("&amp;", "&").replaceAll("&aring;", "ö").replaceAll("&auml;", "ä").replaceAll("&ouml;", "ö").replaceAll("&rsquo;", "’").replaceAll("&iacute;", "í").replaceAll("&aacute;", "á").replaceAll("&Uuml;", "Ü")
    }
    // .replaceAll("&#039;", "'").replaceAll("&quot;", '"').replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&oacute;", "ó")
    return (
        <div className="quiz-results-main">
            <h1 className="quiz-results-header">Quiz Results</h1>
            <h3 className="total-points-header">Total Points</h3>
            <h5 className="results-text">{correctAnswersCount}/{numberOfQuizQuestions}</h5>
            <div>
                <button className="link-button button"><Link to="/Category">Take Another Quiz</Link></button>
                <button className="link-button button"><Link to="/Leaderboard">View Leaderboard</Link></button>
            </div>
            <button className="button" onClick={toggleResultsDisplay}>{displayResultsText}</button>
            {displayResults && quizJSON.map((quizObj, index) => {
                return (
                    <div className="quiz-recap">
                        <h1>{index + 1}. {unRegify(quizObj.question)}</h1>
                        <ol>
                            <li className="quiz-recap-answer">{unRegify(quizObj.correct_answer)}</li>
                            {quizObj.incorrect_answers.map((incorrect_answer) => {
                                return <li className="quiz-recap-answer">{unRegify(incorrect_answer)}</li>
                            })}
                        </ol>
                        <h4 className="user-answer">Your answer: <span className="user-answer-displayed">{unRegify(answersTracker[index])}</span></h4>
                        <h4 className="correct-answer">Correct answer: <span className="correct-answer-displayed">{unRegify(quizObj.correct_answer)}</span></h4>
                    </div>
                )
            })}
        </div>
    )
}