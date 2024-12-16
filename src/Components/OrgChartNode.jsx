import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import EmployeeCard from './EmployeeCard';

function OrgChartNode({ employee }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [reportingEmployees, setReportingEmployees] = useState([]);

  const toggleExpand = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  // Fetch reporting employees when expanded
  useEffect(() => {
    if (isExpanded && employee.employeeId) {
      const fetchReportingEmployees = async () => {
        const response = await fetch(`http://localhost:8085/employees/reporting-to/${employee.employeeId}`);
        const data = await response.json();
        console.log('Reporting Employees:', data);  // Debugging line
        setReportingEmployees(data);
      };

      fetchReportingEmployees();
    } else {
      setReportingEmployees([]); // Reset when collapsed
    }
  }, [isExpanded, employee.employeeId]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center"
    >
      {/* Employee card */}
      <EmployeeCard employee={employee} isExpanded={isExpanded} onToggle={toggleExpand} />

      {/* Render child employees (reporting employees) */}
      {isExpanded && reportingEmployees.length > 0 && (
        <div className="mt-4 flex flex-col items-center">
          <div className="w-px h-4 bg-gray-400"></div>
          <div className="flex flex-wrap justify-center gap-4 pt-4 border-t border-gray-400">
            {reportingEmployees.map((child) => (
              <OrgChartNode key={child.employeeId} employee={child} />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default OrgChartNode;
