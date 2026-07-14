class User {
  static tableName = "users";

  constructor(row = {}) {
    this.id = row.id;
    this.firstName = row.first_name || row.firstName;
    this.lastName = row.last_name || row.lastName;
    this.name = row.name || `${this.firstName || ""} ${this.lastName || ""}`.trim();
    this.email = row.email;
    this.mobile = row.mobile_no || row.mobileNo;
    this.passwordHash = row.password_hash || row.passwordHash;
    this.createdAt = row.created_at || row.createdAt;
  }
}

export default User;
