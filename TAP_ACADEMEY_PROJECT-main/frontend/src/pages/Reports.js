import { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Reports.css';

const Reports = () => {
  const API_URL = process.env.REACT_APP_API_URL || '/api';
  const { user } = useSelector((state) => state.auth);

  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    employeeId: ''
  });

  const [reportData, setReportData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getAuthHeader = () => ({
    headers: {
      Authorization: `Bearer ${user?.token}`,
    },
  });

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleGenerateReport = async () => {
    if (!filters.startDate || !filters.endDate) {
      toast.error('Please select start and end dates');
      return;
    }

    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await axios.get(`${API_URL}/attendance/all?${queryParams}`, getAuthHeader());
      setReportData(response.data.data);
      toast.success('Report generated successfully!');
    } catch (error) {
      toast.error('Failed to generate report');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportCSV = async () => {
    if (!filters.startDate || !filters.endDate) {
      toast.error('Please select start and end dates');
      return;
    }

    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await axios.get(`${API_URL}/attendance/export?${queryParams}`, {
        ...getAuthHeader(),
        responseType: 'blob'
      });

      // Create a blob from the response
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `attendance-report-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('Report exported successfully!');
    } catch (error) {
      toast.error('Failed to export report');
      console.error(error);
    }
  };

  const calculateTotals = () => {
    const totals = {
      present: 0,
      late: 0,
      absent: 0,
      halfDay: 0,
      totalHours: 0
    };

    reportData.forEach(record => {
      if (record.status === 'present') totals.present++;
      else if (record.status === 'late') totals.late++;
      else if (record.status === 'absent') totals.absent++;
      else if (record.status === 'half-day') totals.halfDay++;
      totals.totalHours += record.totalHours || 0;
    });

    return totals;
  };

  const totals = reportData.length > 0 ? calculateTotals() : null;

  return (
    <div className="reports-container">
      <h1 className="page-title">Attendance Reports</h1>

      {/* Report Configuration */}
      <div className="report-config-card">
        <h2>Generate Report</h2>
        <div className="config-grid">
          <div className="config-item">
            <label>Start Date: <span className="required">*</span></label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              required
            />
          </div>

          <div className="config-item">
            <label>End Date: <span className="required">*</span></label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              required
            />
          </div>

          <div className="config-item">
            <label>Employee ID (Optional):</label>
            <input
              type="text"
              name="employeeId"
              value={filters.employeeId}
              onChange={handleFilterChange}
              placeholder="e.g., EMP001"
            />
          </div>
        </div>

        <div className="action-buttons">
          <button 
            onClick={handleGenerateReport} 
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Generating...' : 'Generate Report'}
          </button>
          <button 
            onClick={handleExportCSV} 
            className="btn btn-success"
            disabled={isLoading}
          >
            Export to CSV
          </button>
        </div>
      </div>

      {/* Report Summary */}
      {totals && (
        <div className="report-summary-card">
          <h2>Report Summary</h2>
          <div className="summary-grid">
            <div className="summary-box green">
              <h3>Present</h3>
              <p className="summary-number">{totals.present}</p>
            </div>
            <div className="summary-box yellow">
              <h3>Late</h3>
              <p className="summary-number">{totals.late}</p>
            </div>
            <div className="summary-box red">
              <h3>Absent</h3>
              <p className="summary-number">{totals.absent}</p>
            </div>
            <div className="summary-box orange">
              <h3>Half Day</h3>
              <p className="summary-number">{totals.halfDay}</p>
            </div>
            <div className="summary-box blue">
              <h3>Total Hours</h3>
              <p className="summary-number">{totals.totalHours.toFixed(2)}</p>
            </div>
            <div className="summary-box purple">
              <h3>Total Records</h3>
              <p className="summary-number">{reportData.length}</p>
            </div>
          </div>
        </div>
      )}

      {/* Report Table */}
      {reportData.length > 0 && (
        <div className="report-table-card">
          <h2>Attendance Details</h2>
          <div className="table-wrapper">
            <table className="report-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Employee Name</th>
                  <th>Employee ID</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Total Hours</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map((record) => (
                  <tr key={record._id}>
                    <td>{new Date(record.date).toLocaleDateString()}</td>
                    <td>{record.userId?.name || 'N/A'}</td>
                    <td>{record.userId?.employeeId || 'N/A'}</td>
                    <td>{record.userId?.department || 'N/A'}</td>
                    <td>
                      <span className={`status-badge ${record.status}`}>
                        {record.status}
                      </span>
                    </td>
                    <td>
                      {record.checkInTime
                        ? new Date(record.checkInTime).toLocaleTimeString()
                        : '-'}
                    </td>
                    <td>
                      {record.checkOutTime
                        ? new Date(record.checkOutTime).toLocaleTimeString()
                        : '-'}
                    </td>
                    <td>{record.totalHours > 0 ? `${record.totalHours} hrs` : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {reportData.length === 0 && !isLoading && (
        <div className="empty-state">
          <h3>No Report Generated</h3>
          <p>Select a date range and click "Generate Report" to view attendance data</p>
        </div>
      )}
    </div>
  );
};

export default Reports;
