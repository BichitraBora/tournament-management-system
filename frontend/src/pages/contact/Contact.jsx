import { useState } from 'react';

const Contact = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real app, you would send this to your backend here.
        // For the presentation, we just show a success message!
        setIsSubmitted(true);
        setFormData({ name: '', email: '', message: '' });
        
        // Hide the success message after 3 seconds
        setTimeout(() => setIsSubmitted(false), 3000);
    };

    return (
        <div className="max-w-6xl px-4 py-12 mx-auto space-y-16">
            
            {/* Header */}
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-black tracking-tight text-gray-900 md:text-5xl">
                    Get in Touch
                </h1>
                <p className="max-w-2xl mx-auto text-lg text-gray-500">
                    Have a question about hosting a tournament or need technical support? We are here to help.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-24">
                
                {/* Left Side: Contact Information */}
                <div className="space-y-10">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Reach Out Directly</h3>
                        <p className="mt-2 text-gray-600">
                            We try to respond to all inquiries within 24 hours. For urgent tournament issues, please include "URGENT" in your subject line.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-gray-100 rounded-md">
                                <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900">Email Support</h4>
                                <p className="text-gray-500">support@playchamp.com</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-gray-100 rounded-md">
                                <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900">Headquarters</h4>
                                <p className="text-gray-500">Golaghat, Assam<br />India</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Contact Form */}
                <div className="p-8 bg-white border border-gray-200 rounded-xl shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        {isSubmitted && (
                            <div className="p-4 text-sm font-medium text-green-800 bg-green-50 border border-green-200 rounded-md">
                                Message sent successfully! We'll get back to you soon.
                            </div>
                        )}

                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-700">Full Name</label>
                            <input 
                                type="text" 
                                name="name" 
                                required 
                                value={formData.name} 
                                onChange={handleChange} 
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:bg-white focus:ring-2 focus:ring-gray-900 focus:outline-none transition-colors" 
                                placeholder="John Doe" 
                            />
                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-700">Email Address</label>
                            <input 
                                type="email" 
                                name="email" 
                                required 
                                value={formData.email} 
                                onChange={handleChange} 
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:bg-white focus:ring-2 focus:ring-gray-900 focus:outline-none transition-colors" 
                                placeholder="john@example.com" 
                            />
                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-700">Message</label>
                            <textarea 
                                name="message" 
                                required 
                                value={formData.message} 
                                onChange={handleChange} 
                                rows="5" 
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:bg-white focus:ring-2 focus:ring-gray-900 focus:outline-none transition-colors" 
                                placeholder="How can we help you?" 
                            />
                        </div>

                        <button 
                            type="submit" 
                            className="w-full px-6 py-3.5 text-sm font-medium text-white transition-colors bg-gray-900 rounded-md hover:bg-gray-800"
                        >
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contact;