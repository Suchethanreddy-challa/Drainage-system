const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = createTransporter();
    const mailOptions = {
      from: `"Smart Drainage System" <${process.env.EMAIL_FROM || 'noreply@smartdrainage.gov'}>`,
      to,
      subject,
      html
    };
    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error(`📧 Email error: ${error.message}`);
    // Don't throw — email failure shouldn't block operations
    return false;
  }
};

const sendStatusUpdateEmail = async (userEmail, complaintId, newStatus, remarks) => {
  const statusColors = {
    'Submitted': '#3B82F6',
    'Under Review': '#F97316',
    'In Progress': '#EAB308',
    'Resolved': '#22C55E'
  };

  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 20px;">
      <div style="background: linear-gradient(135deg, #1E3A8A, #14B8A6); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">🔧 Smart Drainage System</h1>
        <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0;">Complaint Status Update</p>
      </div>
      <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <p style="color: #334155; font-size: 16px;">Your complaint <strong>${complaintId}</strong> has been updated:</p>
        <div style="background: ${statusColors[newStatus] || '#6B7280'}; color: white; padding: 12px 24px; border-radius: 8px; text-align: center; font-size: 18px; font-weight: bold; margin: 20px 0;">
          ${newStatus}
        </div>
        ${remarks ? `<p style="color: #64748B; background: #f1f5f9; padding: 16px; border-radius: 8px; border-left: 4px solid #14B8A6;"><strong>Remarks:</strong> ${remarks}</p>` : ''}
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
        <p style="color: #94A3B8; font-size: 13px; text-align: center;">This is an automated notification from Smart Drainage Management System.</p>
      </div>
    </div>
  `;

  return sendEmail({
    to: userEmail,
    subject: `Complaint ${complaintId} — Status: ${newStatus}`,
    html
  });
};

module.exports = { sendEmail, sendStatusUpdateEmail };
