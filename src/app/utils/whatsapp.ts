import { CartItem } from "@/app/context/CartContext";

const KITCHEN_WHATSAPP_NUMBER = "917678310566"; // Aroma Kitchen WhatsApp Phone

export interface CheckoutOrderDetails {
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryType: "asap" | "scheduled";
  scheduledTime?: string;
  specialNotes?: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  grandTotal: number;
}

export interface PartyOrderDetails {
  name: string;
  phone: string;
  eventDate: string;
  eventTime: string;
  guestCount: number | string;
  mealType: string;
  dietaryPreference: string;
  dishRequests: string;
  deliveryAddress: string;
  specialInstructions?: string;
}

/**
 * Creates the encoded WhatsApp checkout link for daily cart orders.
 */
export function generateCartWhatsAppUrl(details: CheckoutOrderDetails): string {
  const {
    customerName,
    customerPhone,
    deliveryAddress,
    deliveryType,
    scheduledTime,
    specialNotes,
    items,
    subtotal,
    deliveryFee,
    grandTotal,
  } = details;

  const itemsList = items
    .map((item, index) => {
      const price = item.priceNumeric || 0;
      const totalItemCost = price * item.quantity;
      return `${index + 1}. *${item.name}* x ${item.quantity} = ₹${totalItemCost}`;
    })
    .join("\n");

  const timingText =
    deliveryType === "asap"
      ? "⚡ As soon as possible (Freshly prepared)"
      : `🕒 Scheduled for: ${scheduledTime || "As per agreed slot"}`;

  const deliveryFeeDisplay =
    deliveryFee === 0 ? "FREE (Order above ₹200)" : `₹${deliveryFee}`;

  const notesSection = specialNotes && specialNotes.trim()
    ? `\n*Cooking / Delivery Notes:* ${specialNotes.trim()}`
    : "";

  const text =
`*NEW ORDER - Aroma Kitchen by Isha*
================================
*Customer Details:*
• Name: ${customerName.trim()}
• Phone: ${customerPhone.trim()}
• Address: ${deliveryAddress.trim()}

*Delivery Timing:*
• ${timingText}

*Order Breakdown:*
--------------------------------
${itemsList}
--------------------------------
*Subtotal:* ₹${subtotal}
*Delivery Fee:* ${deliveryFeeDisplay}
*Grand Total:* ₹${grandTotal}${notesSection}

Please confirm preparation time and payment mode. Thank you!`;

  return `https://wa.me/${KITCHEN_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

/**
 * Creates the encoded WhatsApp link for party and bulk catering inquiries.
 */
export function generatePartyOrderWhatsAppUrl(details: PartyOrderDetails): string {
  const {
    name,
    phone,
    eventDate,
    eventTime,
    guestCount,
    mealType,
    dietaryPreference,
    dishRequests,
    deliveryAddress,
    specialInstructions,
  } = details;

  const notesSection = specialInstructions && specialInstructions.trim()
    ? `\n*Additional Notes:* ${specialInstructions.trim()}`
    : "";

  const text =
`*PARTY & BULK CATERING INQUIRY*
*Aroma Kitchen by Isha*
================================
*Host Details:*
• Name: ${name.trim()}
• Contact: ${phone.trim()}
• Delivery Venue / Address: ${deliveryAddress.trim()}

*Event Schedule:*
• Date: ${eventDate}
• Service Time: ${eventTime}
• Estimated Guests: ${guestCount} people

*Menu Preferences:*
• Meal Type: ${mealType}
• Dietary Preference: ${dietaryPreference}
• Requested Dishes / Items:
${dishRequests.trim()}${notesSection}

Please share a customized menu quote and confirmation details.`;

  return `https://wa.me/${KITCHEN_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

/**
 * Creates a generic WhatsApp chat link.
 */
export function generateGeneralInquiryWhatsAppUrl(message?: string): string {
  const defaultText = message || "Hi Aroma Kitchen, I would like to inquire about today's fresh menu!";
  return `https://wa.me/${KITCHEN_WHATSAPP_NUMBER}?text=${encodeURIComponent(defaultText)}`;
}