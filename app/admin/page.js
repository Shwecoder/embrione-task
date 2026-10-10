"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Check if already logged in (from localStorage)
  useEffect(() => {
    const loggedIn = localStorage.getItem("adminLoggedIn");
    if (loggedIn === "true") {
      setIsLoggedIn(true);
      fetchPendingMembers();
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();

    if (email === "admin@embrione.pes.edu" && password === "EmbrioneAdmin@2026") {
      setIsLoggedIn(true);
      localStorage.setItem("adminLoggedIn", "true");
      fetchPendingMembers();
      setMessage("");
    } else {
      setMessage("Invalid email or password");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("adminLoggedIn");
    setMembers([]);
  };

  const fetchPendingMembers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("members")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setMessage("Error fetching members");
    } else {
      setMembers(data || []);
    }
    setLoading(false);
  };

  const updateStatus = async (id, newStatus) => {
    const { error } = await supabase
      .from("members")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      alert("Error updating status: " + error.message);
    } else {
      // Remove from the list after update
      setMembers((prev) => prev.filter((m) => m.id !== id));
    }
  };

  // ========== LOGIN SCREEN ==========
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-gray-900 p-8 rounded-2xl border border-gray-800">
          <h1 className="text-2xl font-bold text-center mb-6">Admin Login</h1>

          {message && (
            <div className="mb-4 p-3 bg-red-900/50 text-red-300 rounded-lg text-center text-sm">
              {message}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm mb-1 text-gray-400">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500"
                placeholder="admin@embrione.pes.edu"
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-400">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500"
                placeholder="Enter password"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ========== DASHBOARD ==========
  return (
    <div className="min-h-screen bg-gray-950 text-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-400 mt-1">Manage pending member applications</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm"
          >
            Logout
          </button>
        </div>

        {/* Counters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 text-center">
            <p className="text-gray-400 text-sm">Pending</p>
            <p className="text-3xl font-bold text-yellow-400 mt-1">{members.length}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 text-center">
            <p className="text-gray-400 text-sm">Total Shown</p>
            <p className="text-3xl font-bold text-blue-400 mt-1">{members.length}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 text-center">
            <p className="text-gray-400 text-sm">Status</p>
            <p className="text-xl font-bold text-green-400 mt-1">Live</p>
          </div>
        </div>

        {/* Pending List */}
        {loading ? (
          <p className="text-center text-gray-400">Loading...</p>
        ) : members.length === 0 ? (
          <div className="text-center py-16 bg-gray-900 rounded-2xl border border-gray-800">
            <p className="text-gray-400 text-lg">No pending applications</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {members.map((member) => (
              <div
                key={member.id}
                className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden"
              >
                <div className="flex">
                  {/* Photo */}
                  <div className="w-32 h-32 flex-shrink-0 bg-gray-800">
                    <img
                      src={member.photo_url}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="p-4 flex-1">
                    <h3 className="font-bold text-lg">{member.name}</h3>
                    <p className="text-blue-400 text-sm">
                      {member.position} • {member.domain}
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      {member.srn} • {member.branch} • Sem {member.semester}
                    </p>
                    <p className="text-gray-300 text-sm mt-2 line-clamp-2">
                      {member.bio || "No bio"}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex border-t border-gray-800">
                  <button
                    onClick={() => updateStatus(member.id, "approved")}
                    className="flex-1 py-3 text-green-400 hover:bg-green-900/30 font-medium transition"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => updateStatus(member.id, "rejected")}
                    className="flex-1 py-3 text-red-400 hover:bg-red-900/30 font-medium transition border-l border-gray-800"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}