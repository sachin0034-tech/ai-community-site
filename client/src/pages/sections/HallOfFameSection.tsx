import React, { useState } from "react";
import { Trophy, ChevronDown } from "lucide-react";

interface WinnerImage {
  imgelink: string;
}

interface CohortData {
  cohortNumber: string;
  images: WinnerImage[];
}

export const HallOfFameSection = (): JSX.Element => {
  const cohorts: CohortData[] = [
    {
      cohortNumber: "6",
      images: [
        { imgelink: "/figmaAssets/Cohort60.png" },
        { imgelink: "/figmaAssets/Cohort61.png" },
        { imgelink: "/figmaAssets/Cohort63.png" },
        { imgelink: "/figmaAssets/Cohort64.png" },
      ],
    },
    // Add more cohorts here as needed
    // {
    //   cohortNumber: "7",
    //   images: [
    //     { imgelink: "/figmaAssets/Cohort70.png" },
    //     { imgelink: "/figmaAssets/Cohort71.png" },
    //   ],
    // },
  ];

  const [selectedCohort, setSelectedCohort] = useState<string>("6");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const currentCohort = cohorts.find((c) => c.cohortNumber === selectedCohort) || cohorts[0];
  const currentImages = currentCohort.images;

  return (
    <section className="w-full py-12 lg:py-16 bg-gradient-to-br from-white to-orange-50 px-4">
      <div className="mx-auto max-w-7xl">
        {/* Header with Title and Dropdown */}
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-orange-500" />
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
              Hall of Fame
            </h2>
          </div>
          
          {/* Cohort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-orange-300 rounded-lg shadow-md hover:border-orange-500 transition-colors font-semibold text-gray-900 min-w-[150px]"
            >
              <span>Cohort {selectedCohort}</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setIsDropdownOpen(false)}
                ></div>
                <div className="absolute right-0 mt-2 bg-white border-2 border-orange-300 rounded-lg shadow-xl z-20 min-w-[150px]">
                  {cohorts.map((cohort) => (
                    <button
                      key={cohort.cohortNumber}
                      onClick={() => {
                        setSelectedCohort(cohort.cohortNumber);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 hover:bg-orange-50 transition-colors font-medium ${
                        selectedCohort === cohort.cohortNumber
                          ? "bg-orange-100 text-orange-600 border-l-4 border-orange-500"
                          : "text-gray-700"
                      }`}
                    >
                      Cohort {cohort.cohortNumber}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Image Gallery - 2x2 Grid */}
        <div className="grid grid-cols-2 gap-4 lg:gap-6">
          {currentImages.map((item, index) => (
            <div
              key={index}
              className="relative rounded-2xl overflow-hidden shadow-lg ring-2 ring-gray-200"
            >
              {/* Image Container with Gradient Background */}
              <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 p-3 lg:p-4 aspect-square">
                <img
                  src={item.imgelink}
                  className="w-full h-full object-contain"
                  alt={`Hall of Fame image ${index + 1}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

