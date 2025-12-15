import { Users, Activity, FileText } from 'lucide-react';

const Dashboard = () => {
  return (
    <>
      <h2 className="text-2xl font-bold mb-6">Tổng quan hệ thống</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Bệnh nhân" value="12" icon={Users} />
        <StatCard title="Bài tập" value="5" icon={Activity} />
        <StatCard title="Báo cáo mới" value="3" icon={FileText} />
      </div>

      <div className="bg-white p-6 rounded shadow-sm">
        <h3 className="font-bold mb-4">Hoạt động gần đây</h3>
        <p className="text-gray-500 italic text-center">
          Chưa có dữ liệu...
        </p>
      </div>
    </>
  );
};

const StatCard = ({ title, value, icon: Icon }: any) => (
  <div className="bg-white p-6 rounded shadow-sm flex justify-between">
    <div>
      <p className="text-gray-500 text-sm uppercase">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
    <div className="p-3 bg-blue-100 rounded-full">
      <Icon />
    </div>
  </div>
);

export default Dashboard;
