const IconWithCount = ({ icon: Icon, count, active }) => {
  return (
    <div className={`flex items-center gap-2 text-gray-600 ${active ? 'text-blue-500' : ''}`}>
      <Icon className={`text-[20px] ${active ? 'text-blue-500' : 'text-gray-600'}`} />
      <span className="text-sm font-medium">{count}</span>
    </div>
  );
};

export default IconWithCount;
