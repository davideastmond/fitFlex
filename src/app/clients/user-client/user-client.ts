export const UserClient = {
  async updateUserInfo({ username }: { username: string }) {
    const req = await fetch("/api/user/profile", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    });
  },
};
