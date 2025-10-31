

export default function Process() {
    return (
        <section className="w-full max-w-5xl mx-auto py-16 px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 text-center">Our Proven Process</h2>
        <p className="text-gray-700 text-base sm:text-lg mb-10 text-center max-w-xl mx-auto">
          From registration to project completion
        </p>
        <div className="flex flex-col gap-10">
          {/* Step 1 */}
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-gray-900 text-yellow-400 font-bold text-2xl w-12 h-12 flex items-center justify-center rounded-full border-4 border-yellow-400 step-circle">1</div>
                <h3 className="font-bold text-xl text-gray-900">Registration & Verification</h3>
              </div>
              <p className="text-gray-700 mb-4">
                Choose your role category (Individual, Cooperative, Government) and user type (Landowner, Investor/Developer, Mandate). Our team verifies all entities to ensure credibility and capacity.
              </p>
              <ul className="mb-4 space-y-2 text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="text-yellow-500">&#10003;</span>
                  Select role category and complete profile setup
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-yellow-500">&#10003;</span>
                  Document verification for all entity types
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-yellow-500">&#10003;</span>
                  Financial and organizational capacity assessment
                </li>
              </ul>
            </div>
            <div className="flex-1">
              <div className="bg-yellow-100 rounded-xl p-6 shadow flex flex-col gap-2">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-yellow-500 rounded-lg p-2 text-white font-bold">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2h5" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </span>
                  <span className="font-bold text-gray-900 text-lg">Who Can Join?</span>
                </div>
                <p className="text-gray-700 text-sm">
                  Individuals, cooperatives, government entities, investor groups, and experienced mandates with verified credentials and capacity.
                </p>
              </div>
              <div className="bg-gray-100 rounded-xl p-6 shadow mt-6">
                <h4 className="font-bold text-gray-900 mb-2">Request Types</h4>
                <p className="text-gray-700 text-sm">
                  Submit requests for individual investments, group formations, cooperative partnerships, or government PPP projects with detailed specifications.
                </p>
              </div>
            </div>
          </div>
          {/* Step 2 */}
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-gray-900 text-yellow-400 font-bold text-2xl w-12 h-12 flex items-center justify-center rounded-full border-4 border-yellow-400 step-circle">2</div>
                <h3 className="font-bold text-xl text-gray-900">Submit Your Needs</h3>
              </div>
              <p className="text-gray-700 mb-4">
                Create detailed requests for individual partnerships, group investments, or large-scale projects. Our system matches based on entity type, capacity, and project requirements.
              </p>
              <ul className="mb-4 space-y-2 text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="text-gray-900">&#10003;</span>
                  Specify individual, group, or institutional requirements
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gray-900">&#10003;</span>
                  Set budget ranges and group size preferences
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gray-900">&#10003;</span>
                  Define partnership structure and project scale
                </li>
              </ul>
            </div>
            <div className="flex-1">
              <div className="bg-yellow-100 rounded-xl p-6 shadow flex flex-col gap-2">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-yellow-500 rounded-lg p-2 text-white font-bold">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2h5" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </span>
                  <span className="font-bold text-gray-900 text-lg">Perfect Matches</span>
                </div>
                <p className="text-gray-700 text-sm">
                  Our algorithm considers entity type, group preferences, budget alignment, project scale, and partnership structure for optimal matches.
                </p>
              </div>
            </div>
          </div>
          {/* Step 3 */}
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-yellow-400 text-gray-900 font-bold text-2xl w-12 h-12 flex items-center justify-center rounded-full border-4 border-gray-900 step-circle">3</div>
                <h3 className="font-bold text-xl text-gray-900">Smart Matching & Connection</h3>
              </div>
              <p className="text-gray-700 mb-4">
                Our system matches individuals with groups, cooperatives with investors, and government entities with qualified partners. We facilitate group formations and complex partnerships.
              </p>
              <ul className="mb-4 space-y-2 text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="text-yellow-500">&#10003;</span>
                  Smart matching across all entity types
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-yellow-500">&#10003;</span>
                  Group formation and partnership facilitation
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-yellow-500">&#10003;</span>
                  Comprehensive due diligence for all parties
                </li>
              </ul>
            </div>
            <div className="flex-1">
              <div className="bg-yellow-100 rounded-xl p-6 shadow flex flex-col gap-2">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-yellow-500 rounded-lg p-2 text-white font-bold">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2h5" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </span>
                  <span className="font-bold text-gray-900 text-lg">Perfect Matches</span>
                </div>
                <p className="text-gray-700 text-sm">
                  Our algorithm considers entity type, group preferences, budget alignment, project scale, and partnership structure for optimal matches.
                </p>
              </div>
              <div className="bg-gray-100 rounded-xl p-6 shadow mt-6">
                <h4 className="font-bold text-gray-900 mb-2">Ongoing Support</h4>
                <p className="text-gray-700 text-sm">
                  We provide specialized support for individual, group, cooperative, and government projects, ensuring successful outcomes across all partnership types.
                </p>
              </div>
            </div>
          </div>
          {/* Step 4 */}
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-yellow-400 text-gray-900 font-bold text-2xl w-12 h-12 flex items-center justify-center rounded-full border-4 border-gray-900 step-circle">4</div>
                <h3 className="font-bold text-xl text-gray-900">Project Management & Success</h3>
              </div>
              <p className="text-gray-700 mb-4">
                Joint Venture Assets manages projects from individual partnerships to large-scale government initiatives. We coordinate group investments and ensure successful outcomes for all entity types.
              </p>
              <ul className="mb-4 space-y-2 text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="text-yellow-500">&#10003;</span>
                  Specialized legal frameworks for all entity types
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-yellow-500">&#10003;</span>
                  Group coordination and milestone management
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-yellow-500">&#10003;</span>
                  Multi-party conflict resolution and mediation
                </li>
              </ul>
            </div>
            <div className="flex-1">
              <div className="bg-yellow-100 rounded-xl p-6 shadow flex flex-col gap-2">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-yellow-500 rounded-lg p-2 text-white font-bold">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2h5" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </span>
                  <span className="font-bold text-gray-900 text-lg">Perfect Matches</span>
                </div>
                <p className="text-gray-700 text-sm">
                  Our algorithm considers entity type, group preferences, budget alignment, project scale, and partnership structure for optimal matches.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
}