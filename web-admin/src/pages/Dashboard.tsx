import { useEffect, useState } from 'react';
import { Users, Activity, FileText, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import axiosClient from '../utils/axiosClient';

const COLORS: any = {
  'Đang điều trị': '#22c55e', // Xanh lá
  'Hoàn thành': '#3b82f6',    // Xanh dương
  'Tạm hoãn': '#f59e0b',      // Vàng cam
  'Đã hủy': '#ef4444',        // Đỏ
  'Chưa xác định': '#9ca3af'  // Xám
};

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  
  const [stats, setStats] = useState({
    patientsTreating: 0,
    totalExercises: 0,
    newReports: 0
  });
  
  const [statusData, setStatusData] = useState<any[]>([]);
  const [activityData, setActivityData] = useState<any[]>([]);

  useEffect(() => {
    const fetchRealData = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get('/dashboard');
        console.log("👉 Dữ liệu Server trả về:", res);
        const { summary, statusDist, weeklyActivity } = res.data;

        setStats({
          patientsTreating: summary.treatingCount,
          totalExercises: summary.exerciseCount,
          newReports: summary.newReportsCount
        });

        if (statusDist.length > 0) {
           setStatusData(statusDist);
        } else {
           setStatusData([{ name: 'Chưa có dữ liệu', value: 1 }]);
        }

        setActivityData(weeklyActivity);
      } catch (error) {
        console.error("Lỗi tải dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRealData();
  }, []);

  if (loading) {
    return <div className="p-12 text-center text-blue-600 font-medium">Đang tải dữ liệu thống kê...</div>;
  }

  return (
    <div className="p-6 font-sans text-gray-800 animate-in fade-in">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Tổng quan hệ thống</h2>

      {/* 1. CARDS SỐ LIỆU  */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
            title="Hồ sơ đang điều trị" 
            value={stats.patientsTreating} 
            icon={Users} 
            color="bg-blue-100 text-blue-600"
        />
        <StatCard 
            title="Kho bài tập" 
            value={stats.totalExercises} 
            icon={Activity} 
            color="bg-green-100 text-green-600"
        />
        <StatCard 
            title="Báo cáo mới (Hôm nay)" 
            value={stats.newReports} 
            icon={FileText} 
            color="bg-orange-100 text-orange-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 2. BIỂU ĐỒ TRÒN: DỮ LIỆU */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="font-bold text-lg mb-4 text-gray-700">Tỷ lệ trạng thái hồ sơ</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#ccc'} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. BIỂU ĐỒ CỘT: DỮ LIỆU */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
             <h3 className="font-bold text-lg text-gray-700">Báo cáo luyện tập (7 ngày qua)</h3>
             <div className="p-2 bg-gray-50 rounded-lg">
                <TrendingUp size={20} className="text-blue-500"/>
             </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip 
                    cursor={{fill: '#f3f4f6'}}
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="reports" name="Số lượng báo cáo" fill="#1ec8a5" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color }: any) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex justify-between items-center transition hover:shadow-md">
    <div>
      <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">{title}</p>
      <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
    </div>
    <div className={`p-4 rounded-full ${color}`}>
      <Icon size={24} />
    </div>
  </div>
);

export default Dashboard;