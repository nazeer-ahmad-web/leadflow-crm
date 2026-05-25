import axios from "axios";

const API = axios.create({
  baseURL: "https://leadflow-crm-backend-e09e.onrender.com/api";
});

export default API;