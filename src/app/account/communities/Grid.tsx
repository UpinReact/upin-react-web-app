'use client';
import { AgGridReact } from 'ag-grid-react';
import { useEffect, useState } from 'react';
import { ColDef } from 'ag-grid-community';
import supabase from 'utils/supabase/supabase';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useRouter } from 'next/navigation'; // Import useRouter for navigation

export default function Grid() {
  const [rowData, setRowData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // Get the router instance

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const { data, error } = await supabase.from('communities').select('*').limit(20);
        if (error) throw error;

        const formattedData = data.map((community: any) => ({
          communityName: community.community_name || 'N/A',
          communityDescription: community.community_description || 'No description',
          communityId: community.id || '', // Add communityId to the data
        }));

        setRowData(formattedData);
      } catch (error) {
        console.error('Error fetching communities:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunities();
  }, []);

  const colDefs: ColDef[] = [
    {
      headerName: 'Name',
      field: 'communityName',
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 150,
      cellRenderer: (params: any) => (
        <button
          onClick={() => router.push(`./communities/${params.data.communityId}`)} // Navigate on click
          className="text-blue-600 hover:underline"
        >
          {params.value}
        </button>
      ),
    },
    {
      headerName: 'Description',
      field: 'communityDescription',
      sortable: true,
      filter: true,
      flex: 2,
      minWidth: 250,
      cellStyle: { whiteSpace: 'normal', overflow: 'hidden', textOverflow: 'ellipsis' },
    },
  ];

  return (
    <div className="h-auto p-4 phone:p-6">
      <div className="mx-auto max-w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-3 border-b border-gray-100 bg-gray-50">
          <h1 className="text-xl phone:text-lg font-semibold text-gray-800"> 🌍 Community List </h1>
        </div>

        <div className="p-4 phone:p-3">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-3 text-sm font-medium text-gray-600">Loading...</span>
            </div>
          ) : (
            <div className="ag-theme-alpine" style={{ height: '400px', width: '100%' }}>
              <AgGridReact
                rowData={rowData}
                columnDefs={colDefs}
                pagination={true}
                paginationPageSize={10}
                headerHeight={35}
                rowHeight={35}
                suppressCellFocus={true}
                defaultColDef={{
                  resizable: true,
                  sortable: true,
                  filter: true,
                  wrapText: true,
                  autoHeight: true,
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
