import prisma from "../config/prisma.js";

const userPublicSelect = {
  id: true,
  email: true,
  fullName: true,
  role: true,
  createdAt: true,
};

class UserService {
  async createUser(user) {
    return prisma.user.create({
      data: user,
      select: userPublicSelect,
    });
  }

  async getUsers() {
    return prisma.user.findMany({
      select: userPublicSelect,
      orderBy: { createdAt: "asc" },
    });
  }
}

export default new UserService();
