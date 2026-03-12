class A{constructor(t={}){this.order=t.order||"desc",this.page=t.currentPage||1,this.totalPages=t.totalPages||1,this.projects=[],this.isLoading=!1,this.initLoader(),this.init()}init(){this.setupNavigationEvents(),this.updateNavigationButtons(),this.categoriesEvents()}categoriesEvents(){document.querySelectorAll(".projects-filters__dropdown-item").forEach(e=>{e.addEventListener("click",async r=>{r.preventDefault();const o=e.getAttribute("data-handle");o&&(window.location.href=`/projects?category=${o}`)})})}setupNavigationEvents(){const t=()=>{const e=document.querySelector(".projects-navigation-btn-prev"),r=document.querySelector(".projects-navigation-btn-next");e&&r?(e.addEventListener("click",o=>{o.preventDefault(),this.prevPage()}),r.addEventListener("click",o=>{o.preventDefault(),this.nextPage()})):setTimeout(t,100)};t()}initLoader(){if(!document.querySelector(".projects-loader")){const t=document.querySelector(".projects-grid");if(t){const e=this.createLoader();t.parentElement.insertBefore(e,t)}}}createLoader(){const t=document.createElement("div");return t.className="projects-loader",t.style.cssText=`
            display: none;
            text-align: center;
            padding: 40px 20px;
            width: 100%;
            margin-Top: 100px;
        `,t.innerHTML=`
            <div class="projects-loader__spinner">
                <svg class="projects-loader__icon" width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="20" cy="20" r="18" stroke="#009CA8" stroke-width="4" stroke-linecap="round" stroke-dasharray="28 28" opacity="0.3"/>
                    <circle cx="20" cy="20" r="18" stroke="#009CA8" stroke-width="4" stroke-linecap="round" stroke-dasharray="28 28">
                        <animateTransform 
                            attributeName="transform" 
                            type="rotate" 
                            values="0 20 20;360 20 20" 
                            dur="1s" 
                            repeatCount="indefinite"/>
                    </circle>
                </svg>
            </div>
            <p class="projects-loader__text" style="
                margin-top: 16px;
                font-size: 16px;
                color: #666;
                font-weight: 500;
            ">Loading projects...</p>
        `,t}showLoader(){this.isLoading=!0;const t=document.querySelector(".projects-loader"),e=document.querySelector(".projects-grid");e.innerHTML="",t&&(t.style.display="block"),e&&(e.style.opacity="0.5",e.style.pointerEvents="none")}hideLoader(){this.isLoading=!1;const t=document.querySelector(".projects-loader"),e=document.querySelector(".projects-grid");t&&(t.style.display="none"),e&&(e.style.opacity="1",e.style.pointerEvents="auto")}async sortByMostRecent(){this.isLoading||(this.order="desc",this.page=1,this.updateFilterButtons("recent"),await this.loadProjects())}async sortByOldest(){this.isLoading||(this.order="asc",this.page=1,this.updateFilterButtons("oldest"),await this.loadProjects())}updateFilterButtons(t){document.querySelectorAll(".projects-filters__item").forEach(r=>{r.getAttribute("data-filter")===t?r.classList.add("--is-active"):r.classList.remove("--is-active")})}async loadProjects(){if(!this.isLoading){this.showLoader();try{const t=await fetch(`/api/projects?order=${this.order}&page=${this.page}`);if(!t.ok)throw new Error(`HTTP error! status: ${t.status}`);const e=await t.json();this.totalPages=e.totalPages||e.total_pages||1,this.renderProjects(e.data||e.projects||e),this.updateNavigationButtons()}catch(t){console.error("Error fetching projects:",t),this.showError("Failed to load projects. Please try again.")}finally{this.hideLoader()}}}nextPage(){this.isLoading||this.page>=this.totalPages||(this.page++,this.loadProjects())}prevPage(){this.isLoading||this.page<=1||(this.page--,this.loadProjects())}updateNavigationButtons(){const t=document.querySelector(".projects-navigation-btn-prev"),e=document.querySelector(".projects-navigation-btn-next");t&&(this.page<=1?(t.classList.add("disabled"),t.setAttribute("disabled","true")):(t.classList.remove("disabled"),t.removeAttribute("disabled"))),e&&(this.page>=this.totalPages?(e.classList.add("disabled"),e.setAttribute("disabled","true")):(e.classList.remove("disabled"),e.removeAttribute("disabled")))}showError(t){const e=document.querySelector(".projects-grid");e&&(e.innerHTML=`
                <div class="projects-error" style="
                    text-align: center;
                    padding: 40px 20px;
                    color: #dc3545;
                    font-size: 16px;
                    grid-column: 1 / -1;
                ">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 16px;">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="15" y1="9" x2="9" y2="15"></line>
                        <line x1="9" y1="9" x2="15" y2="15"></line>
                    </svg>
                    <p style="margin: 0; font-weight: 500;">${t}</p>
                    <button onclick="window.projectsFilters.loadProjects()" style="
                        margin-top: 16px;
                        padding: 8px 16px;
                        background-color: #009CA8;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 14px;
                    ">Try Again</button>
                </div>
            `)}renderProjects(t){var r,o,a,n,c,d,l,p,g,u,h,j,f,v,_,y,w,m,x,L,k,P,b;const e=document.querySelector(".projects-grid");e.innerHTML="";for(const s of t){const B=`
                <div class="projects-grid__item" data-date="${((a=(o=(r=s.acf)==null?void 0:r.project_details)==null?void 0:o.project_date)==null?void 0:a.start_year)||"Unknown"}" onclick="location.href='/projects/${s.slug||"#"}'" style="cursor: pointer;">
                    <!-- image  -->
                    <div class="projects-grid__image">
                        <img src="${(n=s.acf)==null?void 0:n.featured_image}" 
                             alt="UPTOWN project image" loading="lazy" />
                    </div>

                    <!-- tags  -->
                    <div class="projects__tags">
                        <div class="projects__tag projects__tag-duration">
                            <svg class="projects__tag-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                viewBox="0 0 20 20" fill="none">
                                <g clip-path="url(#clip0_852_213)">
                                    <path
                                        d="M9.99984 4.99984V9.99984L13.3332 11.6665M18.3332 9.99984C18.3332 14.6022 14.6022 18.3332 9.99984 18.3332C5.39746 18.3332 1.6665 14.6022 1.6665 9.99984C1.6665 5.39746 5.39746 1.6665 9.99984 1.6665C14.6022 1.6665 18.3332 5.39746 18.3332 9.99984Z"
                                        stroke="#009CA8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_852_213">
                                        <rect width="20" height="20" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                            <span class="projects__tag-text">
                                ${((l=(d=(c=s.acf)==null?void 0:c.project_details)==null?void 0:d.project_duration)==null?void 0:l.duration_value)||"N/A"} 
                                ${((u=(g=(p=s.acf)==null?void 0:p.project_details)==null?void 0:g.project_duration)==null?void 0:u.duration_unit)||""}
                            </span>
                        </div>

                        <div class="projects__tag projects__tag-cost">
                            <svg class="projects__tag-icon" xmlns="http://www.w3.org/2000/svg" width="21" height="21"
                                viewBox="0 0 21 21" fill="none">
                                <path
                                    d="M6.125 6.125H6.13375M18.0162 11.7337L11.7425 18.0075C11.58 18.1702 11.387 18.2993 11.1745 18.3874C10.9621 18.4754 10.7344 18.5207 10.5044 18.5207C10.2744 18.5207 10.0467 18.4754 9.83423 18.3874C9.62178 18.2993 9.42878 18.1702 9.26625 18.0075L1.75 10.5V1.75H10.5L18.0162 9.26625C18.3422 9.59413 18.5251 10.0377 18.5251 10.5C18.5251 10.9623 18.3422 11.4059 18.0162 11.7337Z"
                                    stroke="#009CA8" stroke-width="1.575" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            <span class="projects__tag-text">
                                ${((f=(j=(h=s.acf)==null?void 0:h.project_details)==null?void 0:j.project_budget)==null?void 0:f.amount)||"N/A"} 
                                ${((y=(_=(v=s.acf)==null?void 0:v.project_details)==null?void 0:_.project_budget)==null?void 0:y.unit)||""}
                            </span>
                        </div>
                    </div>

                    <!-- info  -->
                    <div class="projects-grid__info">
                        <div class="projects-grid__info-top">
                            <span class="projects-grid__info-date">
                                ${((x=(m=(w=s.acf)==null?void 0:w.project_details)==null?void 0:m.project_date)==null?void 0:x.start_year)||"Unknown"} - 
                                ${((P=(k=(L=s.acf)==null?void 0:L.project_details)==null?void 0:k.project_date)==null?void 0:P.end_year)||"Present"}
                            </span>
                            <a href="/projects/${s.slug||"#"}" class="projects-grid__info-link">
                                <span class="projects-grid__info-icon"></span>
                                <span class="projects-grid__info-text">View project</span>
                            </a>
                        </div>

                        <div class="projects-grid__info-title">${((b=s.title)==null?void 0:b.rendered)||s.title||"Untitled Project"}</div>
                    </div>
                </div>
            `;e.insertAdjacentHTML("beforeend",B)}}}document.addEventListener("alpine:init",()=>{Alpine.data("projectsFilters",(i={})=>{const t=new A(i);return window.projectsFilters=t,t})});
