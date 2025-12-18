import React, { useState, useEffect } from "react";
import { Heart, Video, FileText, ExternalLink, Sparkles, User, Smile, Flame } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://ai-community-site.onrender.com/api';

interface Project {
  _id: string;
  name: string;
  projectName: string;
  projectDescription: string;
  linkedProfile?: string;
  videoLink?: string;
  deployedLink?: string;
  instructionDocumentLink?: string;
  backgroundImage?: {
    url: string;
    filename: string;
  };
  categories: string[];
  tools: string[];
  rating: number;
  createdBy: {
    _id: string;
    email: string;
    name?: string;
  };
  status: string;
  publishedAt: string;
}

interface ShowProjectsProps {
  onViewProject: (projectId: string) => void;
}

const ShowProjects: React.FC<ShowProjectsProps> = ({ onViewProject }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchProjects = async (page: number = 1) => {
    console.log("🔍 Fetching public projects - Page:", page);

    try {
      setLoading(true);
      setError(null);

      const url = `${API_BASE_URL}/projects?page=${page}&limit=12&status=published`;
      console.log("🌐 Fetching from URL:", url);

      const response = await fetch(url);

      console.log("📡 Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Response not OK:", errorText);
        throw new Error(
          `Failed to fetch projects: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("📡 Response data:", data);

      if (data.success) {
        console.log(
          "✅ Projects fetched successfully:",
          data.data.length,
          "projects"
        );
        setProjects(data.data);
        setTotalPages(data.pagination.pages);
        setCurrentPage(data.pagination.current);
      } else {
        throw new Error(data.message || "Failed to fetch projects");
      }
    } catch (error: any) {
      console.error("💥 Error fetching projects:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const truncateDescription = (description: string, wordLimit: number = 20) => {
    const words = description.split(" ");
    if (words.length <= wordLimit) return description;
    return words.slice(0, wordLimit).join(" ") + "...";
  };

  const handleLinkClick = (url?: string) => {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="py-16 bg-white w-full">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Explore AI Agents
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover amazing AI agents and automation projects created by our
            community. Find inspiration and explore cutting-edge solutions.
          </p>
        </div>

        {/* Agents Grid Section */}
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E75A55] mx-auto mb-4"></div>
              <p className="text-gray-700">Loading amazing agents...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-red-700 mb-2">
              Error Loading Agents
            </h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => fetchProjects()}
              className="px-6 py-3 bg-[#E75A55] text-white rounded-2xl hover:bg-red-600 transition-colors font-medium"
            >
              Try Again
            </button>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-300 text-8xl mb-4">🤖</div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              No Agents Available
            </h3>
            <p className="text-gray-600">
              Check back soon for amazing AI agents and automation projects!
            </p>
          </div>
        ) : (
          <>
            {/* Game-style Cards Grid - 3 cards per row max */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {projects.map((project) => {
                return (
                  <div
                    key={project._id}
                    className="bg-gradient-to-br from-white to-orange-50 rounded-xl shadow-lg w-full min-w-0 overflow-hidden relative hover:shadow-2xl transition-all duration-300 flex flex-col border border-orange-100 h-full"
                  >
                    {/* Image Section with Badges */}
                    <div className="relative h-56 overflow-hidden flex-shrink-0">
                      {/* Badges - Top Left (Commented out for now) */}
                      {/* <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                        {isHot && (
                          <div className="bg-red-500 text-white px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-lg">
                            <Flame className="w-3 h-3" />
                            <span>Hot</span>
                          </div>
                        )}
                        {isCreatorsLove && (
                          <div className="bg-green-500 text-white px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-lg">
                            <Smile className="w-3 h-3" />
                            <span>Creators Love</span>
                          </div>
                        )}
                      </div> */}

                      {/* Project Image */}
                      {project.backgroundImage?.url ? (
                        <img
                          src={`${API_BASE_URL.replace('/api', '')}${project.backgroundImage.url}`}
                          alt={project.projectName}
                          className="w-full h-full object-cover"
                          crossOrigin="anonymous"
                          onError={(e) => {
                            const imageUrl = project.backgroundImage?.url;
                            console.log(
                              "❌ Public image failed to load:",
                              imageUrl ? `${API_BASE_URL.replace('/api', '')}${imageUrl}` : 'unknown'
                            );
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                            const fallback = target.parentElement
                              ?.nextElementSibling as HTMLElement;
                            if (fallback) fallback.classList.remove("hidden");
                          }}
                          onLoad={() => {
                            const imageUrl = project.backgroundImage?.url;
                            console.log(
                              "✅ Public image loaded successfully:",
                              imageUrl ? `${API_BASE_URL.replace('/api', '')}${imageUrl}` : 'unknown'
                            );
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                          <Sparkles className="w-16 h-16 text-orange-400" />
                        </div>
                      )}
                    </div>

                    {/* Card Body - Light Theme with flexible layout */}
                    <div className="p-4 flex-1 flex flex-col min-h-0">
                      {/* Project Title - Complete, no line clamp */}
                      <h2 className="text-xl font-bold text-gray-900 mb-3 leading-tight flex-shrink-0">
                        {project.projectName}
                      </h2>

                      {/* Creator - Avatar with "by" */}
                      <div className="mb-3 flex items-center gap-2 flex-shrink-0">
                        <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-orange-300">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-gray-600 text-sm">
                          by <span className="font-medium text-gray-800">{project.name || project.createdBy.email.split("@")[0]}</span>
                        </span>
                      </div>

                      {/* Description - Flexible, fills remaining space automatically */}
                      <div className="mb-4 flex-1 overflow-hidden min-h-0">
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-[6]">
                          {project.projectDescription}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Button - Orange theme */}
                    <div className="px-4 pb-4 flex-shrink-0">
                      <button
                        onClick={() => onViewProject(project._id)}
                        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <span>View Project</span>
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination - Centered after 4 rows */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-3 mt-12 mb-8">
                <button
                  onClick={() => fetchProjects(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                    currentPage === 1
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-orange-500 text-white hover:bg-orange-600 shadow-md hover:shadow-lg"
                  }`}
                >
                  Previous
                </button>

                <div className="flex space-x-2">
                  {(() => {
                    const pages = [];
                    const maxVisible = 5;
                    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
                    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
                    
                    if (endPage - startPage < maxVisible - 1) {
                      startPage = Math.max(1, endPage - maxVisible + 1);
                    }

                    for (let i = startPage; i <= endPage; i++) {
                      pages.push(i);
                    }

                    return pages.map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => fetchProjects(pageNum)}
                        className={`w-10 h-10 rounded-lg font-medium transition-all duration-200 ${
                          currentPage === pageNum
                            ? "bg-orange-500 text-white shadow-md"
                            : "bg-white text-gray-700 hover:bg-orange-50 border border-gray-200 hover:border-orange-300"
                        }`}
                      >
                        {pageNum}
                      </button>
                    ));
                  })()}
                </div>

                <button
                  onClick={() => fetchProjects(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                    currentPage === totalPages
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-orange-500 text-white hover:bg-orange-600 shadow-md hover:shadow-lg"
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ShowProjects;
