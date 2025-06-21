import { useState } from "react";
import {
    Menu,
    LayoutDashboard,
    Clock,
    Bell,
    StickyNote,
    ListTodo,
    Settings,
    LogOut,
} from "lucide-react";
import { Link } from "react-router-dom";

function SideBar() {
    const [open, setOpen] = useState(false);

    const menuItems = [
        { icon: <LayoutDashboard />, label: "Dashboard" },
        { icon: <ListTodo />, label: "Tasks" },
        { icon: <Clock />, label: "Time Tracker" },
        { icon: <StickyNote />, label: "Notes" },
        { icon: <Bell />, label: "Reminders" },
        { icon: <Settings />, label: "Settings" },
    ];

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                onClick={() => setOpen(!open)}
                className="md:hidden p-2 fixed top-4 left-4 z-50 bg-white rounded shadow-md"
            >
                <Menu />
            </button>

            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 h-screen bg-gray-900 text-white w-48 p-6 transform transition-transform duration-300 ease-in-out z-40 ${open ? "translate-x-0" : "-translate-x-full"
                    } md:translate-x-0 md:static md:block`}
            >
                <Link to={"/"} className="text-2xl font-bold mb-8">JikanFlow</Link>

                {/* Main Navigation */}
                <nav className="flex flex-col gap-4 py-10">
                    {menuItems.map((item, idx) => (
                        <button
                            key={idx}
                            className="flex items-center gap-3 py-2 px-3 rounded hover:bg-gray-700 transition text-left"
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>

                {/* Footer: Logout or User */}
                <div className="absolute bottom-6 left-6">
                    <button className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300">
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </>
    );
}

export default SideBar;
