import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import { message } from 'antd';

const FeedBack = () => {
  const [allFeedbacks, setFeedBacks] = useState([])

  const getAllFeedbacks = async () => {
    try {
      const res = await axios.get('http://localhost:8001/api/admin/allfeedbacks', {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      if (res.data.success) {
        setFeedBacks(res.data.data)
      }
    } catch (error) {
      console.log(error);
      message.error('Something went wrong');
    }
  }

  useEffect(() => {
    getAllFeedbacks()
  }, [])
  return (
    <div className='w-100'>
         <MDBTable striped>
            <MDBTableHead>
               <tr>
                  <th scope='col'>Name</th>
                  <th scope='col'>Email</th> 
                  <th scope='col'>Message</th>
               </tr>
            </MDBTableHead>
            <MDBTableBody>
               {allFeedbacks && allFeedbacks.map((feedback) => {
                  return (
                     <tr key={feedback._id}>
                        <td>{feedback.firstname + feedback.lastname}</td>
                        <td>{feedback.email}</td>
                        <td>{feedback.message}</td>
                     </tr>
                  );
               })}
            </MDBTableBody>
         </MDBTable>
         <p>You have {allFeedbacks.length} feedbacks in the app.</p>
      </div>
  )
}

export default FeedBack
