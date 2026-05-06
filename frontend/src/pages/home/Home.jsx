import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const firstName = user?.name?.split(' ')[0] || 'Champion';

    return (
        <div className="w-full pb-12 space-y-8 animate-fade-in">
            
            {/* --- DARK HERO SECTION --- */}
            <div className="relative w-full px-6 py-16 overflow-hidden bg-gray-900 shadow-2xl rounded-3xl md:py-24 md:px-16">
                
                {/* Decorative Background Pattern (Subtle Grid) */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                     style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
                </div>

                <div className="relative z-10 max-w-3xl space-y-6">
                    <div className="inline-flex items-center px-4 py-1.5 text-xs font-bold tracking-widest text-gray-900 uppercase bg-white rounded-full shadow-sm">
                        <span className="w-2 h-2 mr-2 bg-green-500 rounded-full animate-pulse"></span>
                        {user?.role} Portal
                    </div>
                    
                    <h1 className="text-5xl font-black tracking-tight text-white md:text-7xl">
                        Welcome back, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-white">
                            {firstName}.
                        </span>
                    </h1>
                    
                    <p className="max-w-xl text-lg leading-relaxed text-gray-400 md:text-xl">
                        {user?.role === 'Organizer' 
                            ? 'Your command center. Manage live events, review participant applications, and scale your operations with precision.' 
                            : 'Your next victory awaits. Discover epic tournaments, apply with your squad, and dominate the leaderboards.'}
                    </p>
                </div>
            </div>

            {/* --- FLOATING ACTION CARDS --- */}
            {/* The -mt-12 and md:-mt-24 pulls these cards up so they overlap the dark hero section! */}
            <div className="relative z-20 grid grid-cols-1 gap-6 px-4 md:grid-cols-2 md:px-12 -mt-12 md:-mt-20">
                
                {/* 1. Primary Action */}
                {user?.role === 'Organizer' ? (
                    <div 
                        onClick={() => navigate('/create-tournament')}
                        className="flex flex-col h-full p-8 transition-all duration-300 bg-white border border-gray-100 shadow-xl cursor-pointer rounded-2xl hover:-translate-y-1 hover:shadow-2xl hover:border-gray-900 group"
                    >
                        <div className="flex items-center justify-center w-14 h-14 mb-6 text-white transition-transform duration-300 bg-gray-900 shadow-md rounded-xl group-hover:scale-110">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                        </div>
                        <h3 className="mb-3 text-2xl font-black text-gray-900">Create Tournament</h3>
                        <p className="text-gray-500 leading-relaxed flex-grow">
                            Draft a new event, set up dynamic registration forms, and configure your prize pools to attract top talent.
                        </p>
                        <div className="mt-6 text-sm font-bold text-gray-900 uppercase tracking-widest flex items-center group-hover:underline">
                            Get Started <span className="ml-2">→</span>
                        </div>
                    </div>
                ) : (
                    <div 
                        onClick={() => navigate('/tournaments')}
                        className="flex flex-col h-full p-8 transition-all duration-300 bg-white border border-gray-100 shadow-xl cursor-pointer rounded-2xl hover:-translate-y-1 hover:shadow-2xl hover:border-gray-900 group"
                    >
                        <div className="flex items-center justify-center w-14 h-14 mb-6 text-white transition-transform duration-300 bg-gray-900 shadow-md rounded-xl group-hover:scale-110">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </div>
                        <h3 className="mb-3 text-2xl font-black text-gray-900">Find Tournaments</h3>
                        <p className="text-gray-500 leading-relaxed flex-grow">
                            Browse the latest competitive events, filter by game category, and submit your applications to compete.
                        </p>
                        <div className="mt-6 text-sm font-bold text-gray-900 uppercase tracking-widest flex items-center group-hover:underline">
                            Explore Now <span className="ml-2">→</span>
                        </div>
                    </div>
                )}

                {/* 2. Secondary Action */}
                <div 
                    onClick={() => navigate('/tournaments')}
                    className="flex flex-col h-full p-8 transition-all duration-300 bg-gray-50 border border-gray-200 shadow-xl cursor-pointer rounded-2xl hover:-translate-y-1 hover:shadow-2xl hover:bg-white hover:border-gray-900 group"
                >
                    <div className="flex items-center justify-center w-14 h-14 mb-6 text-gray-900 transition-transform duration-300 bg-white border border-gray-200 shadow-sm rounded-xl group-hover:scale-110">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                    </div>
                    <h3 className="mb-3 text-2xl font-black text-gray-900">
                        {user?.role === 'Organizer' ? 'Tournaments Hub' : 'Live Events Hub'}
                    </h3>
                    <p className="text-gray-500 leading-relaxed flex-grow">
                        {user?.role === 'Organizer' 
                            ? 'Review active registrations, edit live details, or manage your historical event data.' 
                            : 'Check your application statuses and explore our centralized hub of all active competitions.'}
                    </p>
                    <div className="mt-6 text-sm font-bold text-gray-600 uppercase tracking-widest flex items-center group-hover:text-gray-900">
                        Open Hub <span className="ml-2">→</span>
                    </div>
                </div>
                
            </div>
            
            {/* --- QUICK TIP FOOTER --- */}
            <div className="px-6 py-8 mt-12 text-center md:px-12">
                <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">
                    Pro Tip: Keep your profile updated to increase your chances of tournament approval.
                </p>
            </div>

        </div>
    );
};

export default Home;