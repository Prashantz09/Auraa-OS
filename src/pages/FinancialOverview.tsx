import { useNavigate } from "react-router-dom";

export default function FinancialOverview() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 overflow-y-auto pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-4 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-surface-border">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400"
        >
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
          Financial Overview
        </h2>
        <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400">
          <span className="material-symbols-outlined text-2xl">more_vert</span>
        </button>
      </header>

      <div className="px-4 py-6">
        {/* Total Revenue */}
        <div className="flex flex-col items-center justify-center py-6 mb-8">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">
            Total Revenue (YTD)
          </p>
          <h1 className="text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
            रू 1,28,450
          </h1>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 dark:bg-green-500/20 text-green-700 dark:text-green-400">
            <span className="material-symbols-outlined text-sm">
              trending_up
            </span>
            <span className="text-sm font-semibold">+12% vs last year</span>
          </div>
        </div>

        {/* Monthly Revenue Chart */}
        <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 mb-8 border border-slate-200 dark:border-surface-border shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
              Monthly Revenue
            </h3>
            <span className="text-sm font-medium text-primary">
              रू 18.4k avg
            </span>
          </div>
          <div className="h-48 flex items-end justify-between gap-2 sm:gap-4">
            <div className="flex flex-col items-center gap-2 flex-1 group">
              <div className="w-full bg-primary/10 dark:bg-primary/20 rounded-t-sm relative h-24 transition-all hover:bg-primary/20 dark:hover:bg-primary/40">
                <div
                  className="absolute bottom-0 w-full bg-primary rounded-t-sm transition-all group-hover:bg-primary-light"
                  style={{ height: "65%" }}
                ></div>
              </div>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Jan
              </span>
            </div>
            <div className="flex flex-col items-center gap-2 flex-1 group">
              <div className="w-full bg-primary/10 dark:bg-primary/20 rounded-t-sm relative h-32 transition-all hover:bg-primary/20 dark:hover:bg-primary/40">
                <div
                  className="absolute bottom-0 w-full bg-primary rounded-t-sm transition-all group-hover:bg-primary-light"
                  style={{ height: "45%" }}
                ></div>
              </div>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Feb
              </span>
            </div>
            <div className="flex flex-col items-center gap-2 flex-1 group">
              <div className="w-full bg-primary/10 dark:bg-primary/20 rounded-t-sm relative h-36 transition-all hover:bg-primary/20 dark:hover:bg-primary/40">
                <div
                  className="absolute bottom-0 w-full bg-primary rounded-t-sm transition-all group-hover:bg-primary-light"
                  style={{ height: "80%" }}
                ></div>
              </div>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Mar
              </span>
            </div>
            <div className="flex flex-col items-center gap-2 flex-1 group">
              <div className="w-full bg-primary/10 dark:bg-primary/20 rounded-t-sm relative h-28 transition-all hover:bg-primary/20 dark:hover:bg-primary/40">
                <div
                  className="absolute bottom-0 w-full bg-primary rounded-t-sm transition-all group-hover:bg-primary-light"
                  style={{ height: "55%" }}
                ></div>
              </div>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Apr
              </span>
            </div>
            <div className="flex flex-col items-center gap-2 flex-1 group">
              <div className="w-full bg-primary/10 dark:bg-primary/20 rounded-t-sm relative h-32 transition-all hover:bg-primary/20 dark:hover:bg-primary/40">
                <div
                  className="absolute bottom-0 w-full bg-primary rounded-t-sm transition-all group-hover:bg-primary-light"
                  style={{ height: "70%" }}
                ></div>
              </div>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                May
              </span>
            </div>
            <div className="flex flex-col items-center gap-2 flex-1 group">
              <div className="w-full bg-primary/10 dark:bg-primary/20 rounded-t-sm relative h-40 transition-all hover:bg-primary/20 dark:hover:bg-primary/40">
                <div
                  className="absolute bottom-0 w-full bg-primary rounded-t-sm transition-all group-hover:bg-primary-light"
                  style={{ height: "90%" }}
                ></div>
              </div>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Jun
              </span>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 border border-slate-200 dark:border-surface-border shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
              Recent Transactions
            </h3>
            <button className="text-sm font-medium text-primary">
              View all
            </button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-green-600 dark:text-green-400">
                    arrow_downward
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    TechTalk Podcast
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Mar 15, 2024
                  </p>
                </div>
              </div>
              <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                +रू 4,500
              </span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-green-600 dark:text-green-400">
                    arrow_downward
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    YouTube Review
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Mar 18, 2024
                  </p>
                </div>
              </div>
              <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                +रू 8,500
              </span>
            </div>
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-red-600 dark:text-red-400">
                    arrow_upward
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    Software License
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Mar 20, 2024
                  </p>
                </div>
              </div>
              <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                -रू 2,500
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
//             <div className="text-right">
//               <span className="block text-base font-bold text-slate-900 dark:text-white">रू 8,250</span>
//               <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Pending</span>
//             </div>
//           </div>

//           {/* Earning 3 */}
//           <div className="group flex items-center justify-between p-4 rounded-xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-surface-border shadow-sm hover:border-primary/50 transition-colors cursor-pointer">
//             <div className="flex items-center gap-4">
//               <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-emerald-500/20">
//                 O
//               </div>
//               <div className="flex flex-col">
//                 <span className="text-base font-semibold text-slate-900 dark:text-white">Oceanic Tech</span>
//                 <div className="flex items-center gap-2 mt-1">
//                   <span className="text-xs text-slate-500 dark:text-slate-400">Product Launch</span>
//                   <div className="flex -space-x-1">
//                     <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-[10px] text-white font-bold border border-white dark:border-surface-dark" title="Editor: Paul">P</div>
//                     <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center text-[10px] text-white font-bold border border-white dark:border-surface-dark" title="Editor: Alex">A</div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="text-right">
//               <span className="block text-base font-bold text-slate-900 dark:text-white">रू 15,000</span>
//               <span className="text-xs font-medium text-green-600 dark:text-green-400">Paid</span>
//             </div>
//           </div>

//           {/* Earning 4 */}
//           <div className="group flex items-center justify-between p-4 rounded-xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-surface-border shadow-sm hover:border-primary/50 transition-colors cursor-pointer">
//             <div className="flex items-center gap-4">
//               <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/20">
//                 A
//               </div>
//               <div className="flex flex-col">
//                 <span className="text-base font-semibold text-slate-900 dark:text-white">Apex Gear</span>
//                 <div className="flex items-center gap-2 mt-1">
//                   <span className="text-xs text-slate-500 dark:text-slate-400">Social Media Pack</span>
//                   <div className="flex -space-x-1">
//                     <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center text-[10px] text-white font-bold border border-white dark:border-surface-dark" title="Editor: Alex">A</div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="text-right">
//               <span className="block text-base font-bold text-slate-900 dark:text-white">रू 4,500</span>
//               <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Invoiced</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
