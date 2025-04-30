const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000);  // 6-digit OTP (as Number)
};

export default generateOTP;
