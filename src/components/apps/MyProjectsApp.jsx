import React, { useMemo, useState } from 'react';
import { ExternalLink, Folder } from 'lucide-react';
import { portfolioData } from '../../data/portfolioData';
import cvsuEnrollmentDashboard from '../../assets/projects/cvsu-enrollment-dashboard.svg';
import cvsuEnrollmentForm from '../../assets/projects/cvsu-enrollment-form.svg';
import freelanceSitesHome from '../../assets/projects/freelance-sites-home.svg';
import freelanceSitesMobile from '../../assets/projects/freelance-sites-mobile.svg';
import petSosMap from '../../assets/projects/petsos-map.svg';
import petSosReport from '../../assets/projects/petsos-report.svg';
import foodEcommerceStorefront from '../../assets/projects/food-ecommerce-storefront.svg';
import foodEcommerceCart from '../../assets/projects/food-ecommerce-cart.svg';
import adventureQuestLevel from '../../assets/projects/adventure-quest-level.svg';
import adventureQuestEditor from '../../assets/projects/adventure-quest-editor.svg';

const getProjectLinks = (project) => {
  if (project.title.includes('Freelance')) {
    return [
      { label: 'Magnaval Services', url: 'https://magnavalservices.com' },
      { label: 'Warduz Pet Shop', url: 'https://warduzpetshop.com' },
    ];
  }

  if (project.title.includes('Adventure Quest')) {
    return [{ label: 'Request Game Walkthrough', url: `mailto:${portfolioData.contacts.email}?subject=Adventure%20Quest` }];
  }

  if (project.title.includes('PetSOS')) {
    return [{ label: 'Request Thesis Demo', url: `mailto:${portfolioData.contacts.email}?subject=PetSOS%20Demo` }];
  }

  return [{ label: 'Open GitHub Profile', url: portfolioData.contacts.github }];
};

const PROJECT_GALLERIES = {
  'CvSU Enrollment System (2024)': [
    { src: cvsuEnrollmentDashboard, title: 'Dashboard view', detail: 'Admissions overview with cards, summaries, and API-driven panels.' },
    { src: cvsuEnrollmentForm, title: 'Enrollment form', detail: 'Sectioned student intake flow with validation-friendly form fields.' },
  ],
  'Freelance Web Developer (2025)': [
    { src: freelanceSitesHome, title: 'Client landing page', detail: 'Service-focused homepage with clear calls to action and brand sections.' },
    { src: freelanceSitesMobile, title: 'Responsive mobile preview', detail: 'Phone and tablet layouts tuned for client browsing on smaller screens.' },
  ],
  'PetSOS (Thesis)': [
    { src: petSosMap, title: 'Rescue map', detail: 'Geolocation pins and volunteer awareness for active rescue reports.' },
    { src: petSosReport, title: 'Report workflow', detail: 'Incident intake screen for rescue details, contact data, and urgency.' },
  ],
  'Food Ecommerce': [
    { src: foodEcommerceStorefront, title: 'Storefront', detail: 'Product browsing with category grouping and reusable product cards.' },
    { src: foodEcommerceCart, title: 'Cart and checkout', detail: 'Order summary, purchase totals, and clearer purchase flow states.' },
  ],
  'Adventure Quest': [
    { src: adventureQuestLevel, title: 'Gameplay level', detail: 'Platforming scene with enemies, jumps, and collectible routes.' },
    { src: adventureQuestEditor, title: 'Level editor', detail: 'Scene-building workflow used to block out and test game spaces.' },
  ],
};

const getProjectShots = (project) => PROJECT_GALLERIES[project.title] || [];

export default function MyProjectsApp() {
  const { projects } = portfolioData;
  const [activeProjectTitle, setActiveProjectTitle] = useState(projects[0]?.title ?? '');
  const activeProject = useMemo(
    () => projects.find((project) => project.title === activeProjectTitle) ?? projects[0],
    [activeProjectTitle, projects],
  );

  return (
    <div className="flex h-full flex-col font-['Tahoma'] select-none">
      <div className="flex items-center space-x-2 border-b border-[#aca899] bg-[#ece9d8] p-1">
        <span className="pl-1 text-sm text-gray-500">Address</span>
        <div className="flex flex-1 items-center border border-[#aca899] bg-white px-2 py-[2px] text-sm shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]">
          <Folder size={14} className="mr-1 inline-block text-[#f1ca4b]" fill="#f1ca4b" /> My Projects\{activeProject?.title || 'Folder'}
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-[220px_minmax(0,1fr)] overflow-hidden">
        <aside className="overflow-y-auto border-r border-[#a8b9da] bg-gradient-to-b from-[#7492ea] to-[#4567c9] p-2">
          <div className="rounded-tl-sm rounded-tr-sm border border-blue-400 bg-white p-1 text-sm font-bold text-[#00136b] shadow-sm">Project Folders</div>
          <div className="border border-t-0 border-blue-400 bg-[#d3e5fa] p-2 text-xs text-[#00136b]">
            Select a folder to view screenshots, stack, details, and links.
          </div>

          <div className="mt-3 space-y-2">
            {projects.map((project) => (
              <button
                key={project.title}
                type="button"
                onClick={() => setActiveProjectTitle(project.title)}
                className={`flex w-full items-start gap-3 rounded border px-3 py-3 text-left shadow-[inset_1px_1px_0_rgba(255,255,255,0.75)] ${project.title === activeProject?.title ? 'border-[#3157a5] bg-[#f7fbff]' : 'border-[#8ea8de] bg-[#e7f0ff] hover:bg-[#f7fbff]'}`}
              >
                <Folder size={30} className="mt-0.5 text-[#f1ca4b]" fill="#f8d775" />
                <div className="min-w-0">
                  <div className="text-[12px] font-bold text-[#163b89]">{project.title}</div>
                  <div className="mt-1 text-[10px] text-[#556b8f]">{project.status}</div>
                </div>
              </button>
            ))}
          </div>
        </aside>

        <main className="overflow-y-auto bg-white p-4">
          {activeProject && (
            <div className="space-y-4">
              <section className="rounded border border-[#c8d4e8] bg-[#fbfdff] p-4 shadow-[inset_1px_1px_rgba(255,255,255,0.85)]">
                <div className="flex items-start gap-3">
                  <Folder size={42} className="text-[#f1ca4b]" fill="#f8d775" />
                  <div>
                    <h3 className="text-[18px] font-bold text-[#003399]">{activeProject.title}</h3>
                    <p className="mt-1 text-[12px] text-[#5c6b84]">{activeProject.status}</p>
                    <p className="mt-3 text-[13px] leading-6 text-[#25354d]">{activeProject.summary}</p>
                  </div>
                </div>
              </section>

              <section className="rounded border border-[#c8d4e8] bg-[#fbfdff] p-4 shadow-[inset_1px_1px_rgba(255,255,255,0.85)]">
                <div className="mb-3 text-[14px] font-bold text-[#003399]">Screenshots</div>
                <div className="grid gap-3 md:grid-cols-3">
                  {getProjectShots(activeProject).map((shot, index) => (
                    <div key={`${activeProject.title}-${shot.title}-${index}`} className="overflow-hidden rounded border border-[#bcd0f2] bg-[#eff5ff] shadow-[inset_1px_1px_rgba(255,255,255,0.9)]">
                      <div className="aspect-[4/3] bg-[#d8e6ff]">
                        <img src={shot.src} alt={shot.title} className="h-full w-full object-cover" />
                      </div>
                      <div className="px-3 py-2">
                        <div className="text-[11px] font-bold text-[#214ea5]">{shot.title}</div>
                        <div className="mt-1 text-[10px] leading-4 text-[#506482]">{shot.detail}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_260px]">
                <section className="rounded border border-[#c8d4e8] bg-[#fbfdff] p-4 shadow-[inset_1px_1px_rgba(255,255,255,0.85)]">
                  <div className="mb-3 text-[14px] font-bold text-[#003399]">Stack</div>
                  <div className="flex flex-wrap gap-2">
                    {activeProject.stack.map((item) => (
                      <span key={item} className="rounded border border-[#b7c9e8] bg-[#eef4ff] px-2 py-1 text-xs text-[#003399]">
                        {item}
                      </span>
                    ))}
                  </div>
                </section>

                <section className="rounded border border-[#c8d4e8] bg-[#fbfdff] p-4 shadow-[inset_1px_1px_rgba(255,255,255,0.85)]">
                  <div className="mb-3 text-[14px] font-bold text-[#003399]">Links</div>
                  <div className="space-y-2">
                    {getProjectLinks(activeProject).map((link) => (
                      <button
                        key={link.label}
                        type="button"
                        onClick={() => window.open(link.url, '_blank', 'noopener,noreferrer')}
                        className="flex w-full items-center justify-between rounded border border-[#b9caea] bg-white px-3 py-2 text-left text-[11px] text-[#214ea5] hover:bg-[#eef4ff]"
                      >
                        <span>{link.label}</span>
                        <ExternalLink size={13} />
                      </button>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}