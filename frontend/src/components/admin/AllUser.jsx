import { message } from 'antd'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';

const AllUser = () => {
   const [userList, setUserList] = useState([])
   const getAllUser = async () => {
      try {
         const res = await axios.get("http://localhost:8001/api/admin/getalluserdata", {
            headers: { Authorization: "Bearer " + localStorage.getItem('token') },
         })
         if(res.data.success){
           setUserList(res.data.data)
          //console.log(res.data.data)
         }
      } catch (error) {
         console.log(error)
         message.error('Something went wrong')
      }
   }

   useEffect(()=>{
      getAllUser()
   },[])
   return (
      <div>
         <MDBTable striped>
            <MDBTableHead>
               <tr>
                  <th scope='col'>User ID</th>
                  <th scope='col'>User Name</th>
                  <th scope='col'>User Email</th>
                  <th scope='col'>Type</th>
                  <th scope='col'>Is Recruiter</th>
               </tr>
            </MDBTableHead>
            <MDBTableBody>
               {userList.map((data, index) => {
                  console.log(data.isRecruiter)
                  return (
                     <tr key={index}>
                        <th scope='row'>{data._id}</th>
                        <td>{data.firstname +" "+ data.lastname}</td>
                        <td>{data.email}</td>
                        <td>{data.type}</td>
                        <td><td>{data.isRecruiter ? "yes" : "no"}</td></td>
                     </tr>
                  )
               })}
            </MDBTableBody>
         </MDBTable>
         <p>There are {userList.length} Users in the App.</p>
      </div>
   )
}

export default AllUser
