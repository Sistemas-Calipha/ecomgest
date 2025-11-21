export default function Navbar({ onLogout }) {
  return (
    <div className="w-full h-16 bg-white shadow flex items-center px-6 justify-between sticky top-0 z-50">
      <h1 className="text-xl font-semibold">Dashboard</h1>

      <div className="flex items-center gap-4">
        <span className="text-gray-600">Erick</span>
        <button
          onClick={onLogout}
          className="text-sm border border-gray-300 rounded-full px-3 py-1 hover:bg-gray-100 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
