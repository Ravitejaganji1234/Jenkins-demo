import { useEffect, useState, useCallback, useRef } from 'react';

import OrgChartNode from './OrgChartNode';

import { Search } from 'lucide-react';

export default function LargeOrganizationChart() {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [noResults, setNoResults] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const suggestionsRef = useRef();

  useEffect(() => {
    const fetchEmployees = async () => {
      const response = await fetch('http://localhost:8085/employees');
      const data = await response.json();
      setEmployees(data);
    };
    fetchEmployees();
  }, []);

  const handleSearch = useCallback((event) => {
    const term = event.target.value;
    setSearchTerm(term);

    if (term) {
      const results = employees.filter((employee) => {
        const nameMatches = employee.firstName?.toLowerCase().includes(term.toLowerCase());
        const titleMatches = employee.role?.toLowerCase().includes(term.toLowerCase());
        return nameMatches || titleMatches;
      });

      setNoResults(results.length === 0);

      const newSuggestions = employees
        .flatMap((employee) => employee.firstName.toLowerCase().includes(term.toLowerCase()) ? [employee.firstName] : [])
        .slice(0, 5);
      setSuggestions(newSuggestions);
    } else {
      setNoResults(false);
      setSuggestions([]);
    }
  }, [employees]);

  const handleSuggestionClick = async (suggestion) => {
    const matchedEmployee = employees.find(employee => employee.firstName === suggestion);
    if (matchedEmployee) {
      setSelectedEmployee(matchedEmployee);
      setSearchTerm('');
      setSuggestions([]);

      // Fetch reporting employees
      const response = await fetch(`http://localhost:8085/employees/reporting-to/${matchedEmployee.employeeId}`);
      const data = await response.json();
      setSelectedEmployee(prev => ({ ...matchedEmployee, reportingEmployees: data }));
    }
  };



  const filteredEmployees = selectedEmployee ? [selectedEmployee] : employees.filter((employee) => {
    const nameMatches = employee.firstName?.toLowerCase().includes(searchTerm.toLowerCase());
    const titleMatches = employee.role?.toLowerCase().includes(searchTerm.toLowerCase());
    return nameMatches || titleMatches;
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col h-screen bg-slate-200">
      <h1 className="text-3xl font-bold text-center mb-4 mt-5 text-blue-900 font-extralight">Company Organization Chart</h1>
      <div className="flex justify-between items-center mb-4 p-4">
        <div className="relative" ref={suggestionsRef}>
          <div className="w-full max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10 pr-10 py-2 w-full rounded-full border-2 border-primary focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 ease-in-out"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary" size={20} />
            </div>
          </div>
          {suggestions.length > 0 && (
            <ul className="absolute z-10 bg-white border border-gray-200 rounded shadow-lg w-full mt-1">
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="flex-grow overflow-auto border border-gray-200 rounded-lg">
        <div
          className="inline-block min-w-full p-4"
          style={{ transformOrigin: 'top left' }}
        >
          {noResults ? (
            <div className="flex flex-col justify-center items-center h-full animate-bounce mt-28 ">
              <h1 className='text-center font-bold font-serif text-black'>OOPS!</h1>
              <img
                className="h-96 w-96"
                src="https://img.freepik.com/free-vector/hand-drawn-no-data-illustration_23-2150696455.jpg?t=st=1729502300~exp=1729505900~hmac=7e8e517316acea13dd6272d8487bb029c6d0d491b28fc5a28f69eddab6d18c0b&w=740"
                alt="No data illustration"
              />
            </div>
          ) : (
            filteredEmployees.length > 0 && <OrgChartNode employee={filteredEmployees[0]} />
          )}
        </div>
      </div>
    </div>
  );
}
