import React from 'react';

const AdminLoading = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950 h-screen w-screen">
      
      <div className="relative flex items-center justify-center">
        <div className="h-20 w-20 animate-spin rounded-full border-4 border-t-cyan-500 border-b-purple-500 border-r-transparent border-l-transparent shadow-[0_0_15px_rgba(6,182,212,0.4)]"></div>
        
        <div className="absolute h-14 w-14 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm"></div>
        
        <div className="absolute h-3 w-3 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]"></div>
      </div>

      <div className="mt-6 flex flex-col items-center gap-1">
        <p className="font-mono text-sm tracking-[0.2em] text-cyan-500/80 animate-pulse">
          ACCESSING DATABANK
        </p>
        <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>
      </div>

    </div>
  );
};

export default AdminLoading;