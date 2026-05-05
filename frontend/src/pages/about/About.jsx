import { Link } from 'react-router-dom';

const About = () => {
    return (
        <div className="max-w-5xl px-4 py-12 mx-auto space-y-20">
            
            {/* Hero Section */}
            <div className="space-y-6 text-center">
                <h1 className="text-4xl font-black tracking-tight text-gray-900 md:text-6xl">
                    Elevating Competitive <br className="hidden md:block" />
                    <span className="text-gray-400">Gaming & Sports.</span>
                </h1>
                <p className="max-w-2xl mx-auto text-lg text-gray-500">
                    Play.Champ is the ultimate tournament management platform built to bridge the gap between passionate organizers and competitive players.
                </p>
            </div>

            {/* Mission Section */}
            <div className="grid items-center gap-12 md:grid-cols-2">
                <div className="space-y-6">
                    <h2 className="text-3xl font-bold text-gray-900">The Problem We Solve</h2>
                    <p className="leading-relaxed text-gray-600">
                        Whether you are running a local college esports tournament or a massive regional sports league, managing registrations, payments, and participant data used to be a nightmare of spreadsheets and endless direct messages.
                    </p>
                    <p className="leading-relaxed text-gray-600">
                        We built Play.Champ to automate the boring stuff. By providing dynamic registration forms, instant status updates, and a clean dashboard, we let organizers focus on the event, and players focus on winning.
                    </p>
                    <Link to="/tournaments" className="inline-block px-6 py-3 font-medium text-white transition-colors bg-gray-900 rounded-md hover:bg-gray-800">
                        Explore Tournaments
                    </Link>
                </div>
                
                {/* Decorative Image/Graphic Placeholder */}
                <div className="flex items-center justify-center bg-gray-100 rounded-2xl aspect-square md:aspect-auto md:h-full border border-gray-200">
                    <svg className="w-24 h-24 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                    </svg>
                </div>
            </div>

            {/* Stats / Value Section */}
            <div className="grid grid-cols-2 gap-8 pt-12 border-t border-gray-200 md:grid-cols-4">
                <div>
                    <div className="text-3xl font-black text-gray-900">Dynamic</div>
                    <div className="mt-1 text-sm font-medium text-gray-500 uppercase tracking-wider">Form Builder</div>
                </div>
                <div>
                    <div className="text-3xl font-black text-gray-900">Seamless</div>
                    <div className="mt-1 text-sm font-medium text-gray-500 uppercase tracking-wider">Role Access</div>
                </div>
                <div>
                    <div className="text-3xl font-black text-gray-900">Real-time</div>
                    <div className="mt-1 text-sm font-medium text-gray-500 uppercase tracking-wider">Status Tracking</div>
                </div>
                <div>
                    <div className="text-3xl font-black text-gray-900">Modern</div>
                    <div className="mt-1 text-sm font-medium text-gray-500 uppercase tracking-wider">Minimalist UI</div>
                </div>
            </div>
        </div>
    );
};

export default About;