import { useEffect, useState } from "react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { motion } from "framer-motion";

import toast from "react-hot-toast";

import API from "../services/api";

const Dashboard = () => {

  const [leads, setLeads] = useState([]);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [noteText, setNoteText] =
    useState("");

  const [selectedLead, setSelectedLead] =
    useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
  });

  // Analytics
  const totalLeads = leads.length;

  const contactedLeads = leads.filter(
    (lead) => lead.status === "Contacted"
  ).length;

  const convertedLeads = leads.filter(
    (lead) => lead.status === "Converted"
  ).length;

  // Chart Data
  const chartData = [
    {
      name: "New",
      value:
        totalLeads -
        contactedLeads -
        convertedLeads,
    },

    {
      name: "Contacted",
      value: contactedLeads,
    },

    {
      name: "Converted",
      value: convertedLeads,
    },
  ];

  const COLORS = [
    "#3b82f6",
    "#facc15",
    "#22c55e",
  ];

  // Search + Filter
  const filteredLeads = leads.filter((lead) => {

    const matchesSearch =
      lead.name.toLowerCase().includes(
        search.toLowerCase()
      ) ||
      lead.email.toLowerCase().includes(
        search.toLowerCase()
      );

    const matchesStatus =
      statusFilter === "All" ||
      lead.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Fetch Leads
  const fetchLeads = async () => {

    try {

      const res = await API.get("/leads");

      setLeads(res.data);

    } catch (error) {

      console.log(error);

    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Handle Input Change
  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  // Add Lead
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await API.post("/leads", formData);

      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
      });

      fetchLeads();

      toast.success("Lead Added");

    } catch (error) {

      console.log(error);

    }
  };

  // Update Status
  const updateStatus = async (id, status) => {

    try {

      await API.put(`/leads/${id}`, {
        status,
      });

      fetchLeads();

      toast.success("Status Updated");

    } catch (error) {

      console.log(error);

    }
  };

  // Delete Lead
  const deleteLead = async (id) => {

    try {

      await API.delete(`/leads/${id}`);

      fetchLeads();

      toast.success("Lead Deleted");

    } catch (error) {

      console.log(error);

    }
  };

  // Add Note
  const addNote = async (id) => {

    if (!noteText) return;

    try {

      await API.put(
        `/leads/${id}/notes`,
        {
          text: noteText,
        }
      );

      setNoteText("");

      setSelectedLead(null);

      fetchLeads();

      toast.success("Note Saved");

    } catch (error) {

      console.log(error);

    }
  };

  return (

    <div className="flex">

      {/* Sidebar */}
      <div className="w-64 bg-slate-800 h-screen p-5">

        <h1 className="text-3xl font-bold text-white mb-10">
          LeadFlow
        </h1>

        <ul className="space-y-5 text-gray-300">

          <li className="hover:text-white cursor-pointer">
            Dashboard
          </li>

          <li className="hover:text-white cursor-pointer">
            Leads
          </li>

          <li className="hover:text-white cursor-pointer">
            Analytics
          </li>

          <li className="hover:text-white cursor-pointer">
            Settings
          </li>

        </ul>

      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 bg-slate-900 min-h-screen p-6"
      >

        {/* Header */}
        <div className="flex justify-between items-center mb-10">

          <h2 className="text-4xl font-bold text-white">
            Dashboard
          </h2>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.reload();
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg"
          >
            Logout
          </button>

        </div>

        {/* Add Lead Form */}
        <div className="bg-slate-800 p-6 rounded-xl mb-10">

          <h3 className="text-2xl font-bold text-white mb-5">
            Add New Lead
          </h3>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >

            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="bg-slate-700 text-white p-3 rounded-lg outline-none"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="bg-slate-700 text-white p-3 rounded-lg outline-none"
              required
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              className="bg-slate-700 text-white p-3 rounded-lg outline-none"
            />

            <input
              type="text"
              name="company"
              placeholder="Company"
              value={formData.company}
              onChange={handleChange}
              className="bg-slate-700 text-white p-3 rounded-lg outline-none"
            />

            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg"
            >
              Add Lead
            </button>

          </form>

        </div>

        {/* Analytics Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
        >

          <div className="bg-slate-800 p-6 rounded-xl">

            <h3 className="text-gray-400">
              Total Leads
            </h3>

            <p className="text-4xl font-bold text-white mt-2">
              {totalLeads}
            </p>

          </div>

          <div className="bg-slate-800 p-6 rounded-xl">

            <h3 className="text-gray-400">
              Contacted
            </h3>

            <p className="text-4xl font-bold text-yellow-400 mt-2">
              {contactedLeads}
            </p>

          </div>

          <div className="bg-slate-800 p-6 rounded-xl">

            <h3 className="text-gray-400">
              Converted
            </h3>

            <p className="text-4xl font-bold text-green-400 mt-2">
              {convertedLeads}
            </p>

          </div>

        </motion.div>

        {/* Analytics Chart */}
        <div className="bg-slate-800 p-6 rounded-xl mb-10">

          <h3 className="text-2xl font-bold text-white mb-5">
            Lead Analytics
          </h3>

          <div className="h-80">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <PieChart>

                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label
                >

                  {chartData.map((entry, index) => (

                    <Cell
                      key={index}
                      fill={
                        COLORS[index % COLORS.length]
                      }
                    />

                  ))}

                </Pie>

                <Tooltip />

              </PieChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* Search + Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">

          <input
            type="text"
            placeholder="Search leads..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="bg-slate-800 text-white p-3 rounded-lg flex-1 outline-none"
          />

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            className="bg-slate-800 text-white p-3 rounded-lg outline-none"
          >

            <option value="All">
              All
            </option>

            <option value="New">
              New
            </option>

            <option value="Contacted">
              Contacted
            </option>

            <option value="Converted">
              Converted
            </option>

          </select>

        </div>

        {/* Leads Table */}
        <div className="bg-slate-800 p-6 rounded-xl overflow-x-auto">

          <h3 className="text-2xl font-bold text-white mb-5">
            Leads
          </h3>

          <table className="w-full text-left text-gray-300">

            <thead>

              <tr className="border-b border-slate-700">

                <th className="pb-3">
                  Name
                </th>

                <th>
                  Email
                </th>

                <th>
                  Status
                </th>

                <th>
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredLeads.map((lead) => (

                <>
                  <tr
                    key={lead._id}
                    className="border-b border-slate-700"
                  >

                    <td className="py-4">
                      {lead.name}
                    </td>

                    <td>
                      {lead.email}
                    </td>

                    <td>

                      <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm">
                        {lead.status}
                      </span>

                    </td>

                    <td className="space-x-2">

                      <button
                        onClick={() =>
                          updateStatus(
                            lead._id,
                            "Contacted"
                          )
                        }
                        className="bg-yellow-500 text-black px-3 py-1 rounded"
                      >
                        Contacted
                      </button>

                      <button
                        onClick={() =>
                          updateStatus(
                            lead._id,
                            "Converted"
                          )
                        }
                        className="bg-green-500 text-black px-3 py-1 rounded"
                      >
                        Convert
                      </button>

                      <button
                        onClick={() =>
                          deleteLead(lead._id)
                        }
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>

                      <button
                        onClick={() =>
                          setSelectedLead(
                            lead._id
                          )
                        }
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                      >
                        Notes
                      </button>

                    </td>

                  </tr>

                  {/* Notes Section */}
                  {selectedLead === lead._id && (

                    <tr>

                      <td
                        colSpan="4"
                        className="bg-slate-700 p-4"
                      >

                        <input
                          type="text"
                          placeholder="Add note..."
                          value={noteText}
                          onChange={(e) =>
                            setNoteText(
                              e.target.value
                            )
                          }
                          className="w-full bg-slate-800 text-white p-3 rounded-lg mb-3 outline-none"
                        />

                        <button
                          onClick={() =>
                            addNote(lead._id)
                          }
                          className="bg-green-500 text-white px-4 py-2 rounded"
                        >
                          Save Note
                        </button>

                        <div className="mt-4 space-y-2">

                          {lead.notes?.map(
                            (note, index) => (

                              <div
                                key={index}
                                className="bg-slate-800 p-3 rounded text-white"
                              >

                                <p>
                                  {note.text}
                                </p>

                              </div>

                            )
                          )}

                        </div>

                      </td>

                    </tr>

                  )}

                </>

              ))}

            </tbody>

          </table>

        </div>

      </motion.div>

    </div>

  );
};

export default Dashboard;