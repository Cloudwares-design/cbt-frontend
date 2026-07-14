import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../services/api";
import StudentLayout from "../../components/student/StudentLayout";
import { MathJax } from "better-react-mathjax";


export default function StudentResult() {

  const { examId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {

    const fetchResult = async () => {

      try {

        const res = await API.get(
          `/exams/result-details/${examId}`
        );

        setData(res.data);

      } catch (err) {

        console.error(
          "Result error:",
          err
        );

      } finally {

        setLoading(false);

      }

    };


    fetchResult();

  }, [examId]);



  if (loading) {

    return (
      <h2 style={styles.loading}>
        Loading result...
      </h2>
    );

  }



  if (!data) {

    return (
      <h2>
        No result found
      </h2>
    );

  }



  const result = data.result;
  const exam = data.exam;
  const questions = data.questions || [];



  const percent =
    result.total > 0
      ? Math.round(
          (result.score / result.total) * 100
        )
      : 0;



  const passed = percent >= 50;



  return (

    <StudentLayout>


      <div style={styles.page}>


        <div style={styles.card}>


          <h2>
            {exam.title}
          </h2>


          <h3 style={{color:"#6b7280"}}>
            Exam Result
          </h3>



          <div style={styles.scoreBox}>


            <h1>
              {result.score} / {result.total}
            </h1>


            <p>
              {percent}%
            </p>


          </div>




          <div
            style={{
              ...styles.status,
              background: passed
                ? "#16a34a"
                : "#dc2626"
            }}
          >

            {
              passed
              ? "PASSED "
              : "FAILED "
            }

          </div>





          <p style={styles.date}>

            Submitted:
            {" "}
            {
              new Date(
                result.submitted_at
              ).toLocaleString()
            }

          </p>





          {
            exam.show_answers ? (


              <div
                style={{
                  marginTop:30,
                  textAlign:"left"
                }}
              >


                <h3>
                  Question Review
                </h3>




                {
                  questions.length === 0 ? (

                    <p>
                      No questions available.
                    </p>

                  ) : (


                    questions.map(
                      (q,index)=>{


                        const options = {

                          A:q.option_a,
                          B:q.option_b,
                          C:q.option_c,
                          D:q.option_d,

                        };



                        const isCorrect =
                          q.correct_option &&
                          q.selected_option === q.correct_option;



                        return (

                          <div
                            key={q.id}
                            style={{
                              marginTop:25,
                              padding:20,
                              border:"1px solid #ddd",
                              borderRadius:10
                            }}
                          >



                            <h4>
                              Question {index + 1}
                            </h4>




                            <MathJax dynamic>

                              {
                                q.question || ""
                              }

                            </MathJax>





                            <p>
  <b>Your Answer:</b>{" "}

  {q.selected_option ? (
    <span
      style={{
        color: isCorrect ? "#15803d" : "#dc2626",
        fontWeight: "bold",
      }}
    >
      <MathJax dynamic>
        {`${q.selected_option}. ${options[q.selected_option] || ""}`}
      </MathJax>
    </span>
  ) : (
    <span style={{ color: "#6b7280" }}>
      No Answer
    </span>
  )}
</p>

{/* Correct Answer */}
{
  q.correct_option && (
    <p style={{ marginTop: 10 }}>
      <b>Correct Answer:</b>{" "}
      <span
        style={{
          color: "#15803d",
          fontWeight: "bold",
        }}
      >
        <MathJax dynamic>
          {`${q.correct_option}. ${options[q.correct_option] || ""}`}
        </MathJax>
      </span>
    </p>
  )
}

{
  exam.show_explanations &&
  q.explanation && (
    <div
      style={{
        marginTop: 15,
        padding: 15,
        background: "#f8fafc",
        borderRadius: 8,
      }}
    >
      <b>Explanation</b>

      <MathJax dynamic>
        {q.explanation}
      </MathJax>
    </div>
  )
}			



                           



                          </div>

                        );


                      }

                    )


                  )

                }



              </div>



            ) : (



              <div
                style={{
                  marginTop:30,
                  padding:20,
                  background:"#FEF3C7",
                  borderRadius:10
                }}
              >

                The administrator has disabled answer review for this exam.

              </div>


            )

          }







          <button

            onClick={() =>
              navigate("/student/dashboard")
            }

            style={styles.btn}

          >

            Back to Dashboard


          </button>




        </div>


      </div>



    </StudentLayout>


  );

}







const styles = {


  page:{

    minHeight:"100vh",

    display:"flex",

    justifyContent:"center",

    alignItems:"center",

    background:"#f8fafc",

    fontFamily:"Arial",

    padding:"20px"

  },



  card:{

    width:"100%",

    maxWidth:"900px",

    background:"white",

    padding:"25px",

    borderRadius:"12px",

    textAlign:"center",

    boxShadow:"0 2px 15px rgba(0,0,0,0.1)"

  },



  scoreBox:{

    margin:"20px 0"

  },



  status:{

    padding:"10px",

    color:"white",

    fontWeight:"bold",

    borderRadius:"6px",

    marginBottom:"15px"

  },



  date:{

    fontSize:"14px",

    color:"gray",

    marginBottom:"20px"

  },



  btn:{

    padding:"10px 15px",

    background:"#2563eb",

    color:"white",

    border:"none",

    borderRadius:"6px",

    cursor:"pointer"

  },



  loading:{

    textAlign:"center",

    marginTop:"50px"

  }


};
