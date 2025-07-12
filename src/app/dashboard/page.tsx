/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Briefcase, DollarSign, Clock, Target, Star, Zap, Activity, ArrowUp, ArrowDown } from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";
import { useDashboardRedirect } from "@/hooks/useDashboardRedirect";
import { RouteGuard } from "@/components/RouteGuard";

export default function DashboardPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const { currentCompany, user } = useAuthContext();

  // Utiliser le hook de redirection
  useDashboardRedirect();

  useEffect(() => {
    setIsLoaded(true);
  }, []);


  // Données pour les graphiques simplifiés
  const revenueData = [
    { month: 'Jan', value: 40 },
    { month: 'Fév', value: 55 },
    { month: 'Mar', value: 65 },
    { month: 'Avr', value: 78 },
    { month: 'Mai', value: 85 },
    { month: 'Jun', value: 92 }
  ];

  const projectStatusData = [
    { name: 'En cours', value: 12, color: '#1EB1D1', percentage: 40 },
    { name: 'Terminés', value: 28, color: '#10b981', percentage: 60 },
    { name: 'En attente', value: 5, color: '#f59e0b', percentage: 25 },
    { name: 'Annulés', value: 2, color: '#ef4444', percentage: 10 }
  ];

  const topServices = [
    { service: 'Développement web', commandes: 25, revenue: 125000, trend: 'up' },
    { service: 'App mobile', commandes: 18, revenue: 95000, trend: 'up' },
    { service: 'Design UX/UI', commandes: 12, revenue: 48000, trend: 'down' },
    { service: 'Conseil', commandes: 8, revenue: 32000, trend: 'up' }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.4,
        when: "beforeChildren",
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const statsVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15
      }
    }
  };

  // Composant de graphique simple
  const SimpleLineChart = ({ data }: { data: any[] }) => {
    const maxValue = Math.max(...data.map(d => d.value));
    const points = data.map((d, i) => {
      const x = (i / (data.length - 1)) * 280;
      const y = 80 - (d.value / maxValue) * 60;
      return `${x},${y}`;
    }).join(' ');

    return (
      <div className="h-24 w-full relative">
        <svg className="w-full h-full" viewBox="0 0 280 80">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1EB1D1" />
              <stop offset="100%" stopColor="#062C57" />
            </linearGradient>
          </defs>
          <motion.polyline
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
          {data.map((d, i) => (
            <motion.circle
              key={i}
              cx={(i / (data.length - 1)) * 280}
              cy={80 - (d.value / maxValue) * 60}
              r="4"
              fill="#1EB1D1"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1, duration: 0.3 }}
            />
          ))}
        </svg>
      </div>
    );
  };

  // Composant de graphique en barres simple
  const SimpleBarChart = ({ data }: { data: any[] }) => {
    const maxValue = Math.max(...data.map(d => d.percentage));

    return (
      <div className="space-y-3">
        {data.map((item, index) => (
          <motion.div
            key={index}
            className="space-y-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex justify-between text-sm">
              <span className="text-gray-700 font-medium">{item.name}</span>
              <span className="text-gray-600">{item.value}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="h-2 rounded-full"
                style={{ backgroundColor: item.color }}
                initial={{ width: 0 }}
                animate={{ width: `${(item.percentage / maxValue) * 100}%` }}
                transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <RouteGuard requireAdmin={true}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 p-6">
        <motion.div
          className="max-w-7xl mx-auto space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
        >
          {/* Header de bienvenue avec informations personnalisées */}
          <motion.div
            variants={itemVariants}
            className="relative overflow-hidden rounded-3xl backdrop-blur-xl bg-gradient-to-r from-white/40 to-white/20 border border-white/30 p-8"
          >
            <motion.div
              className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-[#1EB1D1]/20 to-transparent rounded-full blur-2xl"
              animate={{
                x: [0, 10, 0],
                y: [0, -5, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="relative">
              <motion.h1
                className="text-3xl font-bold bg-gradient-to-r from-[#062C57] to-[#1EB1D1] bg-clip-text text-transparent mb-2"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                Tableau de bord - {currentCompany?.name}
              </motion.h1>
              <motion.p
                className="text-gray-600 text-sm"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                Bienvenue {user?.first_name}, voici un aperçu de vos projets et performances
              </motion.p>
            </div>
          </motion.div>

          {/* Statistiques principales */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
          >
            {[
              {
                icon: Briefcase,
                title: "Projets actifs",
                value: "12",
                change: "+2 ce mois",
                changeType: "up",
                color: "from-blue-400 to-cyan-500",
                bgColor: "from-blue-50 to-cyan-50"
              },
              {
                icon: Users,
                title: "Clients actifs",
                value: "42",
                change: "+8 ce mois",
                changeType: "up",
                color: "from-green-400 to-emerald-500",
                bgColor: "from-green-50 to-emerald-50"
              },
              {
                icon: DollarSign,
                title: "Revenus",
                value: "€28,000",
                change: "+12% ce mois",
                changeType: "up",
                color: "from-purple-400 to-violet-500",
                bgColor: "from-purple-50 to-violet-50"
              },
              {
                icon: Star,
                title: "Satisfaction",
                value: "4.8/5",
                change: "Excellent",
                changeType: "neutral",
                color: "from-orange-400 to-red-500",
                bgColor: "from-orange-50 to-red-50"
              }
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={statsVariants}
                className={`relative overflow-hidden rounded-2xl backdrop-blur-xl bg-gradient-to-br ${stat.bgColor} border border-white/30 p-6 hover:scale-105 transition-transform duration-300`}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <motion.div
                    className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 }}
                  >
                    <stat.icon size={24} className="text-white" />
                  </motion.div>
                  {stat.changeType === "up" && (
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: index * 0.3 }}
                    >
                      <ArrowUp size={16} className="text-green-500" />
                    </motion.div>
                  )}
                </div>
                <motion.h3
                  className="text-2xl font-bold text-gray-800 mb-1"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1, type: "spring", stiffness: 200 }}
                >
                  {stat.value}
                </motion.h3>
                <p className="text-sm text-gray-600 mb-2">{stat.title}</p>
                <motion.p
                  className="text-xs text-green-600 font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                >
                  {stat.change}
                </motion.p>
              </motion.div>
            ))}
          </motion.div>

          {/* Graphiques principaux */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Évolution des revenus */}
            <motion.div
              variants={itemVariants}
              className="backdrop-blur-xl bg-white/30 rounded-3xl p-6 border border-white/30"
            >
              <div className="flex items-center justify-between mb-6">
                <motion.h3
                  className="text-xl font-bold text-gray-800 flex items-center"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Activity className="mr-3 text-[#1EB1D1]" />
                  </motion.div>
                  Évolution des revenus
                </motion.h3>
                <span className="text-sm text-gray-500">6 derniers mois</span>
              </div>
              <SimpleLineChart data={revenueData} />
              <div className="flex justify-between mt-4 text-sm text-gray-600">
                {revenueData.map((d, i) => (
                  <span key={i}>{d.month}</span>
                ))}
              </div>
            </motion.div>

            {/* Statut des projets */}
            <motion.div
              variants={itemVariants}
              className="backdrop-blur-xl bg-white/30 rounded-3xl p-6 border border-white/30"
            >
              <motion.h3
                className="text-xl font-bold text-gray-800 mb-6 flex items-center"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                >
                  <Target className="mr-3 text-[#1EB1D1]" />
                </motion.div>
                Statut des projets
              </motion.h3>
              <SimpleBarChart data={projectStatusData} />
            </motion.div>
          </div>

          {/* Services et activité */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top services */}
            <motion.div
              variants={itemVariants}
              className="backdrop-blur-xl bg-white/30 rounded-3xl p-6 border border-white/30"
            >
              <motion.h3
                className="text-xl font-bold text-gray-800 mb-6 flex items-center"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Zap className="mr-3 text-[#1EB1D1]" />
                </motion.div>
                Top Services
              </motion.h3>
              <motion.div
                className="space-y-4"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: {
                    transition: {
                      staggerChildren: 0.1,
                      delayChildren: 0.3
                    }
                  }
                }}
              >
                {topServices.map((service, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center justify-between p-4 backdrop-blur-md bg-white/40 rounded-2xl border border-white/40 hover:bg-white/60 transition-all duration-300 group"
                    variants={{
                      hidden: { x: -20, opacity: 0 },
                      visible: { x: 0, opacity: 1 }
                    }}
                    whileHover={{ x: 5, scale: 1.02 }}
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="font-medium text-gray-800 group-hover:text-[#062C57] transition-colors">
                          {service.service}
                        </p>
                        {service.trend === 'up' ? (
                          <ArrowUp size={16} className="text-green-500" />
                        ) : (
                          <ArrowDown size={16} className="text-red-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {service.commandes} commandes • €{service.revenue.toLocaleString()}
                      </p>
                    </div>
                    <motion.div
                      className={`w-8 h-8 bg-gradient-to-br ${
                        index === 0 ? 'from-yellow-400 to-orange-500' :
                        index === 1 ? 'from-green-400 to-emerald-500' :
                        index === 2 ? 'from-blue-400 to-cyan-500' :
                        'from-purple-400 to-violet-500'
                      } rounded-full flex items-center justify-center text-white font-bold text-sm`}
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: index * 0.5 }}
                    >
                      {index + 1}
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Activité récente */}
            <motion.div
              variants={itemVariants}
              className="backdrop-blur-xl bg-white/30 rounded-3xl p-6 border border-white/30"
            >
              <motion.h3
                className="text-xl font-bold text-gray-800 mb-6 flex items-center"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Clock className="mr-3 text-[#1EB1D1]" />
                </motion.div>
                Activité récente
              </motion.h3>
              <motion.div
                className="space-y-4"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: {
                    transition: {
                      staggerChildren: 0.1,
                      delayChildren: 0.3
                    }
                  }
                }}
              >
                {[
                  {
                    title: "Nouveau projet",
                    desc: "Dagger-Print ajouté",
                    time: "Il y a 2h",
                    color: "from-blue-400 to-cyan-500"
                  },
                  {
                    title: "Client inscrit",
                    desc: "Mitchell ROSS",
                    time: "Il y a 4h",
                    color: "from-green-400 to-emerald-500"
                  },
                  {
                    title: "Projet terminé",
                    desc: "E-commerce Store",
                    time: "Il y a 1j",
                    color: "from-purple-400 to-violet-500"
                  },
                  {
                    title: "Paiement reçu",
                    desc: "€15,000",
                    time: "Il y a 2j",
                    color: "from-orange-400 to-red-500"
                  }
                ].map((activity, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start space-x-4 p-4 backdrop-blur-md bg-white/40 rounded-2xl border border-white/40 hover:bg-white/60 transition-all duration-300"
                    variants={{
                      hidden: { y: 20, opacity: 0 },
                      visible: { y: 0, opacity: 1 }
                    }}
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    <motion.div
                      className={`w-3 h-3 bg-gradient-to-br ${activity.color} rounded-full mt-2 flex-shrink-0`}
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 text-sm">{activity.title}</p>
                      <p className="text-gray-600 text-sm truncate">{activity.desc}</p>
                      <p className="text-gray-500 text-xs mt-1">{activity.time}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>

          {/* Métriques de performance */}
          <motion.div
            variants={itemVariants}
            className="backdrop-blur-xl bg-white/30 rounded-3xl p-6 border border-white/30"
          >
            <motion.h3
              className="text-xl font-bold text-gray-800 mb-6 flex items-center"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                animate={{ rotate: [0, 180, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                <Target className="mr-3 text-[#1EB1D1]" />
              </motion.div>
              Métriques de performance
            </motion.h3>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.1,
                    delayChildren: 0.3
                  }
                }
              }}
            >
              {[
                {
                  label: "Taux de conversion",
                  value: "68%",
                  target: "70%",
                  progress: 68,
                  color: "from-green-400 to-emerald-500"
                },
                {
                  label: "Temps moyen projet",
                  value: "6.2 sem",
                  target: "6 sem",
                  progress: 85,
                  color: "from-blue-400 to-cyan-500"
                },
                {
                  label: "Satisfaction client",
                  value: "4.8/5",
                  target: "4.5/5",
                  progress: 96,
                  color: "from-purple-400 to-violet-500"
                }
              ].map((metric, index) => (
                <motion.div
                  key={index}
                  className="text-center p-4 backdrop-blur-md bg-white/40 rounded-2xl border border-white/40"
                  variants={{
                    hidden: { scale: 0.8, opacity: 0 },
                    visible: { scale: 1, opacity: 1 }
                  }}
                >
                  <p className="text-sm text-gray-600 mb-2">{metric.label}</p>
                  <motion.p
                    className="text-2xl font-bold text-gray-800 mb-3"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1, type: "spring", stiffness: 200 }}
                  >
                    {metric.value}
                  </motion.p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <motion.div
                      className={`h-2 rounded-full bg-gradient-to-r ${metric.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${metric.progress}%` }}
                      transition={{ duration: 1.5, delay: 0.8 + index * 0.1 }}
                    />
                  </div>
                  <p className="text-xs text-gray-500">Objectif: {metric.target}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </RouteGuard>

  );
}