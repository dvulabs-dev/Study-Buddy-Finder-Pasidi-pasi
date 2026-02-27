import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Users, 
  BookOpen, 
  Filter,
  X,
  Loader2,
  Calendar,
  Sun,
  Moon,
  Clock,
  GraduationCap,
  Mail,
  UserPlus,
  UserCheck,
  ChevronDown,
  Sparkles
} from 'lucide-react';

const FindBuddiesTab = ({
  fbSearchType,
  setFbSearchType,
  fbSubject,
  setFbSubject,
  fbAvailableTime,
  setFbAvailableTime,
  fbStudents,
  fbLoading,
  fbError,
  fbHasSearched,
  fbLoadAll,
  fbSimpleSearch,
  fbAdvancedSearch,
  renderFriendButton,
  getInitials,
  buddyColors,
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchInputFocus, setSearchInputFocus] = useState(false);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  const searchTypes = [
    { id: 'all', label: 'All Students', icon: Users, color: 'indigo', description: 'Browse all available students' },
    { id: 'simple', label: 'Search by Subject', icon: BookOpen, color: 'blue', description: 'Find students studying specific subjects' },
    { id: 'advanced', label: 'Advanced Search', icon: Filter, color: 'purple', description: 'Filter by subject and availability' },
  ];

  const availabilityOptions = [
    { id: 'weekdays', label: 'Weekdays', icon: Calendar, color: 'blue', emoji: '📅' },
    { id: 'weekend', label: 'Weekend', icon: Calendar, color: 'green', emoji: '🎉' },
    { id: 'morning', label: 'Morning', icon: Sun, color: 'yellow', emoji: '🌅' },
    { id: 'evening', label: 'Evening', icon: Moon, color: 'indigo', emoji: '🌆' },
  ];

  const getAvailabilityIcon = (type) => {
    const option = availabilityOptions.find(opt => opt.id === type);
    return option ? option.emoji : '📅';
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="overflow-hidden bg-white border border-gray-200 shadow-xl rounded-2xl"
    >
      {/* Enhanced Header with Gradient */}
      <div className="relative px-6 py-8 overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>
        
        {/* Floating Icons Animation */}
        <motion.div
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut" 
          }}
          className="absolute top-4 right-4 text-white opacity-20"
        >
          <Users size={48} />
        </motion.div>

        <div className="relative">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center px-3 py-1 mb-4 space-x-2 text-sm text-indigo-100 bg-white bg-opacity-20 rounded-full backdrop-blur-sm"
          >
            <Sparkles size={16} />
            <span>Connect with study partners</span>
          </motion.div>

          <h2 className="text-3xl font-bold text-white">Find Study Buddies</h2>
          <p className="mt-2 text-indigo-100">Discover and connect with students who share your academic interests</p>
        </div>

        {/* Search Type Pills */}
        <div className="flex flex-wrap gap-3 mt-6">
          {searchTypes.map(({ id, label, icon: Icon, color, description }) => (
            <motion.button
              key={id}
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { 
                setFbSearchType(id); 
                if (id === "all") fbLoadAll(); 
              }}
              className="relative group"
            >
              <div className={`
                relative px-5 py-3 rounded-xl font-medium transition-all duration-300
                flex items-center space-x-2 overflow-hidden
                ${fbSearchType === id 
                  ? 'bg-white text-indigo-600 shadow-lg' 
                  : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm'
                }
              `}>
                <Icon size={18} />
                <span>{label}</span>
                
                {/* Tooltip */}
                <div className="absolute left-0 z-10 px-3 py-2 mt-2 text-sm text-white bg-gray-900 rounded-lg opacity-0 pointer-events-none -bottom-12 group-hover:opacity-100 whitespace-nowrap transition-opacity duration-200">
                  {description}
                </div>
              </div>
              
              {fbSearchType === id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 border-2 border-white rounded-xl"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {/* Search Forms with Enhanced Animations */}
        <AnimatePresence mode="wait">
          {fbSearchType === "simple" && (
            <motion.form
              key="simple"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={fbSimpleSearch}
              className="mb-6 overflow-hidden"
            >
              <div className="relative flex gap-2">
                <div className="relative flex-1">
                  <div className={`
                    absolute left-3 top-1/2 transform -translate-y-1/2 transition-all duration-300
                    ${searchInputFocus ? 'text-indigo-600' : 'text-gray-400'}
                  `}>
                    <BookOpen size={20} />
                  </div>
                  
                  <input
                    type="text"
                    placeholder="Enter subject (e.g., Mathematics, Physics, Computer Science)"
                    value={fbSubject}
                    onChange={(e) => setFbSubject(e.target.value)}
                    onFocus={() => setSearchInputFocus(true)}
                    onBlur={() => setSearchInputFocus(false)}
                    className={`
                      w-full pl-10 pr-10 py-3 border-2 rounded-xl transition-all duration-300
                      ${searchInputFocus 
                        ? 'border-indigo-600 ring-4 ring-indigo-100' 
                        : 'border-gray-200 hover:border-gray-300'
                      }
                      focus:outline-none
                    `}
                  />
                  
                  {fbSubject && (
                    <motion.button
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      type="button"
                      onClick={() => setFbSubject('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X size={18} />
                    </motion.button>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={fbLoading || !fbSubject.trim()}
                  className="px-6 py-3 text-white transition-all duration-300 bg-indigo-600 rounded-xl hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2 shadow-lg shadow-indigo-200"
                >
                  {fbLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Search size={20} />
                  )}
                  <span>{fbLoading ? "Searching..." : "Search"}</span>
                </motion.button>
              </div>

              {/* Search Suggestions */}
              {!fbSubject && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-3 text-sm text-gray-500"
                >
                  Popular searches: 
                  <button type="button" onClick={() => setFbSubject('Mathematics')} className="ml-2 text-indigo-600 hover:underline">Mathematics</button>
                  <span className="mx-1">•</span>
                  <button type="button" onClick={() => setFbSubject('Physics')} className="text-indigo-600 hover:underline">Physics</button>
                  <span className="mx-1">•</span>
                  <button type="button" onClick={() => setFbSubject('Computer Science')} className="text-indigo-600 hover:underline">Computer Science</button>
                </motion.div>
              )}
            </motion.form>
          )}

          {fbSearchType === "advanced" && (
            <motion.form
              key="advanced"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={fbAdvancedSearch}
              className="mb-6 overflow-hidden"
            >
              <div className="p-6 space-y-5 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl">
                {/* Subject Input */}
                <div>
                  <label className="flex items-center mb-2 text-sm font-medium text-gray-700">
                    <BookOpen size={16} className="mr-2" />
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="Enter subject (optional)"
                    value={fbSubject}
                    onChange={(e) => setFbSubject(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-600 focus:ring-4 focus:ring-purple-100 transition-all duration-300"
                  />
                </div>
                
                {/* Availability Filters */}
                <div>
                  <button
                    type="button"
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center justify-between w-full text-sm font-medium text-gray-700"
                  >
                    <span className="flex items-center">
                      <Clock size={16} className="mr-2" />
                      Availability
                    </span>
                    <motion.div
                      animate={{ rotate: showFilters ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown size={18} />
                    </motion.div>
                  </button>
                  
                  <AnimatePresence>
                    {showFilters && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 overflow-hidden"
                      >
                        <div className="grid grid-cols-2 gap-3">
                          {availabilityOptions.map(({ id, label, icon: Icon, color, emoji }) => (
                            <motion.label
                              key={id}
                              whileHover={{ scale: 1.02 }}
                              className={`
                                flex items-center p-3 space-x-3 border-2 rounded-xl cursor-pointer
                                transition-all duration-300
                                ${fbAvailableTime[id] 
                                  ? `border-${color}-500 bg-${color}-50 shadow-md` 
                                  : 'border-gray-200 hover:border-gray-300 bg-white'
                                }
                              `}
                            >
                              <input
                                type="checkbox"
                                checked={fbAvailableTime[id]}
                                onChange={() => setFbAvailableTime((p) => ({ ...p, [id]: !p[id] }))}
                                className="hidden"
                              />
                              <span className="text-xl">{emoji}</span>
                              <span className={`text-sm font-medium ${
                                fbAvailableTime[id] ? `text-${color}-700` : 'text-gray-700'
                              }`}>
                                {label}
                              </span>
                            </motion.label>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={fbLoading}
                  className="w-full px-6 py-3 text-white transition-all duration-300 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg shadow-purple-200"
                >
                  {fbLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Filter size={20} />
                  )}
                  <span>{fbLoading ? "Searching..." : "Apply Advanced Filters"}</span>
                </motion.button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Error Message with Animation */}
        <AnimatePresence>
          {fbError && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="p-4 mb-6 text-red-700 border border-red-200 rounded-xl bg-red-50"
            >
              <div className="flex items-center space-x-2">
                <X size={18} className="text-red-500" />
                <span>{fbError}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Section */}
        <div className="mt-6">
          {fbLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-16 text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="inline-block"
              >
                <Loader2 size={40} className="text-indigo-600" />
              </motion.div>
              <p className="mt-4 text-gray-600">Searching for study buddies...</p>
              <p className="text-sm text-gray-400">This may take a moment</p>
            </motion.div>
          ) : fbStudents.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Found <span className="text-indigo-600">{fbStudents.length}</span> student{fbStudents.length !== 1 ? "s" : ""}
                  </h3>
                  <p className="text-sm text-gray-500">Ready to start studying together</p>
                </div>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="p-2 bg-indigo-100 rounded-full"
                >
                  <Users size={20} className="text-indigo-600" />
                </motion.div>
              </div>
              
              {/* Students List */}
              <div className="space-y-4">
                <AnimatePresence>
                  {fbStudents.map((student, idx) => (
                    <motion.div
                      key={student._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      className="group relative p-5 transition-all duration-300 bg-white border border-gray-200 rounded-xl hover:border-indigo-200 hover:shadow-xl"
                    >
                      {/* Decorative gradient on hover */}
                      <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl group-hover:opacity-100" />
                      
                      <div className="relative flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          {/* Avatar with animation */}
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            className={`
                              flex items-center justify-center w-14 h-14 rounded-2xl 
                              text-white font-bold text-lg flex-shrink-0 shadow-lg
                              ${buddyColors[idx % buddyColors.length]}
                              transition-all duration-300 group-hover:shadow-xl
                            `}
                          >
                            {getInitials(student.name)}
                          </motion.div>
                          
                          {/* Student Details */}
                          <div className="space-y-2">
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900">{student.name}</h4>
                              <div className="flex items-center mt-1 text-sm text-gray-500">
                                <Mail size={14} className="mr-1" />
                                {student.email}
                              </div>
                            </div>
                            
                            {student.degree && (
                              <div className="flex items-center text-sm text-gray-600">
                                <GraduationCap size={14} className="mr-1 text-indigo-500" />
                                <span className="font-medium">{student.degree}</span>
                                {student.year && <span className="ml-1 text-gray-400">• Year {student.year}</span>}
                              </div>
                            )}
                            
                            {/* Subjects */}
                            {student.subjects?.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {student.subjects.map((subject, i) => (
                                  <motion.span
                                    key={i}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="px-3 py-1 text-xs font-medium text-indigo-700 bg-indigo-50 rounded-full border border-indigo-100"
                                  >
                                    {subject}
                                  </motion.span>
                                ))}
                              </div>
                            )}
                            
                            {/* Availability Tags */}
                            {student.availableTime && (
                              <div className="flex flex-wrap gap-2 mt-3">
                                {availabilityOptions.map(({ id, label, color }) => (
                                  student.availableTime[id] && (
                                    <motion.span
                                      key={id}
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      className={`
                                        inline-flex items-center px-3 py-1 text-xs rounded-full
                                        bg-${color}-50 text-${color}-700 border border-${color}-200
                                      `}
                                    >
                                      <span className="mr-1">{getAvailabilityIcon(id)}</span>
                                      {label}
                                    </motion.span>
                                  )
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Friend Button with Animation */}
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="relative z-10 flex-shrink-0 ml-3"
                        >
                          {renderFriendButton(student._id)}
                        </motion.div>
                      </div>

                      {/* Quick action tooltip on hover */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileHover={{ opacity: 1, y: 0 }}
                        className="absolute px-2 py-1 text-xs text-white bg-gray-800 rounded -bottom-2 right-4"
                      >
                        Click to connect
                      </motion.div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          ) : (
            fbHasSearched && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-16 text-center"
              >
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="inline-block"
                >
                  <Users size={48} className="text-gray-300" />
                </motion.div>
                <p className="mt-4 text-lg text-gray-600">No students found</p>
                <p className="text-sm text-gray-400">Try adjusting your search criteria or check back later</p>
                
                {/* Quick Suggestions */}
                <div className="mt-6">
                  <p className="text-sm text-gray-500">Quick suggestions:</p>
                  <div className="flex flex-wrap justify-center gap-2 mt-3">
                    <button
                      onClick={() => setFbSearchType('all')}
                      className="px-4 py-2 text-sm text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                    >
                      View all students
                    </button>
                    <button
                      onClick={() => setFbSearchType('simple')}
                      className="px-4 py-2 text-sm text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                    >
                      Try a different subject
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default FindBuddiesTab;