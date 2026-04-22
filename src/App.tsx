import { useState, type FormEvent } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { Home, Compass, PlaySquare, User, CheckCircle2, ChevronRight, Search, MapPin, Clock, Award, PlayCircle, Star, Users, Leaf, Calendar, FileText, Settings, ShieldCheck, Activity, LogOut, ArrowRight, Heart, Medal, Map, Plus, X, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

// Data Models
type Role = 'volunteer' | 'community' | 'admin';

const PROJECTS = [
  {
    id: 1,
    title: '社区花廊共建项目',
    type: '环境美化',
    time: '2026.04.25 - 05.01',
    location: '阳光新村南区',
    skills: ['园林', '设计', '体力'],
    image: '/flower-gallery.png',
    tags: ['急招', '专业对口'],
    requiredTraining: ['花廊设计基础', '安全施工规范'],
    participants: 12,
    totalNeeded: 20,
    desc: '我们需要建设一个社区花廊，为小区居民提供一个休闲散步、邻里交流的美丽空间。项目包含花架搭建、藤蔓植物种植、以及周边环境的美化。我们寻找有园艺兴趣或愿意参与体力劳动的志愿者。'
  },
  {
    id: 2,
    title: '周末助老伴行计划',
    type: '助老服务',
    time: '长期周末',
    location: '幸福街道敬老院',
    skills: ['沟通', '耐心', '医疗基础'],
    image: 'https://images.unsplash.com/photo-1516307365426-bea591f05011?q=80&w=2070&auto=format&fit=crop',
    tags: ['持续招募'],
    requiredTraining: ['老年人心理学', '急救常识'],
    participants: 45,
    totalNeeded: 50,
    desc: '陪伴敬老院的老人们度过周末时光，包括聊天、散步、读书、教老人使用智能手机等。你的陪伴能给他们带来巨大的精神慰藉。'
  },
  {
    id: 3,
    title: '社区文化墙彩绘',
    type: '文化艺术',
    time: '2026.05.10 - 05.15',
    location: '文化广场北侧',
    skills: ['绘画', '设计'],
    image: 'https://images.unsplash.com/photo-1499892477393-f675706cbe6e?q=80&w=2070&auto=format&fit=crop',
    tags: ['艺术'],
    requiredTraining: ['户外墙绘基础'],
    participants: 3,
    totalNeeded: 8,
    desc: '以“和谐社区，绿色家园”为主题，对社区北侧的一段长墙进行艺术彩绘。我们提供所有绘画材料，欢迎有绘画基础的同学报名，共同打造社区新地标。'
  },
  {
    id: 4,
    title: '垃圾分类科普讲座',
    type: '科普宣传',
    time: '2026.04.28 14:00',
    location: '社区服务中心',
    skills: ['演讲', '知识储备'],
    image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=2070&auto=format&fit=crop',
    tags: ['周末', '短时'],
    requiredTraining: ['垃圾分类新规'],
    participants: 2,
    totalNeeded: 5,
    desc: '在社区服务中心为居民开展一场生动有趣的垃圾分类科普讲座。你需要熟悉最新的垃圾分类政策，并能通过互动问答等形式调动现场气氛。'
  }
];

const COURSES = [
  { id: 1, title: '花廊设计基础', type: '专项培训', duration: '12:45', views: '2.1k', img: '/flower-gallery.png', required: true, desc: '本课程专为“社区花廊共建项目”设计，详细讲解花廊的基础结构、选材标准、搭建步骤以及植物配置。无论你是否有园林经验，都能通过本视频快速掌握花廊建设的核心要点。' },
  { id: 2, title: '安全施工规范', type: '基础培训', duration: '08:20', views: '5.4k', img: '/safety-training.jpg', required: true, desc: '志愿服务千万条，安全第一条。本视频详细讲解了户外志愿服务中可能遇到的风险及防范措施，包括工具使用规范、中暑预防等。' },
  { id: 3, title: '志愿服务沟通技巧', type: '技能培训', duration: '15:30', views: '1.2k', img: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=600&auto=format&fit=crop', required: false, desc: '良好的沟通是服务顺利开展的桥梁。本课程教你如何与不同年龄段的居民、服务对象进行有效且温暖的沟通。' },
  { id: 4, title: '社区文化活动策划', type: '专项培训', duration: '22:10', views: '800', img: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=600&auto=format&fit=crop', required: false, desc: '从0到1策划一场成功的社区活动。包括需求调研、流程设计、人员分工、物资筹备及应急预案。' },
];

// App Component
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<Role>('volunteer');
  // 模拟全局状态：已完成的课程 ID 列表
  const [completedCourses, setCompletedCourses] = useState<number[]>([]);

  if (!isAuthenticated) {
    return (
      <BrowserRouter>
        <LoginPage onLogin={(r: Role) => { setRole(r); setIsAuthenticated(true); }} />
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans selection:bg-emerald-200">
        <Navbar role={role} onLogout={() => setIsAuthenticated(false)} />
        
        <main className="pb-24 pt-16">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={role === 'volunteer' ? <HomePage /> : <PersonalCenter role={role} completedCourses={completedCourses} />} />
              <Route path="/projects" element={<ProjectHall />} />
              <Route path="/project/:id" element={<ProjectDetail completedCourses={completedCourses} />} />
              <Route path="/training" element={<TrainingCenter />} />
              <Route path="/video/:id" element={<VideoPlayer completedCourses={completedCourses} setCompletedCourses={setCompletedCourses} />} />
              <Route path="/profile" element={<PersonalCenter role={role} completedCourses={completedCourses} />} />
            </Routes>
          </AnimatePresence>
        </main>
        
        <BottomNav role={role} />
      </div>
    </BrowserRouter>
  );
}

// Components
function LoginPage({ onLogin }: { onLogin: (role: Role) => void }) {
  const [selectedRole, setSelectedRole] = useState<Role>('volunteer');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const roles: { id: Role, title: string, desc: string, icon: any, color: string, bg: string, ring: string }[] = [
    { id: 'volunteer', title: '志愿者', desc: '浏览项目，报名参与，学习技能', icon: User, color: 'text-emerald-500', bg: 'bg-emerald-50', ring: 'ring-emerald-500' },
    { id: 'community', title: '社区 / 街道', desc: '发布需求，管理项目，审核报名', icon: MapPin, color: 'text-blue-500', bg: 'bg-blue-50', ring: 'ring-blue-500' },
    { id: 'admin', title: '平台管理员', desc: '系统管理，数据总览，立项审核', icon: ShieldCheck, color: 'text-indigo-500', bg: 'bg-indigo-50', ring: 'ring-indigo-500' },
  ];

  const submitButtonClassByRole: Record<Role, string> = {
    volunteer: 'bg-emerald-600 hover:bg-emerald-500',
    community: 'bg-blue-600 hover:bg-blue-500',
    admin: 'bg-indigo-600 hover:bg-indigo-500',
  };

  // Hardcoded credentials for demonstration
  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (selectedRole === 'volunteer' && username === 'volunteer' && password === '123456') {
      onLogin('volunteer');
    } else if (selectedRole === 'community' && username === 'community' && password === '123456') {
      onLogin('community');
    } else if (selectedRole === 'admin' && username === 'admin' && password === '123456') {
      onLogin('admin');
    } else {
      setError('账号或密码错误，请检查！(演示账号: volunteer/community/admin, 密码: 123456)');
    }
  };

  // Auto-fill credentials when role changes for easier demo
  const handleRoleSelect = (roleId: Role) => {
    setSelectedRole(roleId);
    setUsername(roleId);
    setPassword('123456');
    setError('');
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl bg-white rounded-[2.5rem] shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[600px]"
      >
        {/* Left Side - Visual */}
        <div className="w-full md:w-5/12 relative p-10 flex flex-col justify-between overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=1000&auto=format&fit=crop" 
            alt="Login Cover" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/60" />
          
          <div className="relative z-10 flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
              <Leaf className="w-6 h-6" />
            </div>
            <span className="font-bold text-2xl text-white tracking-tight">青木志愿</span>
          </div>

          <div className="relative z-10 mt-20 md:mt-0">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
              连接社区需求<br />与青年力量
            </h2>
            <p className="text-neutral-300 text-sm leading-relaxed max-w-sm">
              这是一个服务于社区治理的志愿服务对接与能力提升平台。在这里，你可以找到志同道合的伙伴，共同让社区变得更美好。
            </p>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full md:w-7/12 p-6 sm:p-10 flex flex-col justify-center bg-white h-full md:h-[600px] overflow-y-auto hide-scrollbar">
          <div className="max-w-md w-full mx-auto my-auto py-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-2">欢迎登录</h1>
            <p className="text-neutral-500 text-sm mb-6">请选择您的身份以进入对应的专属工作台</p>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {roles.map(r => (
                <div 
                  key={r.id}
                  onClick={() => handleRoleSelect(r.id)}
                  className={cn(
                    "relative px-3 py-4 rounded-xl border-2 cursor-pointer transition-all duration-200 group flex flex-col items-center justify-center gap-2 text-center",
                    selectedRole === r.id 
                      ? cn("border-transparent ring-2 ring-offset-2", r.ring, r.bg)
                      : "border-neutral-100 hover:border-neutral-200 hover:bg-neutral-50"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                    selectedRole === r.id ? "bg-white shadow-sm" : r.bg,
                    r.color
                  )}>
                    <r.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className={cn("font-bold text-xs sm:text-sm", selectedRole === r.id ? "text-neutral-900" : "text-neutral-700")}>
                      {r.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">账号</label>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="请输入账号 (演示: volunteer/community/admin)"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">密码</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入密码 (演示密码: 123456)"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
                  required
                />
              </div>

              {error && (
                <div className="p-3 bg-rose-50 text-rose-600 text-xs font-medium rounded-xl border border-rose-100">
                  {error}
                </div>
              )}

              <div className="sticky bottom-0 bg-white pt-3">
                <button 
                  type="submit"
                  className={cn(
                    "w-full py-3.5 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg",
                    submitButtonClassByRole[selectedRole]
                  )}
                >
                  登录进入工作台 <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function Navbar({ role, onLogout }: { role: Role; onLogout: () => void }) {
  const isVolunteer = role === 'volunteer';
  const navLinks = isVolunteer 
    ? [
        { path: '/', icon: Home, label: '首页' },
        { path: '/projects', icon: Compass, label: '项目大厅' },
        { path: '/training', icon: PlaySquare, label: '培训中心' },
      ]
    : [
        { path: '/', icon: Home, label: '工作台' },
        { path: '/projects', icon: Compass, label: '项目管理' },
      ];

  return (
    <header className="fixed top-0 w-full bg-white/80 backdrop-blur-xl border-b border-neutral-100 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white">
            <Leaf className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg tracking-tight">青木志愿</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <Link key={link.path} to={link.path} className="px-4 py-2 rounded-full text-sm font-medium text-neutral-600 hover:text-emerald-600 hover:bg-emerald-50 transition-colors flex items-center gap-1.5">
              <link.icon className="w-4 h-4" /> {link.label}
            </Link>
          ))}
        </nav>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-sm font-medium text-neutral-600 bg-neutral-100 px-4 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            {role === 'volunteer' ? '志愿者' : role === 'community' ? '社区街道' : '系统管理'}
          </div>
          <div className="flex items-center gap-3 sm:border-l sm:border-neutral-200 sm:pl-4">
            <Link to="/profile" className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center hover:bg-emerald-200 transition-colors" title="个人中心">
              <User className="w-4 h-4" />
            </Link>
            <button 
              onClick={onLogout}
              className="p-2 text-neutral-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors"
              title="退出登录"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

function BottomNav({ role }: { role: Role }) {
  const location = useLocation();
  
  const isVolunteer = role === 'volunteer';
  const navItems = isVolunteer 
    ? [
        { path: '/', icon: Home, label: '首页' },
        { path: '/projects', icon: Compass, label: '大厅' },
        { path: '/training', icon: PlaySquare, label: '培训' },
        { path: '/profile', icon: User, label: '我的' }
      ]
    : [
        { path: '/', icon: Home, label: '工作台' },
        { path: '/projects', icon: Compass, label: '项目' },
        { path: '/profile', icon: User, label: '设置' }
      ];

  return (
    <div className="fixed bottom-0 w-full bg-white border-t border-neutral-100 pb-safe z-50 md:hidden">
      <div className="flex justify-around items-center h-16 px-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <Link 
              key={item.path} 
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center w-16 gap-1 transition-colors",
                isActive ? "text-emerald-500" : "text-neutral-400"
              )}
            >
              <item.icon className={cn("w-6 h-6", isActive && "fill-emerald-50")} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function HomePage() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 pt-6"
    >
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden h-[400px] flex items-end mb-12 shadow-sm">
        <img 
          src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=2074&auto=format&fit=crop" 
          alt="Hero" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent" />
        <div className="relative z-10 p-8 sm:p-12 w-full max-w-2xl">
          <span className="inline-block px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full mb-4">
            今日推荐
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4 leading-tight">
            让社区因你<br />变得更美好
          </h1>
          <p className="text-neutral-300 text-lg mb-8">
            连接社区需求与青年力量，完成培训，解锁技能，点亮你的志愿星图。
          </p>
          <div className="flex gap-4">
            <Link to="/projects" className="bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-3 rounded-full font-bold transition-all hover:scale-105 active:scale-95">
              寻找项目
            </Link>
            <Link to="/training" className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-8 py-3 rounded-full font-bold transition-all">
              开始学习
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Stats & Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {[
          { label: '本周新增项目', val: '24+', icon: MapPin, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { label: '正在服务志愿者', val: '800+', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: '新上线培训', val: '5', icon: PlaySquare, color: 'text-indigo-500', bg: 'bg-indigo-50' },
          { label: '累计公益时长', val: '1.2W', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-sm flex items-center gap-4">
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", stat.bg, stat.color)}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900">{stat.val}</p>
              <p className="text-xs font-medium text-neutral-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Featured Projects */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <span className="w-1.5 h-6 bg-emerald-500 rounded-full block"></span>
          附近急需
        </h2>
        <Link to="/projects" className="text-emerald-500 font-medium flex items-center gap-1 hover:opacity-80 bg-emerald-50 px-3 py-1 rounded-full text-sm">
          查看全部大厅 <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {PROJECTS.slice(0, 4).map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {/* Skill Journey Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-emerald-900 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500 rounded-full blur-3xl opacity-20 translate-y-1/2 -translate-x-1/4" />
        
        <div className="relative z-10 max-w-xl text-center md:text-left">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">不知道能做些什么？</h2>
          <p className="text-emerald-100 mb-6 text-sm leading-relaxed">
            平台提供零基础的新手志愿培训。看完10分钟的短视频，即可解锁“花廊共建”、“墙绘彩绘”等趣味项目。完成越多，你的志愿达人等级就越高！
          </p>
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            <span className="bg-white/10 text-white px-3 py-1 rounded-full text-xs border border-white/20">🌱 零基础起步</span>
            <span className="bg-white/10 text-white px-3 py-1 rounded-full text-xs border border-white/20">🏆 获得专属证书</span>
            <span className="bg-white/10 text-white px-3 py-1 rounded-full text-xs border border-white/20">✨ 结识同好</span>
          </div>
        </div>
        
        <div className="relative z-10 shrink-0">
          <Link to="/training" className="inline-flex items-center gap-2 bg-white text-emerald-900 px-8 py-4 rounded-2xl font-bold hover:bg-emerald-50 transition-colors shadow-xl">
            <PlayCircle className="w-5 h-5" /> 前往培训中心
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

function ProjectHall() {
  const [filter, setFilter] = useState('全部');
  const filters = ['全部', '环境美化', '助老服务', '文化艺术', '科普宣传'];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 pt-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h1 className="text-3xl font-bold">项目大厅</h1>
        
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input 
            type="text" 
            placeholder="搜索社区、项目类型..." 
            className="w-full md:w-80 bg-white border border-neutral-200 rounded-full py-2.5 pl-12 pr-4 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="flex overflow-x-auto pb-4 mb-6 hide-scrollbar gap-2">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "whitespace-nowrap px-6 py-2 rounded-full font-medium transition-all",
              filter === f 
                ? "bg-neutral-900 text-white shadow-md" 
                : "bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
        {PROJECTS.filter(p => filter === '全部' || p.type === filter).map(project => (
          <div key={project.id} className="break-inside-avoid">
            <ProjectCard project={project} />
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function ProjectCard({ project }: { project: typeof PROJECTS[0] }) {
  return (
    <Link to={`/project/${project.id}`} className="group block">
      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-neutral-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img 
            src={project.image} 
            alt={project.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="bg-white/90 backdrop-blur text-xs font-bold px-3 py-1 rounded-full text-neutral-800">
              {project.type}
            </span>
          </div>
        </div>
        
        <div className="p-5">
          <h3 className="font-bold text-lg mb-2 line-clamp-1 group-hover:text-emerald-600 transition-colors">
            {project.title}
          </h3>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-neutral-500 gap-2">
              <MapPin className="w-4 h-4 text-neutral-400 shrink-0" />
              <span className="truncate">{project.location}</span>
            </div>
            <div className="flex items-center text-sm text-neutral-500 gap-2">
              <Clock className="w-4 h-4 text-neutral-400 shrink-0" />
              <span className="truncate">{project.time}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.skills.map(skill => (
              <span key={skill} className="bg-neutral-50 text-neutral-600 text-xs px-2 py-1 rounded-md border border-neutral-100">
                {skill}
              </span>
            ))}
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t border-neutral-50">
            <div className="flex -space-x-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-6 h-6 rounded-full bg-neutral-200 border-2 border-white" />
              ))}
              <div className="w-6 h-6 rounded-full bg-neutral-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-neutral-500">
                +{project.participants}
              </div>
            </div>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              招募中 ({project.participants}/{project.totalNeeded})
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

import { useParams } from 'react-router-dom';

function ProjectDetail({ completedCourses }: { completedCourses: number[] }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = PROJECTS.find(p => p.id === Number(id)) || PROJECTS[0];
  const [enrolled, setEnrolled] = useState(false);
  const [showTrainingPrompt, setShowTrainingPrompt] = useState(false);

  // Check if all required trainings for this project are completed
  const missingTrainings = project.requiredTraining.filter(trainingName => {
    const course = COURSES.find(c => c.title === trainingName);
    return !course || !completedCourses.includes(course.id);
  });

  const handleEnroll = () => {
    if (enrolled) return;
    if (missingTrainings.length > 0) {
      setShowTrainingPrompt(true);
    } else {
      setEnrolled(true);
    }
  };

  const confirmEnrollment = () => {
    setShowTrainingPrompt(false);
    // Find the ID of the first missing course
    const firstMissingCourse = COURSES.find(c => c.title === missingTrainings[0]);
    navigate(`/video/${firstMissingCourse?.id || 1}?projectId=${project.id}`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-24"
    >
      <div className="mb-4">
        <button onClick={() => navigate(-1)} className="text-sm font-medium text-neutral-500 hover:text-neutral-900 flex items-center gap-1">
          <ChevronRight className="w-4 h-4 rotate-180" /> 返回大厅
        </button>
      </div>
      
      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-neutral-100">
        <div className="h-64 sm:h-96 relative">
          <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-emerald-500 px-3 py-1 rounded-full text-xs font-bold">{project.type}</span>
              <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs font-medium">编号: PRJ-{project.id.toString().padStart(3, '0')}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">{project.title}</h1>
            <p className="opacity-90 flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4" /> {project.location}
            </p>
          </div>
        </div>

        <div className="p-6 sm:p-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="md:col-span-2 space-y-8">
              <section>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-emerald-500 rounded-full block"></span>
                  项目介绍
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  {project.desc}
                </p>
              </section>

              <section>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-emerald-500 rounded-full block"></span>
                  项目流程
                </h3>
                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-neutral-200 before:to-transparent">
                  {[
                    { title: '平台报名', desc: '在线填写资料' },
                    { title: '能力培训', desc: project.requiredTraining.length > 0 ? '完成必修视频课程' : '无强制要求' },
                    { title: '线下集合', desc: '按时到达指定地点' },
                    { title: '项目执行', desc: '协同完成项目任务' }
                  ].map((step, i) => (
                    <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className={cn(
                        "flex items-center justify-center w-10 h-10 rounded-full border-4 border-white font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10 transition-colors",
                        enrolled && i < 2 ? "bg-emerald-500 text-white" : "bg-emerald-100 text-emerald-600"
                      )}>
                        {enrolled && i < 2 ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
                        <h4 className="font-bold text-neutral-900">{step.title}</h4>
                        <p className="text-sm text-neutral-500 mt-1">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="space-y-6">
              <div className="bg-neutral-50 p-6 rounded-3xl border border-neutral-100">
                <h3 className="font-bold text-lg mb-4">招募信息</h3>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between border-b border-neutral-200 pb-2">
                    <span className="text-neutral-500">招募人数</span>
                    <span className="font-medium">{project.participants} / {project.totalNeeded} 人</span>
                  </div>
                  <div className="flex justify-between border-b border-neutral-200 pb-2">
                    <span className="text-neutral-500">服务时间</span>
                    <span className="font-medium text-right w-32">{project.time}</span>
                  </div>
                  <div className="flex justify-between pb-2">
                    <span className="text-neutral-500">能力标签</span>
                    <div className="flex gap-1 flex-wrap justify-end w-32">
                      {project.skills.map(s => (
                        <span key={s} className="bg-white border border-neutral-200 px-2 py-0.5 rounded text-xs">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {project.requiredTraining.length > 0 && (
                <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-amber-900 mb-1">强制培训要求</h3>
                      <p className="text-xs text-amber-700 leading-relaxed mb-3">
                        此项目具备一定专业性和安全风险，报名需完成以下前置培训：
                      </p>
                      <ul className="text-sm font-medium text-amber-800 space-y-1">
                        {project.requiredTraining.map((t, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <PlayCircle className="w-4 h-4" /> {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              <button 
                onClick={handleEnroll}
                disabled={enrolled}
                className={cn(
                  "w-full font-bold py-4 rounded-2xl transition-all shadow-lg",
                  enrolled 
                    ? "bg-neutral-200 text-neutral-500 cursor-not-allowed shadow-none" 
                    : "bg-neutral-900 hover:bg-neutral-800 text-white active:scale-95 shadow-neutral-200"
                )}
              >
                {enrolled ? '已报名' : '立即报名'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Training Prompt Modal */}
      <AnimatePresence>
        {showTrainingPrompt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowTrainingPrompt(false)}
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl"
            >
              <div className="w-16 h-16 bg-amber-100 text-amber-500 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <PlaySquare className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-center mb-2">需要完成培训</h3>
              <p className="text-center text-neutral-500 mb-6 text-sm">
                该项目需要完成以下培训才能参与，是否现在前往学习？
              </p>
              <div className="space-y-2 mb-8 bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                {project.requiredTraining.map((t, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {t}
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowTrainingPrompt(false)}
                  className="flex-1 py-3 rounded-xl font-bold text-neutral-500 bg-neutral-100 hover:bg-neutral-200 transition-colors"
                >
                  稍后再说
                </button>
                <button 
                  onClick={confirmEnrollment}
                  className="flex-1 py-3 rounded-xl font-bold text-white bg-emerald-500 hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-200"
                >
                  去学习
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function TrainingCenter() {
  const [filter, setFilter] = useState('全部课程');
  const filters = ['全部课程', '基础培训', '专项培训', '技能培训'];

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 pt-6"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">成长与培训</h1>
        <p className="text-neutral-500">完成专业培训，解锁更多优质志愿项目</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-2">
          {filters.map((cat) => (
            <button 
              key={cat}
              onClick={() => setFilter(cat)}
              className={cn(
                "w-full text-left px-4 py-3 rounded-xl font-medium transition-colors",
                filter === cat ? "bg-neutral-900 text-white shadow-md" : "hover:bg-neutral-100 text-neutral-600"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
        
        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {COURSES.filter(c => filter === '全部课程' || c.type === filter).map(course => (
            <Link to={`/video/${course.id}`} key={course.id} className="group flex flex-col">
              <div className="relative aspect-video rounded-2xl overflow-hidden mb-3 bg-neutral-100">
                <img src={course.img} alt={course.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur px-2 py-1 rounded text-white text-[10px] font-bold">
                  {course.duration}
                </div>
                {course.required && (
                  <div className="absolute top-2 left-2 bg-amber-500 text-white px-2 py-1 rounded text-xs font-bold shadow-sm">
                    必修
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-emerald-500 shadow-xl">
                    <PlayCircle className="w-6 h-6 ml-1" />
                  </div>
                </div>
              </div>
              <h3 className="font-bold text-neutral-900 mb-1 group-hover:text-emerald-600 transition-colors line-clamp-2">
                {course.title}
              </h3>
              <div className="flex items-center justify-between text-xs text-neutral-500 mt-auto">
                <span className="bg-neutral-100 px-2 py-1 rounded">{course.type}</span>
                <span className="flex items-center gap-1">
                  <PlaySquare className="w-3 h-3" /> {course.views} 次学习
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function VideoPlayer({ completedCourses, setCompletedCourses }: { completedCourses: number[], setCompletedCourses: (courses: number[]) => void }) {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const courseId = Number(id);
  const course = COURSES.find(c => c.id === courseId) || COURSES[0];
  const isCompleted = completedCourses.includes(courseId);

  // Check if we came from a project
  const searchParams = new URLSearchParams(location.search);
  const projectId = searchParams.get('projectId');

  const handleVideoEnd = () => {
    if (!isCompleted) {
      setCompletedCourses([...completedCourses, courseId]);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 pb-24"
    >
      <div className="mb-4">
        <button onClick={() => navigate(-1)} className="text-sm font-medium text-neutral-500 hover:text-neutral-900 flex items-center gap-1 mb-4">
          <ChevronRight className="w-4 h-4 rotate-180" /> 返回
        </button>
        <h1 className="text-2xl font-bold mb-2">{course.title}</h1>
        <div className="flex items-center gap-4 text-sm text-neutral-500">
          <span className="flex items-center gap-1"><PlaySquare className="w-4 h-4" /> {course.views} 播放</span>
          <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 2026-04-15 发布</span>
        </div>
      </div>

      <div className="aspect-video bg-black rounded-3xl overflow-hidden relative mb-6 shadow-2xl group">
        <video 
          className="w-full h-full object-contain"
          controls
          poster={course.img}
          onEnded={handleVideoEnd}
          src="/training-video.mp4"
        >
          您的浏览器不支持视频播放。
        </video>
        
        {/* Progress bar logic relies on native controls now, but we keep the visual completion indicator */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/20 pointer-events-none">
          <div className={cn("h-full bg-emerald-500 transition-all duration-1000", isCompleted ? "w-full" : "w-0")} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm">
            <h3 className="font-bold text-lg mb-4">课程简介</h3>
            <p className="text-neutral-600 leading-relaxed text-sm mb-4">
              {course.desc}
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-neutral-100 text-neutral-600 rounded-full text-xs font-medium">{course.type}</span>
              <span className="px-3 py-1 bg-neutral-100 text-neutral-600 rounded-full text-xs font-medium">实操指导</span>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-neutral-50 p-6 rounded-3xl border border-neutral-100">
            <h3 className="font-bold text-lg mb-4">学习状态</h3>
            {isCompleted ? (
              <div className="flex flex-col items-center text-center p-4 bg-white rounded-2xl border border-emerald-100 shadow-sm">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-2" />
                <h4 className="font-bold text-emerald-900">已完成学习</h4>
                <p className="text-xs text-emerald-600 mt-1">
                  {projectId ? '你现在可以继续报名该项目了' : '你已掌握该项技能'}
                </p>
                <Link to={projectId ? `/project/${projectId}` : '/projects'} className="mt-4 w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-2 rounded-xl text-sm transition-colors block text-center">
                  {projectId ? '继续报名' : '寻找项目'}
                </Link>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center p-4 bg-white rounded-2xl border border-neutral-100 shadow-sm">
                <Clock className="w-12 h-12 text-neutral-300 mb-2" />
                <h4 className="font-bold text-neutral-900">未完成</h4>
                <p className="text-xs text-neutral-500 mt-1">看完视频即可解锁相关报名资格</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function PersonalCenter({ role, completedCourses }: { role: Role, completedCourses: number[] }) {
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [reportGenerating, setReportGenerating] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);
  
  // Mock applicants state
  const [applicants, setApplicants] = useState([
    { id: 1, name: '林晓月', project: '社区花廊共建项目', status: 'pending', time: '10分钟前' },
    { id: 2, name: '王志远', project: '周末助老伴行计划', status: 'pending', time: '2小时前' },
    { id: 3, name: '陈同学', project: '垃圾分类科普讲座', status: 'pending', time: '昨天' }
  ]);

  const handleReview = (id: number, _action: 'approve' | 'reject') => {
    setApplicants(prev => prev.filter(app => app.id !== id));
    // In a real app, this would make an API call
    // We just remove them from the UI for the demo
  };

  const handlePublish = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const type = formData.get('type') as string;
    const participants = Number(formData.get('participants'));
    const desc = formData.get('desc') as string;
    
    const selectedTrainings = Array.from(formData.getAll('trainings')) as string[];

    const newProject = {
      id: Date.now(),
      title,
      type,
      time: '待定',
      location: '阳光新村',
      skills: ['待分配'],
      image: 'https://images.unsplash.com/photo-1593113565694-c8f710f197d1?q=80&w=2074&auto=format&fit=crop',
      tags: ['新发布'],
      requiredTraining: selectedTrainings,
      participants: 0,
      totalNeeded: participants,
      desc
    };
    
    // In a real app we would dispatch newProject to global state here
    console.log("New project published:", newProject);

    // We only simulate closing the modal now to prevent state issues
    setShowPublishModal(false);
  };

  const handleGenerateReport = () => {
    setReportGenerating(true);
    setTimeout(() => {
      setReportGenerating(false);
      setReportGenerated(true);
      setTimeout(() => setReportGenerated(false), 3000);
    }, 2000);
  };

  if (role === 'admin' || role === 'community') {
    const isCommunity = role === 'community';
    const bgClass = isCommunity ? 'bg-blue-500' : 'bg-indigo-500';
    const textClass = isCommunity ? 'text-blue-600' : 'text-indigo-600';
    const lightBgClass = isCommunity ? 'bg-blue-50' : 'bg-indigo-50';

    return (
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-24"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white", bgClass)}>
                {isCommunity ? <MapPin className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
              </div>
              <h1 className="text-3xl font-bold">
                {isCommunity ? '阳光新村南区街道办' : '系统管理中心'}
              </h1>
            </div>
            <p className="text-neutral-500 ml-13">欢迎回来，今日有 5 条待处理事项</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white border border-neutral-200 rounded-xl font-medium text-sm flex items-center gap-2 hover:bg-neutral-50 transition-colors">
              <Settings className="w-4 h-4" /> 设置
            </button>
            {isCommunity && (
              <button 
                onClick={() => setShowPublishModal(true)}
                className={cn("px-4 py-2 text-white rounded-xl font-bold text-sm transition-all active:scale-95 shadow-lg flex items-center gap-1", bgClass)}
              >
                <Plus className="w-4 h-4" /> 发布新需求
              </button>
            )}
          </div>
        </div>

        {/* Data Dashboard */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: isCommunity ? '进行中项目' : '平台活跃项目', val: isCommunity ? '3' : '142', icon: Activity, color: 'text-rose-500', bg: 'bg-rose-50' },
            { label: '累计招募志愿者', val: isCommunity ? '128' : '15.4k', icon: Users, color: textClass, bg: lightBgClass },
            { label: '本月服务总时长', val: isCommunity ? '450h' : '32.1k', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
            { label: '综合好评率', val: '98.5%', icon: Star, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          ].map(stat => (
            <div key={stat.label} className="bg-white p-5 rounded-3xl border border-neutral-100 shadow-sm">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", stat.bg, stat.color)}>
                <stat.icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-neutral-900 mb-0.5">{stat.val}</p>
              <p className="text-xs font-medium text-neutral-500">{stat.label}</p>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">
                  {isCommunity ? '志愿者报名审核' : '新项目立项审核'}
                </h2>
                <button className={cn("text-sm font-medium", textClass)}>查看全部</button>
              </div>
              <div className="space-y-4">
                {applicants.length > 0 ? (
                  applicants.map(app => (
                    <div key={app.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-neutral-50 hover:bg-neutral-100 transition-colors rounded-2xl gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-neutral-200 rounded-full flex items-center justify-center font-bold text-neutral-500 shrink-0">
                          {isCommunity ? app.name[0] : '和'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-neutral-900">{isCommunity ? app.name : '和平街道'}</h4>
                            <span className="text-[10px] bg-white border border-neutral-200 px-1.5 py-0.5 rounded text-neutral-500">
                              {isCommunity ? '待审核' : '新项目'}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-500">申请加入: <span className="font-medium text-neutral-700">{app.project}</span></p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                        <span className="text-xs text-neutral-400">{app.time}</span>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleReview(app.id, 'approve')}
                            className="px-5 py-2 text-xs font-bold text-white bg-neutral-900 rounded-full hover:bg-neutral-800 transition-colors"
                          >
                            通过
                          </button>
                          <button 
                            onClick={() => handleReview(app.id, 'reject')}
                            className="px-5 py-2 text-xs font-bold text-neutral-600 bg-white rounded-full border border-neutral-200 hover:bg-neutral-50 transition-colors"
                          >
                            拒绝
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-neutral-400 text-sm">
                    <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-neutral-200" />
                    <p>暂无待审核事项</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-neutral-900 text-white rounded-3xl border border-neutral-800 shadow-xl p-6 md:p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/4" />
              <h3 className="text-lg font-bold mb-6 relative z-10 flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-400" />
                数据闭环洞察
              </h3>
              
              <div className="space-y-6 relative z-10">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-neutral-400">培训转化率</span>
                    <span className="font-bold text-emerald-400">85%</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 w-[85%]" />
                  </div>
                  <p className="text-xs text-neutral-500 mt-2">完成培训后报名参与项目的比例</p>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-neutral-400">项目完成率</span>
                    <span className="font-bold text-indigo-400">92%</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-400 w-[92%]" />
                  </div>
                  <p className="text-xs text-neutral-500 mt-2">立项后顺利完结的社区项目比例</p>
                </div>
              </div>

              <button 
                onClick={handleGenerateReport}
                disabled={reportGenerating || reportGenerated}
                className="w-full mt-8 bg-white/10 hover:bg-white/20 text-white py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 backdrop-blur disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {reportGenerating ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    正在生成报告...
                  </span>
                ) : reportGenerated ? (
                  <span className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" /> 生成成功
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Download className="w-4 h-4" /> 生成完整数据报告
                  </span>
                )}
              </button>
            </div>

            <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-500" />
                最新反馈与评价
              </h3>
              <div className="space-y-4">
                {[
                  { user: '居民王大爷', text: '小伙子们干活很细心，花廊建好后大家都有个歇脚的地方了，特别好！', rating: 5 },
                  { user: '志愿者小李', text: '前期的视频培训非常有用，到现场后直接就能上手，沟通也很顺畅。', rating: 5 }
                ].map((feedback, i) => (
                  <div key={i} className="border-b border-neutral-100 last:border-0 pb-4 last:pb-0">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-bold text-neutral-900">{feedback.user}</span>
                      <div className="flex text-amber-400">
                        {[...Array(feedback.rating)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                      </div>
                    </div>
                    <p className="text-xs text-neutral-500 leading-relaxed">{feedback.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Publish Modal */}
        <AnimatePresence>
          {showPublishModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm"
                onClick={() => setShowPublishModal(false)}
              />
              <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 20 }} 
                animate={{ scale: 1, opacity: 1, y: 0 }} 
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="relative bg-white rounded-[2rem] w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
              >
                <div className="px-8 py-6 border-b border-neutral-100 flex items-center justify-between shrink-0">
                  <h3 className="text-2xl font-bold flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-emerald-500 rounded-full block"></span>
                    发布新需求
                  </h3>
                  <button 
                    onClick={() => setShowPublishModal(false)}
                    className="p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="p-8 overflow-y-auto custom-scrollbar">
                  <form className="space-y-6" onSubmit={handlePublish}>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-neutral-700">项目标题</label>
                      <input name="title" type="text" placeholder="例如：社区便民理发活动" className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" required />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-neutral-700">项目类型</label>
                        <select name="type" className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all">
                          <option value="环境美化">环境美化</option>
                          <option value="助老服务">助老服务</option>
                          <option value="文化艺术">文化艺术</option>
                          <option value="科普宣传">科普宣传</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-neutral-700">招募人数</label>
                        <input name="participants" type="number" min="1" placeholder="例如：10" className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-neutral-700">前置培训要求 (可选)</label>
                      <div className="grid grid-cols-2 gap-3">
                        {['花廊设计基础', '安全施工规范', '志愿服务沟通技巧', '社区文化活动策划'].map(training => (
                          <label key={training} className="flex items-center gap-3 p-3 rounded-xl border border-neutral-200 cursor-pointer hover:bg-neutral-50 transition-colors">
                            <input name="trainings" value={training} type="checkbox" className="w-4 h-4 text-emerald-500 rounded border-neutral-300 focus:ring-emerald-500" />
                            <span className="text-sm font-medium text-neutral-700">{training}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-neutral-700">需求详情描述</label>
                      <textarea name="desc" rows={4} placeholder="详细描述项目背景、志愿者需要做的工作..." className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all resize-none" required></textarea>
                    </div>

                    <div className="pt-4 border-t border-neutral-100 flex gap-4">
                      <button type="button" onClick={() => setShowPublishModal(false)} className="flex-1 py-4 rounded-xl font-bold text-neutral-600 bg-neutral-100 hover:bg-neutral-200 transition-colors">
                        取消
                      </button>
                      <button type="submit" className="flex-1 py-4 rounded-xl font-bold text-white bg-emerald-500 hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20">
                        确认发布
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  // Volunteer Profile
  const [activeTab, setActiveTab] = useState<'projects' | 'certificates' | 'feedback'>('projects');

  // Define base certificates that user always has, plus any newly completed ones during this session
  const baseCertificates = [
    { id: 101, title: '花廊设计基础结业证书', date: '2026.04.21', color: 'from-emerald-500 to-teal-400', level: '初级技能' },
    { id: 102, title: '户外施工安全规范证书', date: '2026.04.21', color: 'from-amber-500 to-orange-400', level: '必修基础' },
    { id: 103, title: '志愿服务沟通技巧培训', date: '2026.01.12', color: 'from-blue-500 to-indigo-400', level: '软技能' },
  ];

  // Map any newly completed courses (from the app state) that aren't in the base list
  const newCertificates = completedCourses
    .map(courseId => {
      const course = COURSES.find(c => c.id === courseId);
      if (!course) return null;
      // Simple logic to avoid duplicates if title matches roughly
      if (baseCertificates.some(bc => bc.title.includes(course.title.replace('培训', '').replace('基础', '')))) {
        return null;
      }
      return {
        id: course.id,
        title: `${course.title}结业证书`,
        date: new Date().toLocaleDateString('zh-CN').replace(/\//g, '.'),
        color: 'from-purple-500 to-pink-400',
        level: course.type
      };
    })
    .filter(Boolean) as typeof baseCertificates;

  const allCertificates = [...baseCertificates, ...newCertificates];

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-24"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Profile Card & Badges */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-neutral-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-neutral-200 border-4 border-white shadow-lg overflow-hidden mb-4">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop" alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <h1 className="text-2xl font-bold mb-1">林晓月</h1>
              <p className="text-neutral-500 text-sm mb-6">风景园林专业大三学生 | 热爱自然与艺术</p>
              
              <div className="w-full bg-neutral-50 rounded-2xl p-4 flex justify-between items-center mb-6">
                <div className="text-left">
                  <p className="text-xs text-neutral-500 mb-1">当前等级</p>
                  <p className="font-bold text-emerald-600">Lv.4 志愿先锋</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-neutral-500 mb-1">距离下一级还需</p>
                  <p className="font-bold text-neutral-900">12h 服务时长</p>
                </div>
              </div>
              
              <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden mb-2">
                <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 w-[75%]" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Medal className="w-5 h-5 text-amber-500" />
              我的荣誉勋章
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { name: '初出茅庐', icon: '🌱', active: true },
                { name: '园艺达人', icon: '🌻', active: true },
                { name: '百时奉献', icon: '💯', active: false },
                { name: '爱心大使', icon: '❤️', active: false },
                { name: '社区之星', icon: '⭐', active: false },
                { name: '巧手匠人', icon: '🎨', active: true },
              ].map((badge, i) => (
                <div key={i} className={cn(
                  "flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all",
                  badge.active ? "bg-amber-50 border-amber-100" : "bg-neutral-50 border-neutral-100 grayscale opacity-50"
                )}>
                  <div className="text-2xl">{badge.icon}</div>
                  <span className="text-[10px] font-bold text-center text-neutral-700">{badge.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Stats & Tabs */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: '志愿时长', val: '48h', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
              { label: '参与项目', val: '5', icon: MapPin, color: 'text-blue-500', bg: 'bg-blue-50' },
              { label: '完成培训', val: allCertificates.length.toString(), icon: PlaySquare, color: 'text-emerald-500', bg: 'bg-emerald-50' },
              { label: '爱心积分', val: '320', icon: Heart, color: 'text-rose-500', bg: 'bg-rose-50' },
            ].map(stat => (
              <div key={stat.label} className="bg-white p-5 rounded-3xl border border-neutral-100 shadow-sm flex flex-col items-center justify-center text-center">
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-3", stat.bg, stat.color)}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <p className="text-2xl font-bold text-neutral-900 mb-1">{stat.val}</p>
                <p className="text-xs font-medium text-neutral-500">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden min-h-[500px]">
            <div className="border-b border-neutral-100 flex">
              <button 
                onClick={() => setActiveTab('projects')}
                className={cn("px-8 py-4 text-sm transition-colors", activeTab === 'projects' ? "font-bold text-emerald-600 border-b-2 border-emerald-500" : "font-medium text-neutral-500 hover:text-neutral-900")}
              >
                参与的项目
              </button>
              <button 
                onClick={() => setActiveTab('certificates')}
                className={cn("px-8 py-4 text-sm transition-colors", activeTab === 'certificates' ? "font-bold text-emerald-600 border-b-2 border-emerald-500" : "font-medium text-neutral-500 hover:text-neutral-900")}
              >
                我的培训证书
              </button>
              <button 
                onClick={() => setActiveTab('feedback')}
                className={cn("px-8 py-4 text-sm transition-colors", activeTab === 'feedback' ? "font-bold text-emerald-600 border-b-2 border-emerald-500" : "font-medium text-neutral-500 hover:text-neutral-900")}
              >
                服务评价
              </button>
            </div>
            
            <div className="p-6 sm:p-8">
              {activeTab === 'projects' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  
                  {/* Active Project */}
                  <div>
                    <h4 className="text-xs font-bold text-neutral-400 mb-3 uppercase tracking-wider">进行中</h4>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl border border-emerald-100 bg-emerald-50/50 hover:bg-emerald-50 transition-colors group relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500" />
                      <div className="w-full sm:w-32 h-24 rounded-xl overflow-hidden shrink-0">
                        <img src="/flower-gallery.png" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="img" />
                      </div>
                      <div className="flex-1 w-full">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-base text-neutral-900">社区花廊共建项目</h4>
                          <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-md">执行中</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500 mb-3">
                          <span className="flex items-center gap-1"><Map className="w-3.5 h-3.5" /> 阳光新村南区</span>
                          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> 2026.04.25 集合</span>
                        </div>
                        <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {[...Array(3)].map((_, j) => (
                        <div key={j} className="w-6 h-6 rounded-full bg-neutral-200 border-2 border-white" />
                      ))}
                    </div>
                          <span className="text-xs text-neutral-400">等12名志愿者同行</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Completed Projects */}
                  <div>
                    <h4 className="text-xs font-bold text-neutral-400 mb-3 uppercase tracking-wider mt-8">已完成</h4>
                    <div className="space-y-4">
                      {[
                        { title: '垃圾分类科普讲座', date: '2026.03.15', hours: 2, role: '主讲人', img: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=200&auto=format&fit=crop' },
                        { title: '春节社区慰问孤寡老人', date: '2026.02.10', hours: 4, role: '陪护员', img: 'https://images.unsplash.com/photo-1516307365426-bea591f05011?q=80&w=200&auto=format&fit=crop' },
                      ].map((p, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-neutral-100 hover:border-neutral-200 hover:bg-neutral-50 transition-all bg-white">
                          <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                            <img src={p.img} className="w-full h-full object-cover" alt="img" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-bold text-sm text-neutral-900">{p.title}</h4>
                              <span className="text-[10px] font-bold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">+{p.hours} 小时</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-neutral-500">
                              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {p.date}</span>
                              <span className="flex items-center gap-1"><User className="w-3 h-3" /> {p.role}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'certificates' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {allCertificates.map((cert, i) => (
                    <div key={cert.id} className="relative rounded-2xl overflow-hidden p-6 text-white border border-neutral-100 shadow-sm bg-neutral-900 group">
                      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-80 group-hover:opacity-100 transition-opacity", cert.color)} />
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-6">
                          <Award className="w-8 h-8 text-white/80" />
                          <span className="text-[10px] font-bold px-2 py-1 bg-white/20 backdrop-blur rounded-full border border-white/20">
                            {cert.level}
                          </span>
                        </div>
                        <h4 className="font-bold text-lg leading-tight mb-1">{cert.title}</h4>
                        <p className="text-xs text-white/70 mb-4">编号: CERT-{2026000 + i}</p>
                        <div className="flex items-center justify-between text-xs font-medium border-t border-white/20 pt-4">
                          <span>青木志愿平台认证</span>
                          <span>{cert.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'feedback' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-amber-900 mb-1">综合服务评价：非常优秀</h3>
                      <p className="text-sm text-amber-700">您在过往的项目中展现了极高的责任心，深受社区好评。</p>
                    </div>
                    <div className="text-4xl font-black text-amber-500">4.9<span className="text-lg text-amber-600">/5</span></div>
                  </div>

                  <div className="space-y-4">
                    {[
                      { project: '垃圾分类科普讲座', author: '社区王主任', rating: 5, tag: '专业度高', comment: '林同学准备的PPT非常用心，讲得通俗易懂，连老年人都能听明白，互动环节气氛特别好！', date: '2026.03.16' },
                      { project: '春节社区慰问孤寡老人', author: '张奶奶家属', rating: 5, tag: '耐心细致', comment: '特别感谢小姑娘陪我母亲聊了一下午，还帮着打扫了卫生，老人家特别开心。', date: '2026.02.11' },
                    ].map((review, i) => (
                      <div key={i} className="p-5 rounded-2xl border border-neutral-100 bg-white">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-bold text-sm text-neutral-900">{review.author}</h4>
                              <span className="text-[10px] text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">评价了: {review.project}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex text-amber-400">
                                {[...Array(review.rating)].map((_, j) => <Star key={j} className="w-3.5 h-3.5 fill-current" />)}
                              </div>
                              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{review.tag}</span>
                            </div>
                          </div>
                          <span className="text-xs text-neutral-400">{review.date}</span>
                        </div>
                        <p className="text-sm text-neutral-600 leading-relaxed bg-neutral-50 p-3 rounded-xl">"{review.comment}"</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
