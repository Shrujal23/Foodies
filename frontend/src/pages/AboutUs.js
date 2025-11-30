import React from 'react'
import { Link } from 'react-router-dom'
import {
  HeartIcon,
  SparklesIcon,
  UsersIcon,
  FireIcon,
  ChartBarIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  RocketLaunchIcon,
  CakeIcon,
  BookOpenIcon,
  LightBulbIcon,
  StarIcon,
} from '@heroicons/react/24/outline'

function AboutUs() {
  const stats = [
    { label: 'Active Users', value: '50K+', icon: UsersIcon, color: 'orange' },
    { label: 'Recipes Shared', value: '100K+', icon: CakeIcon, color: 'pink' },
    { label: 'Countries', value: '120+', icon: GlobeAltIcon, color: 'rose' },
    { label: 'Community Rating', value: '4.9/5', icon: StarIcon, color: 'yellow' },
  ]

  const values = [
    {
      icon: HeartIcon,
      title: 'Community First',
      description: 'We believe in the power of shared experiences. Every recipe tells a story, and every cook brings something unique to our community.',
      gradient: 'from-rose-500 to-pink-600',
    },
    {
      icon: SparklesIcon,
      title: 'Quality & Authenticity',
      description: 'We celebrate authentic flavors and traditional techniques while embracing modern creativity and innovation in the kitchen.',
      gradient: 'from-orange-500 to-yellow-500',
    },
    {
      icon: ShieldCheckIcon,
      title: 'Trust & Safety',
      description: 'Your privacy matters. We maintain the highest standards of data security and content moderation to keep our community safe.',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: RocketLaunchIcon,
      title: 'Innovation',
      description: 'We constantly evolve with cutting-edge features, AI-powered recommendations, and tools that make cooking more accessible to everyone.',
      gradient: 'from-purple-500 to-pink-500',
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
      icon: BookOpenIcon,
      title: 'Recipe Discovery',
      description: 'Explore thousands of curated recipes from around the world, tailored to your taste.',
    },
    {
      icon: UsersIcon,
      title: 'Community Sharing',
      description: 'Share your culinary creations and connect with fellow food enthusiasts.',
    },
    {
      icon: LightBulbIcon,
      title: 'Smart Recommendations',
      description: 'AI-powered suggestions based on your preferences, dietary needs, and cooking style.',
    },
    {
      icon: ChartBarIcon,
      title: 'Track Your Progress',
      description: 'Monitor your cooking journey with detailed stats and achievements.',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-rose-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600 via-pink-600 to-rose-600" />
        <div className="absolute inset-0 bg-black/30" />
        
        {/* Animated Background Elements */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        
        <div className="relative max-w-7xl mx-auto px-6 py-32 lg:py-40 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/20 backdrop-blur-lg font-bold mb-8 text-white shadow-xl">
            <HeartIcon className="w-6 h-6" />
            About Us
          </div>
          
          <h1 className="text-6xl lg:text-8xl font-extrabold text-white leading-tight mb-8">
            Bringing Food Lovers
            <br />
            <span className="text-yellow-300">Together</span>
          </h1>
          
          <p className="text-2xl lg:text-3xl text-white/90 max-w-4xl mx-auto mb-12 leading-relaxed">
            We're on a mission to make cooking accessible, enjoyable, and social. 
            Join our global community of passionate home cooks and culinary enthusiasts.
          </p>
          
          <div className="flex flex-wrap gap-6 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center gap-3 px-10 py-6 bg-white text-orange-600 font-bold text-xl rounded-2xl hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-2xl"
            >
              Join Our Community
              <UsersIcon className="w-7 h-7" />
            </Link>
            <Link
              to="/search"
              className="inline-flex items-center gap-3 px-10 py-6 bg-white/20 backdrop-blur text-white font-bold text-xl rounded-2xl hover:bg-white/30 transform hover:scale-105 transition-all duration-300 border-2 border-white/30 shadow-2xl"
            >
              Explore Recipes
              <SparklesIcon className="w-7 h-7" />
            </Link>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center p-8 rounded-3xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
              >
                <stat.icon className={`w-16 h-16 mx-auto mb-4 text-${stat.color}-500`} />
                <div className="text-5xl font-extrabold mb-2 bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-lg font-medium text-gray-600 dark:text-gray-400">
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
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-5xl lg:text-6xl font-extrabold mb-8 bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                Our Story
              </h2>
              <div className="space-y-6 text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
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
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-500 to-pink-600 rounded-3xl transform rotate-3" />
              <img
                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800"
                alt="Team cooking together"
                className="relative rounded-3xl shadow-2xl w-full h-[500px] object-cover"
              />
            </div>
          </div>
        </section>

        {/* OUR VALUES */}
        <section className="mb-32">
          <div className="text-center mb-20">
            <h2 className="text-5xl lg:text-6xl font-extrabold mb-6 bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
              What We Stand For
            </h2>
            <p className="text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Our values guide everything we do, from product development to community management.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            {values.map((value, index) => (
              <div
                key={index}
                className="group relative bg-white dark:bg-gray-800 rounded-3xl p-10 shadow-xl hover:shadow-3xl hover:-translate-y-3 transition-all duration-500 overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${value.gradient} opacity-10 group-hover:opacity-20 rounded-full blur-3xl transition-opacity duration-500`} />
                
                <div className={`w-20 h-20 bg-gradient-to-br ${value.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <value.icon className="w-10 h-10 text-white" />
                </div>
                
                <h3 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                  {value.title}
                </h3>
                
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURES */}
        <section className="mb-32">
          <div className="text-center mb-20">
            <h2 className="text-5xl lg:text-6xl font-extrabold mb-6 bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent ">
              What Makes Us Special
            </h2>
            <p className="text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Powerful features designed to enhance your cooking journey.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-8 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-3 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* TEAM */}
        <section className="mb-32">
          <div className="text-center mb-20">
            <h2 className="text-5xl lg:text-6xl font-extrabold mb-6 bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
              Meet Our Team
            </h2>
            <p className="text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              The passionate people behind Foodies, working to make your culinary journey amazing.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {team.map((member, index) => (
              <div
                key={index}
                className="group bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-xl hover:shadow-3xl hover:-translate-y-4 transition-all duration-500"
              >
                <div className="relative h-80 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                    {member.name}
                  </h3>
                  <p className="text-orange-600 dark:text-orange-400 font-semibold mb-4">
                    {member.role}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="bg-gradient-to-r from-orange-600 via-pink-600 to-rose-600 rounded-3xl p-16 lg:p-24 text-center text-white shadow-3xl">
          <FireIcon className="w-24 h-24 mx-auto mb-8 animate-pulse " />
          
          <h2 className="text-5xl lg:text-6xl font-extrabold mb-6 ">
            Ready to Join the Community?
          </h2>
          
          <p className="text-2xl lg:text-3xl mb-12 max-w-3xl mx-auto">
            Start your culinary adventure today. Share your recipes, discover new favorites, 
            and connect with food lovers worldwide.
          </p>
          
          <div className="flex flex-wrap gap-6 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center gap-3 px-12 py-6 bg-white text-orange-600 font-bold text-xl rounded-2xl hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-2xl"
            >
              Get Started Free
              <RocketLaunchIcon className="w-7 h-7" />
            </Link>
            <Link
              to="/search"
              className="inline-flex items-center gap-3 px-12 py-6 bg-white/20 backdrop-blur text-white font-bold text-xl rounded-2xl hover:bg-white/30 transform hover:scale-105 transition-all duration-300 border-2 border-white/30 shadow-2xl hover:shadow-2xl hover:shadow-orange-500/30 hover:-translate-y-3"
            >
              Explore Now
              <SparklesIcon className="w-7 h-7" />
            </Link>
          </div>
        </section>

      </div>
    </div>
  )
}

export default AboutUs
