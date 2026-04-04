

        // 1. DATA INITIALIZATION (With Safety Defaults)
        let skills = JSON.parse(localStorage.getItem('mySkills')) || {};
        let certs = JSON.parse(localStorage.getItem('myCerts')) || [];
        let projects = JSON.parse(localStorage.getItem('myProjects')) || [];
        let editIndex = -1; // Track if we are editing
        let bookmarks = JSON.parse(localStorage.getItem('myBookmarks')) || {};
        let careerData = JSON.parse(localStorage.getItem('myCareerData')) || {
            experience: "3+ Years",
            domain: "Data & Process Associate (Retail Analytics)",
            focus: "AI/ML Engineering, Data Science"
        };
        function updateLiveDashboard() {
            const aboutH = document.getElementById('about-highlights');
            if (!aboutH) return;

            const currentCareer = JSON.parse(localStorage.getItem('myCareerData')) || careerData;
            const currentBookmarks = JSON.parse(localStorage.getItem('myBookmarks')) || {};
            const currentProjects = JSON.parse(localStorage.getItem('myProjects')) || [];
            const coreSkillsString = Object.values(currentBookmarks).join(", ") || "Python, SQL, ML";

            aboutH.innerHTML = `
        <li class="highlight-row">
            <span class="label"><i class="fas fa-chart-line"></i>Accuracy</span>
            <span class="value-highlight-green">30% Improvement</span>
        </li>
        <li class="highlight-row">
            <span class="label"><i class="fas fa-bolt"></i>Reporting</span>
            <span class="value-highlight-green">35% Reduction</span>
        </li>
        <li class="highlight-row">
            <span class="label"><i class="fas fa-database"></i>Scale</span>
            <span class="value-highlight-green">50K+ Records/mo</span>
        </li>
        <li class="highlight-row">
            <span class="label"><i class="fas fa-briefcase"></i>Experience</span>
            <span class="value-plain">${currentCareer.experience}</span>
        </li>
        <li class="highlight-row">
            <span class="label"><i class="fas fa-project-diagram"></i>Projects</span>
            <span class="value-plain">${currentProjects.length}+ Completed</span>
        </li>
        <li class="highlight-row flex justify-between items-start py-1">
    <span class="label flex items-center shrink-0">
        <i class="fas fa-star mr-2"></i>Core Skills
    </span>
    <span class="value-plain flex-1 text-right ml-4 break-words">
        ${coreSkillsString}
    </span>
</li>
        <li class="highlight-row">
            <span class="label"><i class="fas fa-user-tie"></i>Domain</span>
            <span class="value-plain">${currentCareer.domain}</span>
        </li>
        <li class="highlight-row">
            <span class="label"><i class="fas fa-crosshairs"></i>Focus</span>
            <span class="value-plain">${currentCareer.focus}</span>
        </li>
    `;
        }

        // 2. THE MAIN RENDER ENGINE
        function renderAll() {
            console.log("System Refresh: Drawing all components...");

            const categories = Object.keys(skills);

            // --- 1. HELPER TO GENERATE HTML ---
            // isAdminView = true shows controls, false shows static view
            const generateSkillsHTML = (isAdminView) => {
                if (categories.length === 0) {
                    return '<p class="col-span-full text-slate-400 italic text-center py-10">No skills added yet.</p>';
                }

                return categories.map(cat => `
            <div class="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm relative group">
                <div class="flex justify-between items-center mb-4 border-b border-slate-50 pb-3">
                    <h3 class="text-blue-600 font-black uppercase tracking-tighter text-sm">${cat}</h3>
                    ${isAdminView ? `
                    <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                        <button onclick="editCategoryName('${cat}')" class="text-slate-400 hover:text-blue-500"><i class="fas fa-edit text-xs"></i></button>
                        <button onclick="deleteCategory('${cat}')" class="text-slate-400 hover:text-red-500"><i class="fas fa-trash text-xs"></i></button>
                    </div>` : ''}
                </div>
                <ul class="space-y-3">
                    ${skills[cat].map((s, index) => {
                    const isMarked = bookmarks[`${cat}-${s}`];
                    return `
                        <li class="flex justify-between items-center text-slate-800 text-sm font-semibold group/item">
                            <span><i class="fas fa-check-circle text-blue-500 mr-2 text-[10px]"></i>${s}</span>
                            
                            <div class="flex gap-3 items-center">
                                ${isAdminView ? `
                                    <button onclick="toggleBookmark('${cat}', ${index})" 
                                        class="${isMarked ? 'text-orange-500' : 'text-slate-300 hover:text-orange-400'}">
                                        <i class="${isMarked ? 'fas' : 'far'} fa-star text-[10px]"></i>
                                    </button>
                                    <button onclick="removeSkill('${cat}', ${index})" 
                                        class="text-slate-300 hover:text-red-500">
                                        <i class="fas fa-times text-[10px]"></i>
                                    </button>
                                ` : `
                                    ${isMarked ? '<i class="fas fa-star text-orange-500 text-[10px]"></i>' : ''}
                                `}
                            </div>
                        </li>`;
                }).join('')}
                </ul>
            </div>
        `).join('');
            };

            // --- 2. RENDER TO CONTAINERS ---

            // A. Main Skill Section (Static View)
            const skillBox = document.getElementById('skills-container');
            if (skillBox) {
                skillBox.className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8";
                skillBox.innerHTML = generateSkillsHTML(false); // false = Read-only
            }

            // B. Duplicate Skill Section (Control View)
            const duplicateBox = document.getElementById('skills-container-duplicate');
            if (duplicateBox) {
                duplicateBox.className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8";
                duplicateBox.innerHTML = generateSkillsHTML(true); // true = With controls
            }

            // --- 3. SYNC & REMAINING RENDERS ---
            // This ensures both the Recruiter view and your Admin view stay in sync
            if (typeof renderCerts === "function") {
                renderCerts(false); // Update the Public/Main Certificate section
                renderCerts(true);  // Update the Admin/Duplicate Certificate section
            }

            if (typeof renderProjects === "function") {
                renderProjects('All', false); // Update the Public/Main Projects section
                renderProjects('All', true);  // Update the Admin/Duplicate Projects section
            }

            localStorage.setItem('mySkills', JSON.stringify(skills));
            localStorage.setItem('myBookmarks', JSON.stringify(bookmarks));
            localStorage.setItem('myProjects', JSON.stringify(projects));
            localStorage.setItem('myCerts', JSON.stringify(certs));
            localStorage.setItem('myCareerData', JSON.stringify(careerData));

            // Ensure Dashboard reflects current bookmarks
            updateLiveDashboard();
        }
        // 3. ACTION FUNCTIONS
        // --- Updated ACTION FUNCTIONS ---

        function addCategorizedSkill() {
            const catInput = document.getElementById('skill-category');
            const nameInput = document.getElementById('skill-name');
            const oldCatInput = document.getElementById('old-category-name');

            const catVal = catInput.value.trim();
            const nameVal = nameInput.value.trim();
            const oldCatName = oldCatInput.value;

            // 1. Validation Alerts
            if (!catVal) return alert("⚠️ Please enter a Category name.");

            // 2. Handle Category Renaming (If Edit was clicked)
            if (oldCatName && oldCatName !== catVal) {
                if (skills[oldCatName]) {
                    skills[catVal] = skills[oldCatName]; // Move skills to new category name
                    delete skills[oldCatName]; // Delete old category

                    // Clean up bookmarks for the old category name
                    Object.keys(bookmarks).forEach(key => {
                        if (key.startsWith(oldCatName + "-")) {
                            const skillName = bookmarks[key];
                            delete bookmarks[key];
                            bookmarks[`${catVal}-${skillName}`] = skillName;
                        }
                    });
                }
            }

            // 3. Handle Skill Adding (If Skill Name is not blank)
            if (nameVal) {
                if (!skills[catVal]) skills[catVal] = [];
                if (!skills[catVal].includes(nameVal)) {
                    skills[catVal].push(nameVal);
                } else {
                    alert("💡 Skill '" + nameVal + "' already exists in " + catVal);
                }
            } else if (!oldCatName) {
                // If it's a brand new category with no skill yet
                if (!skills[catVal]) skills[catVal] = [];
                alert("✅ Category '" + catVal + "' created.");
            }

            // 4. RESET EVERYTHING
            catInput.value = "";
            nameInput.value = "";
            oldCatInput.value = "";
            document.getElementById('skill-btn').innerText = "Save Skill / Category"; // Reset button text

            renderAll();
            alert("✅ Portfolio Updated!");
        }

        // 5. EDIT CATEGORY NAME (Fills the input box)
        function editCategoryName(cat) {
            document.getElementById('skill-category').value = cat;
            document.getElementById('old-category-name').value = cat;
            document.getElementById('skill-name').placeholder = "Leave blank to just rename";
            document.getElementById('skill-btn').innerText = "Update Category Name";

            // Scroll to the admin panel so user sees it
            document.getElementById('skill-category').focus();
        }

        // 6. DELETE CATEGORY
        function deleteCategory(cat) {
            if (confirm("🗑️ Are you sure you want to delete the '" + cat + "' category and all its skills?")) {
                delete skills[cat];

                // Clean up bookmarks
                Object.keys(bookmarks).forEach(key => {
                    if (key.startsWith(cat + "-")) delete bookmarks[key];
                });

                renderAll();
            }
        }

        function toggleBookmark(cat, idx) {
            const name = skills[cat][idx];
            const key = `${cat}-${name}`;
            if (bookmarks[key]) delete bookmarks[key];
            else bookmarks[key] = name;

            renderAll();
            updateLiveDashboard();
        }

        function removeSkill(cat, idx) {
            const name = skills[cat][idx];
            delete bookmarks[`${cat}-${name}`]; // Also remove bookmark if skill deleted
            skills[cat].splice(idx, 1);
            if (skills[cat].length === 0) delete skills[cat];
            renderAll();
        }

        // Function to save the manual highlight edits and reset the form
        function saveCareerHighlights() {
            // 1. Get the input elements
            const expInput = document.getElementById('edit-exp');
            const domInput = document.getElementById('edit-domain');
            const focInput = document.getElementById('edit-focus');

            // 2. Get the actual values
            const exp = expInput.value.trim();
            const dom = domInput.value.trim();
            const foc = focInput.value.trim();

            // 3. Update only if the user has typed something
            let updated = false;
            if (exp) { careerData.experience = exp; updated = true; }
            if (dom) { careerData.domain = dom; updated = true; }
            if (foc) { careerData.focus = foc; updated = true; }

            if (updated) {
                // 4. Sync to Disk
                localStorage.setItem('myCareerData', JSON.stringify(careerData));
                updateLiveDashboard();

                // 5. Refresh the UI Dashboard instantly
                renderAll();

                alert("✅ Dashboard highlights updated successfully!");

                // 6. THE FIX: Reset the input fields to empty
                expInput.value = "";
                domInput.value = "";
                focInput.value = "";
            } else {
                alert("⚠️ Please enter at least one detail to update.");
            }
        }

        // 4. STARTUP
        window.onload = renderAll;
        updateLiveDashboard();
        // 1. RENDER PROJECTS & UPDATE COUNT
        // --- 3. THE RENDER ENGINE ---
        function renderProjects(filter = 'All', isAdminView = false) {
            const containerId = isAdminView ? 'projects-container-duplicate' : 'projects-container';
            const projBox = document.getElementById(containerId);
            if (!projBox) return;

            const filtered = projects.filter(p => filter === 'All' || p.type === filter);

            if (filtered.length === 0) {
                projBox.innerHTML = '<p class="col-span-full text-center text-slate-400 py-20 italic">No projects found.</p>';
                return;
            }

            projBox.innerHTML = filtered.map((p) => {
                const actualIdx = projects.indexOf(p);
                const imgCount = p.images ? p.images.length : 0;

                let sliderHtml = imgCount > 0 ? `
            <div class="relative w-full h-48 overflow-hidden rounded-2xl mb-6 bg-white/5 pointer-events-none">
                <div id="slide-engine-${isAdminView ? 'admin-' : ''}${actualIdx}" class="flex" style="width: ${imgCount * 100}%; transition: transform 0.5s ease-in-out;">
                    ${p.images.map(img => `<div style="width: ${100 / imgCount}%; height: 192px; flex-shrink: 0;"><img src="${img}" class="w-full h-full object-cover"></div>`).join('')}
                </div>
            </div>` : '';

                return `
            <div class="project-card-glass p-6 group relative flex flex-col h-full cursor-pointer" onclick="openProjectModal(${actualIdx})">
                <div class="project-card-overlay">View Full Project</div>
                <div class="flex justify-between items-start mb-4 relative z-30">
                    <span class="text-[10px] font-bold bg-sky-400/20 text-sky-400 px-3 py-1 rounded-full uppercase">${p.type}</span>
                    ${isAdminView ? `
                    <div class="flex gap-2">
                        <button onclick="event.stopPropagation(); editProject(${actualIdx})" class="bg-white/10 p-2 rounded-full text-white hover:bg-sky-400 transition">
                            <i class="fas fa-pen text-[10px]"></i>
                        </button>
                        <button onclick="event.stopPropagation(); deleteProject(${actualIdx})" class="bg-white/10 p-2 rounded-full text-red-400 hover:bg-red-500 hover:text-white transition">
                            <i class="fas fa-trash text-[10px]"></i>
                        </button>
                    </div>` : ''}
                </div>
                ${sliderHtml}
                <h3 class="text-xl font-black mb-2 text-white">${p.title}</h3>
                <div class="project-description flex-grow">${p.desc}</div>
                <div class="text-[10px] font-bold text-sky-400/60 uppercase pt-4 border-t border-white/10 mt-auto">
                    <i class="fas fa-code mr-1"></i> ${p.tech}
                </div>
            </div>`;
            }).join('');

            initProjectSliders(filtered, isAdminView);
        }
        // 2. SAVE PROJECT (With all Alerts preserved)
        // The Main Save/Update Function
        async function saveProject() {
            const title = document.getElementById('proj-title').value.trim();
            const desc = document.getElementById('proj-desc').value.trim();
            const type = document.getElementById('proj-type').value;
            const tech = document.getElementById('proj-tech').value.trim();
            const imgInput = document.getElementById('proj-imgs');
            const currentIndex = parseInt(document.getElementById('edit-index').value);

            if (!title || !desc) {
                alert("⚠️ Please provide a Title and Description.");
                return;
            }

            let newImages = [];
            if (imgInput.files.length > 0) {
                for (let file of imgInput.files) {
                    const base64 = await new Promise(r => {
                        const reader = new FileReader();
                        reader.onload = e => r(e.target.result);
                        reader.readAsDataURL(file);
                    });
                    newImages.push(base64);
                }
            }

            const projectData = {
                title,
                type,
                tech,
                desc,
                images: newImages.length > 0
                    ? (currentIndex !== -1 ? [...projects[currentIndex].images, ...newImages] : newImages)
                    : (currentIndex !== -1 ? projects[currentIndex].images : [])
            };

            if (currentIndex === -1) {
                projects.push(projectData);
                alert("✅ Project Added Successfully!");
            } else {
                projects[currentIndex] = projectData;
                alert("✅ Project Updated Successfully!");
            }

            // CRITICAL: Save to disk
            localStorage.setItem('myProjects', JSON.stringify(projects));

            // RESET FORM
            document.getElementById('edit-index').value = "-1";
            document.getElementById('save-proj-btn').innerText = "Save Project";
            document.getElementById('proj-title').value = "";
            document.getElementById('proj-desc').value = "";
            document.getElementById('proj-tech').value = "";
            imgInput.value = "";

            // INSTANT REFRESH: Force the 'All' view so the change appears immediately
            renderAll();
            updateLiveDashboard();
            window.location.href = "#admin-controls"; // Stay in the admin area to see the result
            alert("✅ Project synchronized across all views!");
        }
        // --- 2. THE DELETE FUNCTION (INSTANT REMOVE) ---
        function deleteProject(index) {
            if (confirm("⚠️ Delete this project permanently?")) {
                projects.splice(index, 1);
                localStorage.setItem('myProjects', JSON.stringify(projects));

                alert("🗑️ Deleted successfully!");

                // CHANGE THIS LINE:
                renderAll(); // This refreshes BOTH Main and Duplicate sections
            }
        }

        // Triggered when you click the 'Edit' icon on a card
        function editProject(index) {
            const p = projects[index];

            // Fill the inputs with existing data
            document.getElementById('proj-title').value = p.title;
            document.getElementById('proj-type').value = p.type;
            document.getElementById('proj-tech').value = p.tech;
            document.getElementById('proj-desc').value = p.desc;

            // Set the hidden input to the current index
            document.getElementById('edit-index').value = index;

            // Change button text so you know you are in "Edit Mode"
            document.getElementById('save-proj-btn').innerText = "Update Project Details";

            window.location.href = "#admin";
            alert("📝 Editing mode active: '" + p.title + "'. Modify details and click Update.");
        }
        function openProjectModal(index) {
            const p = projects[index];
            const modal = document.getElementById('projectModal');
            const content = document.getElementById('modal-content');

            if (!modal || !content) {
                console.error("Modal elements not found in HTML!");
                return;
            }

            // Prepare gallery HTML
            const galleryHtml = p.images && p.images.length > 0 ? `
        <div class="mt-12 border-t pt-10">
            <p class="text-[10px] font-bold text-slate-400 uppercase mb-6 tracking-widest">Project Screenshots</p>
            <div class="grid grid-cols-1 gap-6">
                ${p.images.map(img => `<img src="${img}" class="w-full rounded-3xl border shadow-sm">`).join('')}
            </div>
        </div>
    ` : '';

            content.innerHTML = `
        <span class="text-blue-600 font-bold text-xs uppercase tracking-widest">${p.type}</span>
        <h2 class="text-4xl font-black mt-2 mb-8 text-slate-900">${p.title}</h2>
        <div class="text-slate-600 leading-relaxed text-lg break-words space-y-4">
            ${p.desc.replace(/\n/g, '<br>')}
        </div>
        <div class="mt-8 flex gap-2 flex-wrap">
            ${p.tech.split(',').map(t => `<span class="bg-slate-100 px-4 py-2 rounded-xl text-xs font-bold text-slate-600"># ${t.trim()}</span>`).join('')}
        </div>
        ${galleryHtml}
    `;

            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden'; // Stop background scrolling
        }

        function closeProjectModal() {
            document.getElementById('projectModal').classList.add('hidden');
            document.body.style.overflow = 'auto';
        }

        // 3. SLIDER INITIALIZER
        function initProjectSliders(filteredProjects, isAdminView) {
            filteredProjects.forEach(p => {
                const idx = projects.indexOf(p);
                const prefix = isAdminView ? 'admin-' : '';
                const el = document.getElementById(`slide-engine-${prefix}${idx}`);
                if (!el || !p.images || p.images.length <= 1) return;

                let currentPos = 0;
                setInterval(() => {
                    currentPos = (currentPos + 1) % p.images.length;
                    el.style.transform = `translateX(-${(currentPos * 100) / p.images.length}%)`;
                }, 2500);
            });
        }
        // --- 1. RENDER CERTIFICATES ---
        function renderCerts(isAdminView = false) {
            const containerId = isAdminView ? 'cert-container-duplicate' : 'cert-container';
            const certBox = document.getElementById(containerId);
            if (!certBox) return;

            if (certs.length === 0) {
                certBox.innerHTML = '<p class="text-slate-400 italic text-center py-4">No certificates added yet.</p>';
                return;
            }

            certBox.innerHTML = certs.map((c, index) => `
        <div class="group relative bg-white p-4 rounded-3xl border border-slate-100 hover:shadow-xl transition-all duration-500 cursor-pointer" 
             onclick="viewCertificate(${index})">
            
            <div class="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 rounded-3xl transition-all flex items-center justify-center">
                <span class="bg-white text-blue-600 px-4 py-2 rounded-full text-xs font-bold shadow-lg">View Certificate</span>
            </div>

            <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                    <i class="fas fa-file-medal text-xl"></i>
                </div>
                <div class="flex-grow">
                    <h4 class="text-sm font-black text-slate-800">${c.title}</h4>
                    <p class="text-[10px] text-slate-400 uppercase font-bold">${c.issuer} • ${c.date}</p>
                </div>
                
                ${isAdminView ? `
                <div class="relative z-20">
                    <button onclick="event.stopPropagation(); deleteCert(${index})" class="p-2 text-slate-400 hover:text-red-500">
                        <i class="fas fa-trash text-xs"></i>
                    </button>
                </div>` : ''}
            </div>
        </div>`).join('');
        }
        // --- 2. ADD CERTIFICATE (With File Input) ---
        async function addCert() {
            const title = document.getElementById('cert-title').value.trim();
            const issuer = document.getElementById('cert-issuer').value.trim();
            const date = document.getElementById('cert-date').value.trim();
            const fileInput = document.getElementById('cert-file');

            if (!title || !fileInput.files[0]) {
                alert("⚠️ Please provide a Title and a File.");
                return;
            }

            const file = fileInput.files[0];

            // --- NEW: SIZE CHECK (Limit to 1MB to save space) ---
            if (file.size > 1024 * 1024) {
                alert("❌ File too large! Please upload a file smaller than 1MB.");
                return;
            }

            const base64 = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target.result);
                reader.readAsDataURL(file);
            });

            const newCert = {
                title,
                issuer,
                date,
                fileData: base64,
                fileType: file.type,
                fileName: file.name
            };

            try {
                certs.push(newCert);
                localStorage.setItem('myCerts', JSON.stringify(certs));

                // Reset Form
                document.getElementById('cert-title').value = "";
                document.getElementById('cert-issuer').value = "";
                fileInput.value = "";

                renderAll(); // Use the master render
                alert("✅ Certificate Added!");
            } catch (e) {
                if (e.code === 22 || e.name === 'QuotaExceededError') {
                    alert("❌ Storage Full! Please delete old certificates before adding new ones.");
                    // Remove the failed item from the array so it stays in sync
                    certs.pop();
                }
            }
        }
        // --- 3. VIEW & DOWNLOAD LOGIC ---
        function viewCertificate(index) {
            const c = certs[index];
            const modal = document.getElementById('projectModal');
            const content = document.getElementById('modal-content');

            let viewerHtml = '';

            if (c.fileType.includes('image')) {
                // IMAGE VIEW
                viewerHtml = `
            <div class="relative inline-block border-8 border-slate-50 rounded-xl overflow-hidden shadow-2xl" oncontextmenu="return false;">
                <img src="${c.fileData}" class="max-w-full h-auto pointer-events-none">
                <div class="absolute inset-0 bg-transparent"></div>
            </div>`;
            } else if (c.fileType.includes('pdf')) {
                // PDF VIEW
                viewerHtml = `<iframe src="${c.fileData}" class="w-full h-[70vh] rounded-xl border-none"></iframe>`;
            } else {
                // WORD / OTHER DOCS
                viewerHtml = `
            <div class="p-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 text-center">
                <i class="fas fa-file-word text-6xl text-blue-500 mb-4"></i>
                <p class="text-slate-600 font-bold">Document Format: ${c.fileName}</p>
                <p class="text-slate-400 text-sm mt-2">Browser preview is not available for Word files.</p>
               
            </div>`;
            }

            content.innerHTML = `
        <div class="text-center">
            <h2 class="text-2xl font-black text-slate-900 mb-2">${c.title}</h2>
            <p class="text-slate-500 mb-8 uppercase text-xs font-bold">${c.issuer} | ${c.date}</p>
            ${viewerHtml}
        </div>
    `;
            modal.classList.remove('hidden');
        }

       

        function deleteCert(index) {
            if (confirm("🗑️ Delete this certificate?")) {
                certs.splice(index, 1);
                localStorage.setItem('myCerts', JSON.stringify(certs));

                // CHANGE THIS LINE:
                renderAll(); // This refreshes BOTH Main and Duplicate sections
            }
        }
        // Start the system
        document.addEventListener('DOMContentLoaded', () => {
            console.log("DOM Ready. Starting Render...");
            renderAll();
        });
        // This ensures that as soon as the website opens, the "All" category is rendered.
        document.addEventListener('DOMContentLoaded', () => {
            renderProjects('All');
        });



