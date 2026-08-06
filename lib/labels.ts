/**
 * Bilingual labels. The operator reads Hindi more comfortably than English,
 * but the domain words they actually say out loud ("payment", "report") are
 * Hinglish — so the Hindi line is a *gloss*, not a literal translation.
 *
 * English stays primary (it's what's on every other app they use); Hindi is
 * rendered smaller and muted beneath it via <Bilingual />.
 */
export type Label = { en: string; hi: string };

export const L = {
  // Navigation
  dashboard: { en: "Dashboard", hi: "मुख्य पेज" },
  work: { en: "Work", hi: "काम" },
  payments: { en: "Payments", hi: "पैसा" },
  reports: { en: "Reports", hi: "रिपोर्ट" },
  backupReport: { en: "Backup Report", hi: "बैकअप रिपोर्ट" },
  customers: { en: "Customers", hi: "ग्राहक" },
  services: { en: "Services", hi: "सेवाएँ" },

  // Money / totals
  pending: { en: "Pending", hi: "बाकी" },
  received: { en: "Received", hi: "मिल गया" },
  collected: { en: "Collected", hi: "वसूली" },
  totalWork: { en: "Total Work", hi: "कुल काम" },
  totalPaid: { en: "Total Paid", hi: "कुल भुगतान" },
  todayWork: { en: "Today's Work", hi: "आज का काम" },
  todayCollection: { en: "Today's Collection", hi: "आज की वसूली" },
  totalCustomers: { en: "Total Customers", hi: "कुल ग्राहक" },
  amount: { en: "Amount", hi: "रकम" },
  rate: { en: "Rate", hi: "रेट" },
  total: { en: "Total", hi: "कुल" },
  balance: { en: "Balance", hi: "बकाया" },

  // Entities & fields
  customer: { en: "Customer", hi: "ग्राहक" },
  service: { en: "Service", hi: "सेवा" },
  date: { en: "Date", hi: "तारीख" },
  quantity: { en: "Quantity", hi: "मात्रा" },
  note: { en: "Note", hi: "टिप्पणी" },
  name: { en: "Name", hi: "नाम" },
  address: { en: "Address", hi: "पता" },
  phone: { en: "Phone", hi: "मोबाइल" },
  password: { en: "Password", hi: "पासवर्ड" },
  hours: { en: "Hours", hi: "घंटे" },
  minutes: { en: "Minutes", hi: "मिनट" },
  katha: { en: "Katha", hi: "कट्ठा" },

  // Actions
  add: { en: "Add", hi: "जोड़ें" },
  addCustomer: { en: "Add Customer", hi: "ग्राहक जोड़ें" },
  addWork: { en: "Add Work", hi: "काम जोड़ें" },
  addPayment: { en: "Add Payment", hi: "पैसा जोड़ें" },
  selectCustomer: { en: "Select Customer", hi: "ग्राहक चुनें" },
  save: { en: "Save", hi: "सेव करें" },
  cancel: { en: "Cancel", hi: "रद्द करें" },
  deleteAction: { en: "Delete", hi: "हटाएँ" },
  edit: { en: "Edit", hi: "बदलें" },
  search: { en: "Search", hi: "खोजें" },
  generate: { en: "Generate Report", hi: "रिपोर्ट बनाएँ" },
  exportPdf: { en: "Export PDF", hi: "PDF डाउनलोड" },
  print: { en: "Print", hi: "प्रिंट" },
  signIn: { en: "Sign In", hi: "लॉगिन करें" },
  signOut: { en: "Sign out", hi: "लॉगआउट" },
  updateRate: { en: "Update Rate", hi: "रेट बदलें" },

  // Sections
  recentWork: { en: "Recent Work", hi: "हाल का काम" },
  recentPayments: { en: "Recent Payments", hi: "हाल के भुगतान" },
  workHistory: { en: "Work History", hi: "काम का हिसाब" },
  paymentHistory: { en: "Payment History", hi: "भुगतान का हिसाब" },
} as const satisfies Record<string, Label>;

export type LabelKey = keyof typeof L;
