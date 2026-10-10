"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function TeamPage() {
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [domainFilter, setDomainFilter] = useState("All");
  const [positionFilter, setPositionFilter] = useState("All");

  useEffect(() => {
    fetchApprovedMembers();
  }, []);

  useEffect(() => {
    let result = members;

    if (domainFilter !== "All") {
      result = result.filter((m) => m.domain === domainFilter);
    }
    if (positionFilter !== "All") {
      result = result.filter((m) => m.position === positionFilter);
    }

    setFilteredMembers(result);
  }, [domainFilter, positionFilter, members]);

  const fetchApprovedMembers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("members")
      .select("*")
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setMembers(data || []);
      setFilteredMembers(data || []);
    }
    setLoading(false);
  };

  const domains = [
    "All",
    "Web Development",
    "Design",
    "Logistics",
    "Operations",
    "Sponsorship",
    "Hospitality",
    "Social Media",
    "Event Management",
  ];

  const positions = ["All", "Head", "Vice-Head", "Core Member", "Member"];

  return (
    <div className="min-h-screen bg-gray-950 text-white py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2">Meet The Team</h1>
          <p className="text-gray-400">
            Our approved members of Embrione
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10 justify-center">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Domain</label>
            <select
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value)}
              className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            >
              {domains.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Position</label>
            <select
              value={positionFilter}
              onChange={(e) => setPositionFilter(e.target.value)}
              className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            >
              {positions.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Members Grid */}
        {loading ? (
          <p className="text-center text-gray-400">Loading members...</p>
        ) : filteredMembers.length === 0 ? (
          <div className="text-center py-20 bg-gray-900 rounded-2xl border border-gray-800">
            <p className="text-gray-400 text-lg">No approved members found</p>
            <p className="text-gray-500 text-sm mt-2">
              Approve some members from the Admin panel
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member) => (
              <div
                key={member.id}
                className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-blue-600 transition"
              >
                {/* Photo */}
                <div className="h-48 bg-gray-800 overflow-hidden">
                  <img
                    src={member.photo_url}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="p-5">
                  <h3 className="text-xl font-bold truncate">{member.name}</h3>
                  <p className="text-blue-400 text-sm mt-1">
                    {member.position} • {member.domain}
                  </p>

                  <div className="mt-3 text-sm text-gray-400 space-y-1">
                    <p>
                      {member.branch} • Semester {member.semester}
                    </p>
                    <p className="text-gray-500">{member.srn}</p>
                  </div>

                  {member.bio && (
                    <p className="mt-3 text-sm text-gray-300 line-clamp-3">
                      {member.bio}
                    </p>
                  )}

                  {/* Links */}
                  <div className="mt-4 flex gap-2">
                    {member.linkedin_url && (
                      <a
                        href={member.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full hover:bg-blue-600/40"
                      >
                        LinkedIn
                      </a>
                    )}
                    {member.github_url && (
                      <a
                        href={member.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs bg-gray-700 text-gray-300 px-3 py-1 rounded-full hover:bg-gray-600"
                      >
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}