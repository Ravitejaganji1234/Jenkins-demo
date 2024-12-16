import { ChevronDown, ChevronRight } from 'lucide-react';

function EmployeeCard({ employee, isExpanded, onToggle }) {
  return (
    <div
      className="p-2 text-center shadow-md rounded-lg flex items-center space-x-2 bg-gradient-to-r from-teal-400 to-blue-500 hover:from-pink-500 hover:to-orange-500"
      onClick={onToggle}
    >
      {employee.reportingEmployees && employee.reportingEmployees.length > 0 && (
        <button variant="ghost" size="icon">
          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
      )}
      <div>
        <h3 className="text-sm cursor-pointer font-bold text-white">
          {employee.firstName} {employee.lastName}
        </h3>
        <p className="text-xs text-gray-600 text-white">{employee.role}</p>
      </div>
    </div>
  );
}


export default EmployeeCard;
