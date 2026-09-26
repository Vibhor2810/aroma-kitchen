import { BUSINESS_CONFIG } from "@/app/config/business";

export function getGeneralWhatsAppUrl(): string {
  const message =
    "Hi Aroma Kitchen, I would like to place an order. Please share the current availability and ordering details.";
  return `https://wa.me/91${BUSINESS_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function getItemOrderWhatsAppUrl(itemName: string, price: string): string {
  const message = `Hi Aroma Kitchen, I would like to order:

Item:
${itemName}

Price:
${price}

Please confirm availability and the total order amount.`;

  return `https://wa.me/91${BUSINESS_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export interface PartyEnquiryData {
  fullName: string;
  phone: string;
  eventType: string;
  eventDate: string;
  guestCount: number | string;
  foodRequirements: string;
  additionalDetails?: string;
  preferredContactTime?: string;
}

export function getPartyEnquiryWhatsAppUrl(data: PartyEnquiryData): string {
  const lines: string[] = [
    "Hi Aroma Kitchen,",
    "",
    "I'd like to enquire about a party/special occasion order.",
    "",
    "CUSTOMER DETAILS",
    `Name: ${data.fullName}`,
    `Phone: ${data.phone}`,
    "",
    "EVENT DETAILS",
    `Event Type: ${data.eventType}`,
    `Event Date: ${data.eventDate}`,
    `Number of Guests: ${data.guestCount}`,
    "",
    "FOOD / REQUIREMENTS",
    data.foodRequirements.trim() || "Options as recommended by kitchen",
  ];

  if (data.additionalDetails && data.additionalDetails.trim()) {
    lines.push("", "ADDITIONAL DETAILS", data.additionalDetails.trim());
  }

  if (data.preferredContactTime) {
    lines.push("", "PREFERRED CONTACT TIME", data.preferredContactTime);
  }

  lines.push("", "Please share the available options and pricing.");

  return `https://wa.me/91${BUSINESS_CONFIG.whatsappNumber}?text=${encodeURIComponent(lines.join("\n"))}`;
}