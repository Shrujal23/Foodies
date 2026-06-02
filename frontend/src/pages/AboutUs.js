import React from 'react'
import { Link } from 'react-router-dom'

function AboutUs() {
  const stats = [
    { label: 'Active Users', value: '50K+' },
    { label: 'Recipes Shared', value: '100K+' },
    { label: 'Countries', value: '120+' },
    { label: 'Community Rating', value: '4.9/5' },
  ]

  const values = [
    {
      title: 'Community First',
      description: 'We believe in the power of shared experiences. Every recipe tells a story, and every cook brings something unique to our community.',
    },
    {
      title: 'Quality & Authenticity',
      description: 'We celebrate authentic flavors and traditional techniques while embracing modern creativity and innovation in the kitchen.',
    },
    {
      title: 'Trust & Safety',
      description: 'Your privacy matters. We maintain the highest standards of data security and content moderation to keep our community safe.',
    },
    {
      title: 'Innovation',
      description: 'We constantly evolve with cutting-edge features, AI-powered recommendations, and tools that make cooking more accessible to everyone.',
    },
  ]

  const team = [
    {
      name: 'Sarah Chen',
      role: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      bio: 'Former chef turned tech entrepreneur with a passion for bringing people together through food.',
    },
    {
      name: 'Marcus Johnson',
      role: 'Head of Engineering',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      bio: 'Full-stack developer who loves optimizing user experiences and scalable systems.',
    },
    {
      name: 'Elena Rodriguez',
      role: 'Head of Community',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      bio: 'Community builder fostering connections between home cooks across the globe.',
    },
    {
      name: 'David Kim',
      role: 'Lead Product Designer',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      bio: 'Designer focused on creating beautiful, intuitive experiences that delight users.',
    },
  ]

  const features = [
    {
      title: 'Recipe Discovery',
      description: 'Explore thousands of curated recipes from around the world, tailored to your taste.',
    },
    {
      title: 'Community Sharing',
      description: 'Share your culinary creations and connect with fellow food enthusiasts.',
    },
    {
      title: 'Smart Recommendations',
      description: 'AI-powered suggestions based on your preferences, dietary needs, and cooking style.',
    },
    {
      title: 'Track Your Progress',
      description: 'Monitor your cooking journey with detailed stats and achievements.',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-rose-50 dark:from-gray-950 dark:via-gray-900 dark:to-black">
      
      {/* GLOWING "MADE WITH LOVE" HEADING - VISUALLY STRIKING */}
      <div className="py-16 px-6 text-center">
        <div className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold text-2xl shadow-2xl shadow-orange-500/50 animate-pulse-glow mb-8">
          ✨ Made with Love ✨
        </div>
      </div>
      
      {/* HERO SECTION */}
      <section className="py-20 px-6 text-center bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
            About Foodies
          </h1>
          
          <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-400 mb-10">
            We're on a mission to make cooking accessible, enjoyable, and social. 
            Join our global community of passionate home cooks and culinary enthusiasts.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/register"
              className="px-8 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-all duration-300"
            >
              Join Our Community
            </Link>
            <Link
              to="/search"
              className="px-8 py-3 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white font-semibold rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
            >
              Explore Recipes
            </Link>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-gray-800/80 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                <div className="text-4xl font-bold text-orange-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-24">

        {/* OUR STORY */}
        <section className="mb-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                <p>
                  It all started in 2020, when our founder Sarah was searching for her grandmother's recipe online 
                  and realized how scattered and impersonal recipe platforms had become. She envisioned a place where 
                  food lovers could not just find recipes, but truly connect over their shared passion.
                </p>
                <p>
                  What began as a simple recipe-sharing website has grown into a vibrant community of over 50,000 
                  home cooks from 120+ countries. We've facilitated the sharing of over 100,000 recipes, helped 
                  millions discover their next favorite dish, and connected food enthusiasts across the globe.
                </p>
                <p>
                  Today, Foodies is more than a platform—it's a movement. We're democratizing culinary knowledge, 
                  celebrating diverse food cultures, and empowering anyone to become a confident home cook.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800"
                alt="Team cooking together"
                className="rounded-lg shadow-lg w-full h-[400px] object-cover"
              />
            </div>
          </div>
        </section>

        {/* OUR VALUES */}
        <section className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              What We Stand For
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Our values guide everything we do, from product development to community management.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-8 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-gray-800/80 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                  {value.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURES */}
        <section className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              What Makes Us Special
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Powerful features designed to enhance your cooking journey.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-gray-800/80 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* TEAM */}
        <section className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              Meet Our Team
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              The passionate people behind Foodies, working to make your culinary journey amazing.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <div
                key={index}
                className="group border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-gray-800/80 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                <div className="p-6">
                  <h3 className="text-lg font-bold mb-1 text-gray-900 dark:text-white">
                    {member.name}
                  </h3>
                  <p className="text-orange-600 dark:text-orange-400 text-sm font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="bg-gray-100 dark:bg-gray-800 rounded-lg p-12 lg:p-16 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            Ready to Join the Community?
          </h2>
          
          <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
            Start your culinary adventure today. Share your recipes, discover new favorites, 
            and connect with food lovers worldwide.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/register"
              className="px-8 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-all duration-300"
            >
              Get Started Free
            </Link>
            <Link
              to="/search"
              className="px-8 py-3 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
            >
              Explore Now
            </Link>
          </div>
        </section>

      </div>
    </div>
  )
}

export default AboutUs
