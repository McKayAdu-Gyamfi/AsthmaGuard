/**
 * Email Service Stub
 * In production, this would use nodemailer or a service like SendGrid/AWS SES.
 */
export const sendEmail = async (to, subject, body) => {
  console.log(`[Email Service] Sending email to: ${to}`);
  console.log(`[Email Service] Subject: ${subject}`);
  console.log(`[Email Service] Body: ${body}`);
  
  // Simulate network delay
  return new Promise((resolve) => setTimeout(resolve, 100));
};

export default { sendEmail };
