class m{constructor(e={}){this.order=e.order||"desc",this.page=e.currentPage||1,this.totalPages=e.totalPages||1,this.defaultBlogImage=e.defaultBlogImage||"/img/blog/default.webp",this.isLoading=!1,this.selectedCategories={project:!1,"new-tech":!1},e.categories&&e.categories.split(",").map(s=>s.trim()).filter(Boolean).forEach(s=>{this.selectedCategories.hasOwnProperty(s)&&(this.selectedCategories[s]=!0)}),this.search=e.search||"",this.initLoader(),this.init()}init(){this.setupNavigationEvents(),this.updateNavigationButtons(),this.setupSortEvents()}setupSortEvents(){const e=document.getElementById("new"),t=document.getElementById("old");e&&e.addEventListener("change",async()=>{e.checked&&await this.sortByMostRecent()}),t&&t.addEventListener("change",async()=>{t.checked&&await this.sortByOldest()});const s=document.getElementById("project"),i=document.getElementById("tech"),o=document.getElementById("all-news"),n=async r=>{r&&r.target===o?o.checked&&(s&&(s.checked=!1),i&&(i.checked=!1),this.selectedCategories={project:!1,"new-tech":!1}):(o&&(o.checked=!1),this.selectedCategories.project=!!(s&&s.checked),this.selectedCategories["new-tech"]=!!(i&&i.checked)),this.page=1,await this.loadPosts()};s&&s.addEventListener("change",n),i&&i.addEventListener("change",n),o&&o.addEventListener("change",n);const d=document.getElementById("search");if(d){let r;d.addEventListener("input",()=>{clearTimeout(r),r=setTimeout(async()=>{this.search=d.value.trim(),this.page=1,await this.loadPosts()},500)})}}setupNavigationEvents(){const e=()=>{const t=document.querySelector(".projects-navigation-btn-prev"),s=document.querySelector(".projects-navigation-btn-next");t&&s?(t.addEventListener("click",i=>{i.preventDefault(),this.prevPage()}),s.addEventListener("click",i=>{i.preventDefault(),this.nextPage()})):setTimeout(e,100)};e()}initLoader(){if(!document.querySelector(".projects-loader")){const e=document.querySelector(".posts-grid");if(e){const t=this.createLoader();e.parentElement.insertBefore(t,e)}}}createLoader(){const e=document.createElement("div");return e.className="projects-loader",e.style.cssText=`
            display: none;
            text-align: center;
            padding: 40px 20px;
            width: 100%;
            margin-Top: 100px;
        `,e.innerHTML=`
            <div class="projects-loader__spinner">
                <svg class="projects-loader__icon" width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="20" cy="20" r="18" stroke="#bb9c46" stroke-width="4" stroke-linecap="round" stroke-dasharray="28 28" opacity="0.3"/>
                    <circle cx="20" cy="20" r="18" stroke="#bb9c46" stroke-width="4" stroke-linecap="round" stroke-dasharray="28 28">
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
            ">Loading posts...</p>
        `,e}showLoader(){this.isLoading=!0;const e=document.querySelector(".projects-loader"),t=document.querySelector(".posts-grid");t&&(t.innerHTML=""),e&&(e.style.display="block"),t&&(t.style.opacity="0.5",t.style.pointerEvents="none")}hideLoader(){this.isLoading=!1;const e=document.querySelector(".projects-loader"),t=document.querySelector(".posts-grid");e&&(e.style.display="none"),t&&(t.style.opacity="1",t.style.pointerEvents="auto")}async sortByMostRecent(){this.isLoading||(this.order="desc",this.page=1,await this.loadPosts())}async sortByOldest(){this.isLoading||(this.order="asc",this.page=1,await this.loadPosts())}async loadPosts(){if(!this.isLoading){this.showLoader();try{const e=Object.keys(this.selectedCategories).filter(o=>this.selectedCategories[o]).join(","),t=new URLSearchParams;t.append("order",this.order),t.append("page",String(this.page)),e&&t.append("categories",e),this.search&&t.append("search",this.search);const s=await fetch(`/api/blog?${t.toString()}`);if(!s.ok)throw new Error(`HTTP error! status: ${s.status}`);const i=await s.json();this.totalPages=i.totalPages||i.total_pages||1,this.renderPosts(i.data||i),this.updateNavigationButtons()}catch(e){console.error("Error fetching posts:",e),this.showError("Failed to load posts. Please try again.")}finally{this.hideLoader()}}}nextPage(){this.isLoading||this.page>=this.totalPages||(this.page++,this.loadPosts())}prevPage(){this.isLoading||this.page<=1||(this.page--,this.loadPosts())}updateNavigationButtons(){const e=document.querySelector(".projects-navigation-btn-prev"),t=document.querySelector(".projects-navigation-btn-next");e&&(this.page<=1?(e.classList.add("disabled"),e.setAttribute("disabled","true")):(e.classList.remove("disabled"),e.removeAttribute("disabled"))),t&&(this.page>=this.totalPages?(t.classList.add("disabled"),t.setAttribute("disabled","true")):(t.classList.remove("disabled"),t.removeAttribute("disabled")))}showError(e){const t=document.querySelector(".posts-grid");t&&(t.innerHTML=`
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
                    <p style="margin: 0; font-weight: 500;">${e}</p>
                    <button onclick="window.blogFilters.loadPosts()" style="
                        margin-top: 16px;
                        padding: 8px 16px;
                        background-color: #bb9c46;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 14px;
                    ">Try Again</button>
                </div>
            `)}renderPosts(e){var s,i,o,n,d,r,l;const t=document.querySelector(".posts-grid");if(t){if(t.innerHTML="",!e||e.length===0){t.innerHTML=`
                <div class="posts-heading" style="text-align: center; grid-column: 1 / -1;">
                    No posts found.
                </div>
            `;return}for(const a of e){const h=((o=(i=(s=a._embedded)==null?void 0:s["wp:featuredmedia"])==null?void 0:i[0])==null?void 0:o.source_url)||this.defaultBlogImage,g=((n=a.acf)==null?void 0:n.time)||"",p=((d=a.acf)==null?void 0:d.budget)||"",u=((r=a.acf)==null?void 0:r.year_range)||"",f=((l=a.title)==null?void 0:l.rendered)||a.title||"Untitled Post",v=`
                <a href="/blog/${a.slug||"#"}" class="posts-grid__link">
                    <div class="posts-grid__item" data-date="">
                        <div class="posts-grid__image">
                            <img src="${h}" alt="UPTOWN project image" loading="lazy" />
                        </div>

                        <div class="posts__tags">
                            ${g?`
                            <div class="posts__tag posts__tag-duration">
                              <svg class="posts__tag-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <g clip-path="url(#clip0_852_213)">
                                  <path d="M9.99984 4.99984V9.99984L13.3332 11.6665M18.3332 9.99984C18.3332 14.6022 14.6022 18.3332 9.99984 18.3332C5.39746 18.3332 1.6665 14.6022 1.6665 9.99984C1.6665 5.39746 5.39746 1.6665 9.99984 1.6665C14.6022 1.6665 18.3332 5.39746 18.3332 9.99984Z" stroke="#bb9c46" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                </g>
                                <defs>
                                  <clipPath id="clip0_852_213"><rect width="20" height="20" fill="white" /></clipPath>
                                </defs>
                              </svg>
                              <span class="posts__tag-text">${g}</span>
                            </div>`:""}

                            ${p?`
                            <div class="posts__tag posts__tag-cost">
                              <svg class="posts__tag-icon" xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
                                <path d="M6.125 6.125H6.13375M18.0162 11.7337L11.7425 18.0075C11.58 18.1702 11.387 18.2993 11.1745 18.3874C10.9621 18.4754 10.7344 18.5207 10.5044 18.5207C10.2744 18.5207 10.0467 18.4754 9.83423 18.3874C9.62178 18.2993 9.42878 18.1702 9.26625 18.0075L1.75 10.5V1.75H10.5L18.0162 9.26625C18.3422 9.59413 18.5251 10.0377 18.5251 10.5C18.5251 10.9623 18.3422 11.4059 18.0162 11.7337Z" stroke="#bb9c46" stroke-width="1.575" stroke-linecap="round" stroke-linejoin="round" />
                              </svg>
                              <span class="posts__tag-text">${p}</span>
                            </div>`:""}
                        </div>

                        <div class="posts-grid__info">
                          <div class="posts-grid__info-top">
                            <span class="posts-grid__info-date">${u}</span>
                            <div class="posts-grid__info-title">${f}</div>
                          </div>

                          <span class="posts-grid__info-link">
                            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <rect x="0.707107" y="20" width="27.2843" height="27.2843" transform="rotate(-45 0.707107 20)" fill="#bb9c46" stroke="#bb9c46" />
                              <g clip-path="url(#clip0_3225_271)">
                                <path d="M13.0704 19.7109H26.3554M26.3554 19.7109L21.3735 14.729M26.3554 19.7109L21.3735 24.6928" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                              </g>
                              <defs>
                                <clipPath id="clip0_3225_271"><rect width="18.7879" height="18.7879" fill="white" transform="translate(19.7129 6.42578) rotate(45)" /></clipPath>
                              </defs>
                            </svg>

                          </span>

                        </div>
                    </div>
                </a>
            `;t.insertAdjacentHTML("beforeend",v)}}}}document.addEventListener("alpine:init",()=>{Alpine.data("blogFilters",(c={})=>{const e=new m(c);return window.blogFilters=e,e})});
