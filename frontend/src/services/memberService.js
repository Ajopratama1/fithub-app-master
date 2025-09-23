import api from "./api";

const memberService = {
  // Panggil rute backend yang baru dibuat
  getDashboardData: () => api.get("/members/dashboard"),

  getAllMembers: () => api.get("/members"),
  createMember: (data) => api.post("/members", data),
  updateMember: (id, data) => api.put(`/members/${id}`, data),
  deleteMember: (id) => api.delete(`/members/${id}`),

  getMemberProfile: () => api.get("/members/profile"),
  getMemberAttendance: () => api.get("/members/attendance"),

  uploadProfileImage: (formData) =>
    api.post("/members/profile-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

export default memberService;