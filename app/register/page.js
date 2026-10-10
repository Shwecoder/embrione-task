"use client";

import { useState } from "react";
import imageCompression from "browser-image-compression";
import { supabase } from "../../lib/supabase";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    domain: "",
    position: "",
    srn: "",
    email: "",
    linkedin_url: "",
    github_url: "",
    branch: "",
    semester: "",
    bio: "",
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!photoFile) {
      alert("Please select a profile picture");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // 1. Compress & convert to WebP
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 800,
        useWebWorker: true,
        fileType: "image/webp",
      };

      const compressedFile = await imageCompression(photoFile, options);

      // 2. Create a unique file name
      const fileName = `${Date.now()}-${formData.srn}.webp`;

      // 3. Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("member-photos")
        .upload(fileName, compressedFile, {
          contentType: "image/webp",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // 4. Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("member-photos").getPublicUrl(fileName);

      // 5. Insert into members table
      const { error: insertError } = await supabase.from("members").insert([
        {
          name: formData.name,
          domain: formData.domain,
          position: formData.position,
          srn: formData.srn,
          email: formData.email,
          linkedin_url: formData.linkedin_url || null,
          github_url: formData.github_url || null,
          branch: formData.branch,
          semester: parseInt(formData.semester),
          bio: formData.bio || null,
          photo_url: publicUrl,
          status: "pending",
        },
      ]);

      if (insertError) throw insertError;

      // Success
      setMessage("✅ Application submitted successfully! Status: pending");
      // Optional: reset form
      setFormData({
        name: "",
        domain: "",
        position: "",
        srn: "",
        email: "",
        linkedin_url: "",
        github_url: "",
        branch: "",
        semester: "",
        bio: "",
      });
      setPhotoFile(null);
      setPhotoPreview(null);
    } catch (error) {
      console.error(error);
      setMessage("❌ Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2">Member Registration</h1>
        <p className="text-center text-gray-400 mb-10">
          Fill the form and see your member card update live
        </p>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg text-center ${
              message.includes("✅") ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300"
            }`}
          >
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* ========== FORM ========== */}
          <form onSubmit={handleSubmit} className="bg-gray-900 p-6 rounded-2xl border border-gray-800 space-y-5">
            {/* ... keep all the same form fields as before ... */}
            {/* I kept the structure identical so you can just replace the whole file */}

            <div>
              <label className="block text-sm mb-1">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                placeholder="Enter your full name"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Domain *</label>
                <select
                  name="domain"
                  value={formData.domain}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
                >
                  <option value="">Select Domain</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Design">Design</option>
                  <option value="Logistics">Logistics</option>
                  <option value="Operations">Operations</option>
                  <option value="Sponsorship">Sponsorship</option>
                  <option value="Hospitality">Hospitality</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Event Management">Event Management</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1">Position *</label>
                <select
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
                >
                  <option value="">Select Position</option>
                  <option value="Head">Head</option>
                  <option value="Vice-Head">Vice-Head</option>
                  <option value="Core Member">Core Member</option>
                  <option value="Member">Member</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">SRN *</label>
                <input
                  type="text"
                  name="srn"
                  value={formData.srn}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
                  placeholder="PES1UG23CS001"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
                  placeholder="your.email@pes.edu"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">LinkedIn URL</label>
                <input
                  type="url"
                  name="linkedin_url"
                  value={formData.linkedin_url}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
                  placeholder="https://linkedin.com/in/..."
                />
              </div>

              <div>
                <label className="block text-sm mb-1">GitHub URL</label>
                <input
                  type="url"
                  name="github_url"
                  value={formData.github_url}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
                  placeholder="https://github.com/..."
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Branch *</label>
                <select
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
                >
                  <option value="">Select Branch</option>
                  <option value="CSE">CSE</option>
                  <option value="AIML">AIML</option>
                  <option value="ECE">ECE</option>
                  <option value="EEE">EEE</option>
                  <option value="ME">ME</option>
                  <option value="Biotech">Biotech</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1">Semester *</label>
                <select
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
                >
                  <option value="">Select</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <option key={sem} value={sem}>
                      {sem}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1">Short Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="3"
                maxLength="200"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
                placeholder="Write a short description about yourself (max 200 characters)"
              />
              <p className="text-xs text-gray-500 mt-1">{formData.bio.length}/200</p>
            </div>

            <div>
              <label className="block text-sm mb-1">Profile Picture *</label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                required
                className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-medium py-3 rounded-lg transition"
            >
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          </form>

          {/* ========== LIVE CARD PREVIEW ========== */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-sm bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 overflow-hidden shadow-2xl">
              <div className="h-48 bg-gray-800 flex items-center justify-center overflow-hidden">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-gray-700 flex items-center justify-center text-4xl text-gray-500">
                    👤
                  </div>
                )}
              </div>

              <div className="p-6">
                <h2 className="text-xl font-bold truncate">
                  {formData.name || "Your Name"}
                </h2>
                <p className="text-blue-400 text-sm mt-1">
                  {formData.position || "Position"} • {formData.domain || "Domain"}
                </p>

                <div className="mt-4 space-y-1 text-sm text-gray-400">
                  <p>
                    <span className="text-gray-500">SRN:</span>{" "}
                    {formData.srn || "PES1UG23XXXX"}
                  </p>
                  <p>
                    <span className="text-gray-500">Branch:</span>{" "}
                    {formData.branch || "CSE"} • Sem {formData.semester || "X"}
                  </p>
                </div>

                <p className="mt-4 text-sm text-gray-300 line-clamp-3">
                  {formData.bio || "Your short bio will appear here..."}
                </p>

                <div className="mt-5 flex gap-3">
                  {formData.linkedin_url && (
                    <span className="text-xs bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full">
                      LinkedIn
                    </span>
                  )}
                  {formData.github_url && (
                    <span className="text-xs bg-gray-700 text-gray-300 px-3 py-1 rounded-full">
                      GitHub
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}