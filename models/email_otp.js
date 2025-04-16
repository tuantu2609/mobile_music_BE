module.exports = (sequelize, DataTypes) => {
    const EmailOtp = sequelize.define(
      "EmailOtp",
      {
        email: {
          type: DataTypes.STRING,
          primaryKey: true,
        },
        otp: DataTypes.STRING,
        expires_at: DataTypes.DATE,
      },
      {
        tableName: "email_otp",
        timestamps: false,
      }
    );
    return EmailOtp;
  };
  