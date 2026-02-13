const AdminFooter = () => {
  return (
    <div className="h-12 bg-white border-t 
                    flex items-center justify-center 
                    text-sm text-gray-500">

      © {new Date().getFullYear()} SmartBazar Admin Panel
    </div>
  );
};

export default AdminFooter;
