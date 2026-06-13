import axios from "axios";

const API = axios.create({
  baseURL: "https://task-allotment-webapp-7v1d.vercel.app/",
});

export default API;