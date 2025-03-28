const jobContainer = document.getElementById('job-listings');
const roleFilter = document.getElementById('role-filter');
const levelFilter = document.getElementById('level-filter');
const positionFilter = document.getElementById('position-filter');
const locationFilter = document.getElementById('location-filter');
const contractFilter = document.getElementById('contract-filter');
const languagesFilter = document.getElementById('languages-filter');
const toolsFilter = document.getElementById('tools-filter');
const clearFiltersBtn = document.getElementById('clear-filters');

let allJobs = [];

// Fetch JSON data
fetch('data.json')
  .then(response => response.json())
  .then(data => {
    allJobs = data;
    populateDropdowns(data);
    displayJobs(data);
  })
  .catch(error => console.error('Error loading JSON:', error));

// dropdowns for filters
function populateDropdowns(jobs) {
  const roles = new Set();
  const levels = new Set();
  const positions = new Set();
  const locations = new Set();
  const contracts = new Set();
  const languages = new Set();
  const tools = new Set();

  jobs.forEach(job => {
    roles.add(job.role);
    levels.add(job.level);
    positions.add(job.position);
    locations.add(job.location);
    contracts.add(job.contract);
    job.languages.forEach(lang => languages.add(lang));
    job.tools.forEach(tool => tools.add(tool));
  });

  addOptions(roleFilter, roles);
  addOptions(levelFilter, levels);
  addOptions(positionFilter, positions);
  addOptions(locationFilter, locations);
  addOptions(contractFilter, contracts);
  addOptions(languagesFilter, languages);
  addOptions(toolsFilter, tools);
}

// Helper function to add options to a dropdown
function addOptions(selectElement, optionsSet) {
  optionsSet.forEach(option => {
    const optionElement = document.createElement('option');
    optionElement.value = option;
    optionElement.textContent = option;
    selectElement.appendChild(optionElement);
  });
}

// Event listeners for dropdowns
[roleFilter, levelFilter, positionFilter, locationFilter, contractFilter, languagesFilter, toolsFilter]
  .forEach(filter => filter.addEventListener('change', filterJobs));

// Clear all filters
clearFiltersBtn.addEventListener('click', () => {
  [roleFilter, levelFilter, positionFilter, locationFilter, contractFilter, languagesFilter, toolsFilter].forEach(filter => {
    filter.value = "";
  });
  displayJobs(select);
});

// Filter jobs and move selected ones to the top
function filterJobs() {
  const selectedRole = roleFilter.value;
  const selectedLevel = levelFilter.value;
  const selectedPosition = positionFilter.value;
  const selectedLocation = locationFilter.value;
  const selectedContract = contractFilter.value;
  const selectedLanguage = languagesFilter.value;
  const selectedTool = toolsFilter.value;

  let filteredJobs = allJobs.slice();

  if (selectedRole) filteredJobs = sortJobs(filteredJobs, 'role', selectedRole);
  if (selectedLevel) filteredJobs = sortJobs(filteredJobs, 'level', selectedLevel);
  if (selectedPosition) filteredJobs = sortJobs(filteredJobs, 'position', selectedPosition);
  if (selectedLocation) filteredJobs = sortJobs(filteredJobs, 'location', selectedLocation);
  if (selectedContract) filteredJobs = sortJobs(filteredJobs, 'contract', selectedContract);
  if (selectedLanguage) filteredJobs = sortJobs(filteredJobs, 'languages', selectedLanguage);
  if (selectedTool) filteredJobs = sortJobs(filteredJobs, 'tools', selectedTool);

  displayJobs(filteredJobs);
}

// Move selected jobs to the top
function sortJobs(jobs, key, value) {
  return jobs.sort((a, b) => {
    const aMatches = Array.isArray(a[key]) ? a[key].includes(value) : a[key] === value;
    const bMatches = Array.isArray(b[key]) ? b[key].includes(value) : b[key] === value;
    return bMatches - aMatches; // Move matching jobs to the top
  });
}

// Display jobs
function displayJobs(jobs) {
  jobContainer.innerHTML = "";

  jobs.forEach(job => {
    const jobCard = document.createElement('div');
    jobCard.classList.add(
      'bg-white', 'p-6', 'shadow-lg', 'rounded-lg', 'border-l-4',
      job.featured ? 'border-teal-500' : 'border-gray-300',
      'flex', 'flex-col', 'md:flex-row', 'items-center', 'justify-between'
    );

    jobCard.innerHTML = `
      <div class="flex items-center space-x-4">
        <img src="${job.logo}" alt="${job.company}" class="w-16 h-16">
        <div>
          <h2 class="text-lg font-bold">${job.position}</h2>
          <p class="text-gray-500">${job.company} • ${job.contract} • ${job.location}</p>
        </div>
      </div>
      <div class="mt-4 flex flex-wrap gap-2">
        ${generateFilterButtons(job)}
      </div>
    `;

    jobContainer.appendChild(jobCard);
  });
}

// Generate filter buttons for a job
function generateFilterButtons(job) {
  const filters = [job.role, job.level, ...job.languages, ...job.tools];
  return filters.map(filter => `<button class="filter-btn bg-blue-100 text-blue-700 px-2 py-1 rounded">${filter}</button>`).join('');
}
