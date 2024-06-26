export const UserClient = {
  async updateUserInfo({
    username,
    password,
  }: {
    username?: string;
    password?: string;
  }) {
    await fetch("/api/user/profile", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
  },
};
