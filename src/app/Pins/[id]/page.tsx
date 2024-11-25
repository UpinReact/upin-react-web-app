'use client';
import { useRouter } from 'next/compat/router'

import React from 'react';

function PinPage() {
  const router = useRouter();
  console.log(router?.query.id)
  // const { id } = router.query; // Extracting the id from the URL parameters

  // if (!id) {
  //   return <div>No ID found</div>;
  // }

  return (
    <div>
      <p>Pin ID:</p> {/* Display the pin ID */}
    </div>
  );
}

export default PinPage;
