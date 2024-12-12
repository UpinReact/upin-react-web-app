'use client'
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid
import { useEffect, useState } from 'react';
import { ColDef } from 'ag-grid-community';

export default function Grid() {
    // Row Data: The data to be displayed.
    const [rowData, setRowData] = useState([
      { communityName: "Community A", activePin: "yes", isThisPrivate: "Yes" },
      { communityName: "Community B", activePin: "no", isThisPrivate: "No" },
      { communityName: "Community C", activePin: "yes", isThisPrivate: "Yes" },
    ]);
    
    // Column Definitions: Defines the columns to be displayed.
    const [colDefs, setColDefs] = useState<ColDef<{ communityName: string; activePin: string; isThisPrivate: string;  }>[]>(
      [
        { field: "communityName" },
        { field: "activePin"},
        { field: "isThisPrivate" },
      ]
    );
   
      return (
          <div className="ag-theme-quartz" style={{ height: 400, width: 700 }}>
              <AgGridReact
                  rowData={rowData}
                  columnDefs={colDefs} 
                  pagination={true}
                  paginationPageSize={10}
                  domLayout='autoHeight'
                  rowSelection='single'
                  /> 
             
          </div>
      );
  }