'use client';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css'; // Required CSS
import { useEffect, useState } from 'react';
import { ColDef } from 'ag-grid-community';
import { supabase } from 'utils/supabase/supabase';

export default function Grid() {
  const [rowData, setRowData] = useState<any[]>([]); // Row data for the grid
  const [loading, setLoading] = useState(true); // Loading state for user feedback

  // Fetch communities from Supabase and format the data
  const fetchCommunities = async () => {
    try {
      const { data, error } = await supabase.from('communities').select('*').limit(20);
      if (error) throw error;

      const formattedData = data.map((community: any) => ({
        communityName: community.community_name || 'N/A',
        communityDescription: community.community_description || 'No description',
      }));

      setRowData(formattedData);
    } catch (error) {
      console.error('Error fetching communities:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchCommunities();
  }, []);

  // Column Definitions for the grid
  const colDefs: ColDef[] = [
    { headerName: 'Community Name', field: 'communityName', sortable: true, filter: true },
    { headerName: 'Community Description', field: 'communityDescription', sortable: true, filter: true },
  ];

  // Event handler to expand all rows after the grid is ready
  const onGridReady = (params: any) => {
    params.api.expandAll(); // Expands all rows
  };

  return (
    <div className="ag-grid-wrapper rounded-xl shadow-2xl bg-gradient-to-r from-indigo-500 to-purple-600">
      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <span className="text-xl font-bold text-white">Loading Communities...</span>
        </div>
      ) : (
        <div className="rounded-xl shadow-lg  bg-white p-4">
          <AgGridReact
            rowData={rowData}
            columnDefs={colDefs}
            pagination={true}
            paginationPageSize={20}
            domLayout="autoHeight"
            rowSelection="single"
            onGridReady={onGridReady} // Add the onGridReady handler here
            className="ag-theme-modern"
          />
        </div>
      )}
    </div>
  );
}
