var ALL_CLASSES = ['A', 'B', 'B2', 'B3', 'C', 'C1', 'D1', 'D2', 'D3', 'E', 'CD'];

var drivers = JSON.parse(localStorage.getItem('v_drivers_roster')) || [
    {
        id: '1',
        name: 'VINCENT MURIUKI',
        phone: '+254769753704',
        age: 21,
        county: 'Embu',
        constituency: 'Manyatta',
        classes: ['B2'],
        status: 'Ready for Hire'
    }
];

function saveDrivers() {
    localStorage.setItem('v_drivers_roster', JSON.stringify(drivers));
    renderDrivers();
    renderAdminDriversList();
    updateStats();
}

function renderClassesCheckboxes(containerId, selected) {
    if (!selected) selected = [];
    var container = document.getElementById(containerId);
    if (!container) return;
    var html = '';
    for (var i = 0; i < ALL_CLASSES.length; i++) {
        var cls = ALL_CLASSES[i];
        var isChecked = selected.indexOf(cls) !== -1 ? 'checked' : '';
        html += '<label class="flex items-center space-x-2 glass-input px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer hover:border-amber-500/50 transition">';
        html += '<input type="checkbox" name="' + containerId + '_class" value="' + cls + '" ' + isChecked + ' class="rounded bg-slate-800 border-slate-700 text-amber-500 focus:ring-amber-500">';
        html += '<span class="text-white">' + cls + '</span></label>';
    }
    container.innerHTML = html;
}

function renderDrivers() {
    var grid = document.getElementById('driversGrid');
    if (!grid) return;
    var search = document.getElementById('searchInput').value.toLowerCase();
    var classFilter = document.getElementById('classFilter').value;
    var statusFilter = document.getElementById('statusFilter').value;

    var filtered = [];
    for (var i = 0; i < drivers.length; i++) {
        var d = drivers[i];
        var matchesSearch = d.name.toLowerCase().indexOf(search) !== -1 || (d.county && d.county.toLowerCase().indexOf(search) !== -1);
        var matchesClass = !classFilter || d.classes.indexOf(classFilter) !== -1;
        var matchesStatus = !statusFilter || d.status === statusFilter;
        if (matchesSearch && matchesClass && matchesStatus) {
            filtered.push(d);
        }
    }

    if (filtered.length === 0) {
        grid.innerHTML = '<div class="col-span-full py-16 text-center glass-panel rounded-3xl"><p class="text-slate-300 font-semibold text-lg">No drivers found matching your criteria</p></div>';
        return;
    }

    var gridHtml = '';
    for (var j = 0; j < filtered.length; j++) {
        var dr = filtered[j];
        var statusBadge = dr.status === 'Ready for Hire' 
            ? '<span class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">' + dr.status + '</span>'
            : '<span class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30">' + dr.status + '</span>';
        
        var locationText = dr.county ? '<p class="text-xs text-slate-400 mb-3 flex items-center space-x-1.5"><i class="fa-solid fa-location-dot text-amber-400"></i><span>' + dr.county + (dr.constituency ? ', ' + dr.constituency : '') + '</span></p>' : '';
        
        var classesHtml = '';
        for (var c = 0; c < dr.classes.length; c++) {
            classesHtml += '<span class="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold">' + dr.classes[c] + '</span>';
        }

        gridHtml += '<div class="glass-panel rounded-3xl p-6 relative flex flex-col justify-between hover:border-amber-500/40 transition shadow-xl">';
        gridHtml += '<div>';
        gridHtml += '<div class="flex items-start justify-between mb-4">' + statusBadge + '<div class="text-xs text-slate-400 font-semibold bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">Age: <span class="text-white">' + dr.age + ' yrs</span></div></div>';
        gridHtml += '<h4 class="text-xl font-bold text-white mb-1">' + dr.name + '</h4>';
        gridHtml += locationText;
        gridHtml += '<div class="mb-5"><span class="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-2">Licensed Classes</span><div class="flex flex-wrap gap-1.5">' + classesHtml + '</div></div>';
        gridHtml += '</div>';
        gridHtml += '<button onclick="openHireModalById(\'' + dr.id + '\')" class="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold py-3 rounded-xl shadow-lg shadow-amber-500/20 transition flex items-center justify-center space-x-2 text-sm mt-4">';
        gridHtml += '<i class="fa-solid fa-phone-alt text-base"></i><span>Hire Driver</span></button>';
        gridHtml += '</div>';
    }
    grid.innerHTML = gridHtml;
}

function updateStats() {
    var statTotal = document.getElementById('statTotalDrivers');
    if (statTotal) statTotal.innerText = drivers.length;
}

function openHireModalById(id) {
    var driver = null;
    for (var i = 0; i < drivers.length; i++) {
        if (drivers[i].id === id) { driver = drivers[i]; break; }
    }
    if (!driver) return;
    document.getElementById('hireModalDriverName').innerText = driver.name;
    var cleanPhone = driver.phone.replace(/[^0-9+]/g, '');
    var html = '<a href="tel:' + cleanPhone + '" class="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 rounded-xl border border-slate-700 transition flex items-center justify-center space-x-2 text-sm"><i class="fa-solid fa-phone text-amber-400"></i><span>Call Driver (' + driver.phone + ')</span></a>';
    var waMsg = 'Hello ' + driver.name + ', I found your profile on V DRIVER | FIND DRIVER HERE and would like to hire you.';
    html += '<a href="https://wa.me/' + cleanPhone.replace('+', '') + '?text=' + encodeURIComponent(waMsg) + '" target="_blank" class="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-xl shadow-md transition flex items-center justify-center space-x-2 text-sm"><i class="fa-brands fa-whatsapp text-lg"></i><span>Text on WhatsApp</span></a>';
    document.getElementById('hireModalOptions').innerHTML = html;
    document.getElementById('hireModal').classList.remove('hidden');
}

function closeHireModal() {
    document.getElementById('hireModal').classList.add('hidden');
}

function openEmergencyModal() {
    window.open('https://wa.me/254769753704?text=' + encodeURIComponent('Hello Admin Vincent Muriuki, I need urgent driver assistance dispatch from V DRIVER website.'), '_blank');
}

function openAdminModal() {
    document.getElementById('adminModal').classList.remove('hidden');
    if (sessionStorage.getItem('v_admin_logged') === 'true') {
        showAdminDashboard();
    } else {
        showAdminLogin();
    }
}

function closeAdminModal() {
    document.getElementById('adminModal').classList.add('hidden');
}

function showAdminLogin() {
    document.getElementById('adminLoginView').classList.remove('hidden');
    document.getElementById('adminDashboardView').classList.add('hidden');
}

function showAdminDashboard() {
    document.getElementById('adminLoginView').classList.add('hidden');
    document.getElementById('adminDashboardView').classList.remove('hidden');
    renderClassesCheckboxes('adminClassesContainer', ['B2']);
    renderAdminDriversList();
    resetAdminForm();
}

function logoutAdmin() {
    sessionStorage.removeItem('v_admin_logged');
    showAdminLogin();
}

function resetAdminForm() {
    document.getElementById('editDriverId').value = '';
    document.getElementById('adminDriverName').value = '';
    document.getElementById('adminDriverPhone').value = '';
    document.getElementById('adminDriverAge').value = '';
    document.getElementById('adminDriverCounty').value = '';
    document.getElementById('adminDriverConstituency').value = '';
    document.getElementById('adminDriverStatus').value = 'Ready for Hire';
    renderClassesCheckboxes('adminClassesContainer', ['B2']);
    document.getElementById('adminFormTitle').innerText = 'Add New Driver to Roster';
    document.getElementById('adminSubmitBtn').innerText = 'Add Driver';
    document.getElementById('adminCancelEditBtn').classList.add('hidden');
}

function toggleDriverStatus(id) {
    for (var i = 0; i < drivers.length; i++) {
        if (drivers[i].id === id) {
            drivers[i].status = drivers[i].status === 'Ready for Hire' ? 'Booked' : 'Ready for Hire';
            saveDrivers();
            break;
        }
    }
}

function editDriver(id) {
    var d = null;
    for (var i = 0; i < drivers.length; i++) {
        if (drivers[i].id === id) { d = drivers[i]; break; }
    }
    if (!d) return;
    document.getElementById('editDriverId').value = d.id;
    document.getElementById('adminDriverName').value = d.name;
    document.getElementById('adminDriverPhone').value = d.phone;
    document.getElementById('adminDriverAge').value = d.age;
    document.getElementById('adminDriverCounty').value = d.county || '';
    document.getElementById('adminDriverConstituency').value = d.constituency || '';
    document.getElementById('adminDriverStatus').value = d.status;
    renderClassesCheckboxes('adminClassesContainer', d.classes);
    document.getElementById('adminFormTitle').innerText = 'Edit Driver: ' + d.name;
    document.getElementById('adminSubmitBtn').innerText = 'Update Driver';
    document.getElementById('adminCancelEditBtn').classList.remove('hidden');
}

function deleteDriver(id) {
    if (confirm('Remove driver from roster?')) {
        var newDrivers = [];
        for (var i = 0; i < drivers.length; i++) {
            if (drivers[i].id !== id) {
                newDrivers.push(drivers[i]);
            }
        }
        drivers = newDrivers;
        saveDrivers();
    }
}

function renderAdminDriversList() {
    var list = document.getElementById('adminDriversList');
    if (!list) return;
    if (drivers.length === 0) { list.innerHTML = '<p class="text-xs text-slate-500 text-center py-4">No drivers.</p>'; return; }
    var listHtml = '';
    for (var i = 0; i < drivers.length; i++) {
        var d = drivers[i];
        var statusColor = d.status === 'Ready for Hire' ? 'text-emerald-400' : 'text-amber-400';
        listHtml += '<div class="glass-panel p-3 rounded-xl flex items-center justify-between text-xs">';
        listHtml += '<div><span class="font-bold text-white">' + d.name + '</span>';
        listHtml += '<div class="text-slate-400 text-[11px] mt-0.5">' + d.classes.join(', ') + ' • ' + d.age + ' yrs • <span class="' + statusColor + '">' + d.status + '</span></div></div>';
        listHtml += '<div class="flex items-center space-x-1.5">';
        listHtml += '<button type="button" onclick="toggleDriverStatus(\'' + d.id + '\')" class="px-2 py-1 bg-slate-800 text-amber-400 rounded border border-slate-700">Toggle</button>';
        listHtml += '<button type="button" onclick="editDriver(\'' + d.id + '\')" class="px-2 py-1 bg-amber-500/20 text-amber-400 rounded border border-amber-500/30">Edit</button>';
        listHtml += '<button type="button" onclick="deleteDriver(\'' + d.id + '\')" class="px-2 py-1 bg-red-500/20 text-red-400 rounded border border-red-500/30">Del</button>';
        listHtml += '</div></div>';
    }
    list.innerHTML = listHtml;
}

// Event Listeners Setup on DOM Load
document.addEventListener('DOMContentLoaded', function() {
    renderClassesCheckboxes('licenseClassesContainer', ['B2']);
    renderDrivers();
    updateStats();

    // Search and Filters
    var searchInput = document.getElementById('searchInput');
    var classFilter = document.getElementById('classFilter');
    var statusFilter = document.getElementById('statusFilter');

    if (searchInput) searchInput.addEventListener('input', renderDrivers);
    if (classFilter) classFilter.addEventListener('change', renderDrivers);
    if (statusFilter) statusFilter.addEventListener('change', renderDrivers);

    // Emergency & Admin Modals
    var emergencyBtn = document.getElementById('emergencyBtn');
    if (emergencyBtn) emergencyBtn.addEventListener('click', openEmergencyModal);

    var adminPortalBtn = document.getElementById('adminPortalBtn');
    if (adminPortalBtn) adminPortalBtn.addEventListener('click', openAdminModal);

    var closeAdminModalBtn = document.getElementById('closeAdminModalBtn');
    if (closeAdminModalBtn) closeAdminModalBtn.addEventListener('click', closeAdminModal);

    var closeHireModalBtn = document.getElementById('closeHireModalBtn');
    if (closeHireModalBtn) closeHireModalBtn.addEventListener('click', closeHireModal);

    // Forms
    var driverForm = document.getElementById('driverForm');
    if (driverForm) {
        driverForm.addEventListener('submit', function(e) {
            e.preventDefault();
            var name = document.getElementById('regName').value.trim();
            var phone = document.getElementById('regPhone').value.trim();
            var age = document.getElementById('regAge').value.trim();
            var county = document.getElementById('regCounty').value.trim();
            var constituency = document.getElementById('regConstituency').value.trim();
            
            var checkboxes = document.querySelectorAll('input[name="licenseClassesContainer_class"]:checked');
            var classes = [];
            for (var i = 0; i < checkboxes.length; i++) {
                classes.push(checkboxes[i].value);
            }

            if (classes.length === 0) { alert('Please select at least one licensed class.'); return; }

            var message = '*NEW DRIVER APPLICATION*\n\n*Full Name:* ' + name + '\n*Phone / WhatsApp:* ' + phone + '\n*Age:* ' + age + ' yrs\n*County:* ' + (county || 'N/A') + '\n*Constituency:* ' + (constituency || 'N/A') + '\n*Classes:* ' + classes.join(', ') + '\n\nPlease approve my application for the V DRIVER roster.';
            window.open('https://wa.me/254769753704?text=' + encodeURIComponent(message), '_blank');

            drivers.push({ id: Date.now().toString(), name: name, phone: phone, age: parseInt(age), county: county, constituency: constituency, classes: classes, status: 'Ready for Hire' });
            saveDrivers();
            driverForm.reset();
            renderClassesCheckboxes('licenseClassesContainer', ['B2']);
            alert('Application submitted via WhatsApp!');
        });
    }

    var adminLoginForm = document.getElementById('adminLoginForm');
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (document.getElementById('adminPasswordInput').value === '2006') {
                sessionStorage.setItem('v_admin_logged', 'true');
                showAdminDashboard();
                document.getElementById('adminPasswordInput').value = '';
            } else { alert('Incorrect admin password.'); }
        });
    }

    var logoutAdminBtn = document.getElementById('logoutAdminBtn');
    if (logoutAdminBtn) logoutAdminBtn.addEventListener('click', logoutAdmin);

    var adminDriverForm = document.getElementById('adminDriverForm');
    if (adminDriverForm) {
        adminDriverForm.addEventListener('submit', function(e) {
            e.preventDefault();
            var id = document.getElementById('editDriverId').value;
            var name = document.getElementById('adminDriverName').value.trim();
            var phone = document.getElementById('adminDriverPhone').value.trim();
            var age = parseInt(document.getElementById('adminDriverAge').value);
            var county = document.getElementById('adminDriverCounty').value.trim();
            var constituency = document.getElementById('adminDriverConstituency').value.trim();
            var status = document.getElementById('adminDriverStatus').value;
            
            var checkboxes = document.querySelectorAll('input[name="adminClassesContainer_class"]:checked');
            var classes = [];
            for (var i = 0; i < checkboxes.length; i++) {
                classes.push(checkboxes[i].value);
            }

            if (classes.length === 0) { alert('Please select at least one class.'); return; }

            if (id) {
                for (var j = 0; j < drivers.length; j++) {
                    if (drivers[j].id === id) {
                        drivers[j].name = name;
                        drivers[j].phone = phone;
                        drivers[j].age = age;
                        drivers[j].county = county;
                        drivers[j].constituency = constituency;
                        drivers[j].classes = classes;
                        drivers[j].status = status;
                        break;
                    }
                }
            } else {
                drivers.push({ id: Date.now().toString(), name: name, phone: phone, age: age, county: county, constituency: constituency, classes: classes, status: status });
            }
            saveDrivers();
            resetAdminForm();
            alert('Driver successfully saved!');
        });
    }

    var adminCancelEditBtn = document.getElementById('adminCancelEditBtn');
    if (adminCancelEditBtn) adminCancelEditBtn.addEventListener('click', resetAdminForm);
});
