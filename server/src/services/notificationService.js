/**
 * Notification Service
 * Handles alerts via SMS, WhatsApp, and general notification logging.
 */

export const sendSMS = async (phone, message) => {
  console.log(`[Notification Service] Sending SMS to ${phone}: ${message}`);
  return new Promise((resolve) => setTimeout(resolve, 50));
};

export const sendWhatsApp = async (phone, message) => {
  console.log(`[Notification Service] Sending WhatsApp to ${phone}: ${message}`);
  return new Promise((resolve) => setTimeout(resolve, 50));
};

/**
 * sendEmergencyAlert
 * Dispatches alerts to all emergency contacts via multiple channels.
 */
export const sendEmergencyAlert = async (user, contacts, location) => {
  const message = `EMERGENCY ALERT: ${user.name} is experiencing an asthma emergency at ${location}. Please check on them immediately.`;

  console.log(`[Notification Service] Dispatching emergency alerts for ${user.name}...`);

  const promises = contacts.map(async (contact) => {
    // Attempt Email if provided
    if (contact.email) {
      console.log(`[Notification Service] Alerting via Email: ${contact.email}`);
    }

    // Attempt SMS if phone provided
    if (contact.phone) {
      await sendSMS(contact.phone, message);
    }

    // Attempt WhatsApp if phone provided
    if (contact.phone) {
      await sendWhatsApp(contact.phone, message);
    }
  });

  await Promise.all(promises);
};

export default {
  sendSMS,
  sendWhatsApp,
  sendEmergencyAlert,
};
