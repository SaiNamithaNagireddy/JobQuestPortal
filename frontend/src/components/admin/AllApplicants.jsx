import React, { useEffect } from 'react';

const AllApplicants = ({ getdata }) => {
  useEffect(() => {
    if (typeof getdata === 'function') {
      getdata(); // Call getdata function
    }
  }, [getdata]); // Add getdata to the dependency array if it's a function from props

  return (
    <div>
      All Applicants
    </div>
  );
}

export default AllApplicants;
