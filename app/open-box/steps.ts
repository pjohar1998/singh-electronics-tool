import type { StepsMap } from "../returns/interface";

export const OB_STEPS: StepsMap = {

  // ══════════════════════════════════════════
  // OPEN BOX ROOT
  // ══════════════════════════════════════════
  ob_start: {
    id: "ob_start",
    type: "question",
    section: "Open Box — Start",
    question: "What is the platform for this request?",
    helpText: "",
    choices: [
      { label: "Best Buy / Walmart", short: "Best Buy / Walmart", next: "ob_bb_type" },
      { label: "Website", short: "Website", next: "ob_web_type" },
      { label: "Amazon", short: "Amazon", next: "ob_amz_type" }
    ]
  },

  // ══════════════════════════════════════════
  // BEST BUY / WALMART
  // ══════════════════════════════════════════
  ob_bb_type: {
    id: "ob_bb_type",
    type: "question",
    section: "Best Buy / Walmart",
    question: "Is a return request or warranty claim being requested?",
    helpText: "",
    choices: [
      { label: "Return Request — A return is when a customer wishes to send back an open box item for a refund or exchange because they no longer need it or are not satisfied with it.", short: "Return Request", next: "ob_bb_return_30" },
      { label: "Warranty Claim — A \"warranty claim\" is when a product has been used/installed and the customer is experiencing an issue or the product is malfunctioning.", short: "Warranty Claim", next: "ob_bb_warranty_note" }
    ]
  },

  // ── BB RETURN ────────────────────────────
  ob_bb_return_30: {
    id: "ob_bb_return_30",
    type: "question",
    section: "Best Buy / Walmart — Return",
    question: "Is the return request being made within 30 days from the day of delivery or pickup?",
    helpText: "Purchases made between Nov. 1 and Dec. 31 are eligible for extended returns until Jan. 31 of the following year provided it is noted as a gift at the time of purchase.",
    choices: [
      { label: "Yes — Within 30 Days", short: "Within 30 days", next: "ob_bb_return_condition" },
      { label: "No — Over 30 Days", short: "Over 30 days", next: "ob_bb_return_over30_terminal" }
    ]
  },

  ob_bb_return_over30_terminal: {
    id: "ob_bb_return_over30_terminal",
    type: "terminal",
    section: "Best Buy / Walmart — Return Over 30 Days",
    terminalType: "decline",
    title: "Return Request Declined — Over 30 Days",
    body: "For Best Buy / Walmart open box return requests, returns cannot be accepted after 30 days from the date of delivery. The item must be unused, uninstalled, and the return request must be made within the eligible 30-day return period.\n\nIf the item is defective or malfunctioning after use/installation, it should not be treated as a return request and should instead be reviewed as a warranty claim, if applicable.",
    emailTemplate: "Hello,\n\nThank you for reaching out to us. We're sorry to hear the item didn't work out for you.\n\nUnfortunately, as the return request is outside our 30-day return period, the item is no longer eligible for return. Returns are only accepted for unused and uninstalled items when the return request is made within 30 days of delivery.\n\nWe apologize for any inconvenience this may cause. Please let us know if you have any further questions."
  },

  ob_bb_return_condition: {
    id: "ob_bb_return_condition",
    type: "question",
    section: "Best Buy / Walmart — Return Within 30 Days",
    question: "Has the item been used, and does the customer have all original packaging and accessories to send it back?",
    helpText: "Open box items must be returned with all original packaging, accessories, manuals, inserts, remotes, wires, mounting parts, and any other included components. If packaging or accessories are missing, the return may be refused or subject to a restocking fee.",
    choices: [
      { label: "Not used or used, and customer has all original packaging and accessories to send back", short: "Has all packaging/accessories", next: "ob_bb_return_approve_terminal" },
      { label: "Not used or used, but customer does NOT have all original packaging and accessories", short: "Missing packaging/accessories", next: "ob_bb_return_missing_terminal" }
    ]
  },

  ob_bb_return_approve_terminal: {
    id: "ob_bb_return_approve_terminal",
    type: "terminal",
    section: "Best Buy / Walmart — Return Approved",
    terminalType: "approve",
    title: "Return Approved — Send Return Instructions",
    body: "Return is approved. Ensure the order number is updated to the correct one and the return date is clearly stated in the email template before sending.",
    emailTemplate: "Hello,\n\nYour return request has been approved, and RA #265642467-A has been issued. You have up to May 21st to ensure the product is delivered to the designated return address. Please ship the item to the address below:\n\nSingh Electronics – ATTN: Returns RA #265642467-A\n7003 Steeles Ave West, Unit 15–16\n\nToronto, ON M9W 0A2\n\nKindly ensure the item is returned in the same condition as received, including original manufacturer packaging and all accessories. Do not place labels directly on the manufacturer's box, as the barcodes are required for processing. Instead, please pack the manufacturer's box inside another shipping box and use protective material to prevent damage in transit.\n\nPlease note: if the item is found to be used, damaged, or missing packaging/accessories, a restocking fee may apply or the return may be refused. Serial numbers are verified on all returns.\n\nOnce shipped, please provide the tracking number so we can process your return promptly.\n\nBest Regards,"
  },

  ob_bb_return_missing_terminal: {
    id: "ob_bb_return_missing_terminal",
    type: "terminal",
    section: "Best Buy / Walmart — Missing Packaging",
    terminalType: "escalate",
    title: "Missing Packaging or Accessories — Check with Management",
    body: "Once photos are received from the customer, check with management to see if the return should be approved with a restocking fee.",
    emailTemplate: "Hello,\n\nThank you for confirming.\n\nWe can still review the return request; however, please note that the item must be returned with all original packaging and accessories whenever possible. Missing packaging, missing accessories, signs of use, installation marks, or damage may affect the return eligibility and may result in the return being refused or a restocking fee being applied after inspection.\n\nPlease send us clear photos of the item, all included accessories, and the packaging currently available so we can review the request further.\n\nBest Regards,"
  },

  // ── BB WARRANTY ──────────────────────────
  ob_bb_warranty_note: {
    id: "ob_bb_warranty_note",
    type: "info",
    section: "Best Buy / Walmart — Warranty",
    infoType: "warn",
    title: "Verify Item Condition Before Proceeding",
    body: "Open box products sold on Best Buy or Walmart include a 1-year warranty.\nHowever, if the item was listed as Refurbished, it only includes a 30-day warranty.\n\nPlease verify the item's listed condition before proceeding with the warranty claim.",
    next: "ob_bb_warranty_30"
  },

  ob_bb_warranty_30: {
    id: "ob_bb_warranty_30",
    type: "question",
    section: "Best Buy / Walmart — Warranty",
    question: "Is the warranty claim being made within 30 days from the day of purchase?",
    helpText: "",
    choices: [
      { label: "Yes — Within 30 days", short: "Within 30 days", next: "ob_bb_warranty_category" },
      { label: "No — Over 30 days but within a year", short: "Over 30 days, within 1 year", next: "ob_bb_warranty_over30_category" }
    ]
  },

  ob_bb_warranty_category: {
    id: "ob_bb_warranty_category",
    type: "question",
    section: "Best Buy / Walmart — Warranty Within 30 Days",
    question: "Is the warranty claim for an open box TV or an open box multimedia product?",
    helpText: "",
    choices: [
      { label: "Open Box TV", short: "Open Box TV", next: "ob_bb_warranty_tv_damage" },
      { label: "Open Box Multimedia Product (Erikson)", short: "Multimedia Product", next: "ob_bb_warranty_mm_terminal" }
    ]
  },

  ob_bb_warranty_mm_terminal: {
    id: "ob_bb_warranty_mm_terminal",
    type: "terminal",
    section: "Best Buy / Walmart — Multimedia Warranty Within 30 Days",
    terminalType: "approve",
    title: "Approve Return — Multimedia Product Within 30 Days",
    body: "First try to assist the customer with basic troubleshooting. Search the product model online and provide troubleshooting steps (factory reset, power reset, connection reset, firmware update, pairing reset, wiring check, setup verification).\n\nIf troubleshooting does not resolve the issue and the item is within 30 days, approve the warranty request and provide a prepaid return label right away.\n\n⚠️ The returned item must still be inspected and tested after receipt. If the item is physically damaged, misused, missing parts, or has a different serial number than sold, escalate before final resolution.",
    emailTemplate: "Hello,\n\nYour return request has been approved, and RA #261738358-A has been issued.\n\nKindly ensure the item is returned in the same condition as received, including the original manufacturer packaging and all accessories.\n\nPlease do not place labels directly on the manufacturer's box, as the barcodes are required for processing. Instead, please pack the manufacturer's box inside another shipping box and use protective material to prevent damage in transit.\n\nImportant:\n\nIf the item is found to be missing packaging or accessories, a restocking fee may apply or the return may be refused. Additionally, the unit will be tested in-store. If we are unable to replicate the issue, the return shipping costs will be deducted from the final refund.\n\nAll serial numbers are verified on returns.\n\nAttached, you'll find the return shipping label for your convenience. You can either contact the carrier to schedule a pickup or drop it off at your nearest courier location at your earliest convenience.\n\nBest regards,"
  },

  ob_bb_warranty_tv_damage: {
    id: "ob_bb_warranty_tv_damage",
    type: "question",
    section: "Best Buy / Walmart — TV Warranty Within 30 Days",
    question: "Is the warranty request for a damaged TV or a non-functioning TV?",
    helpText: "",
    choices: [
      { label: "Damaged TV", short: "Damaged TV", next: "ob_bb_warranty_tv_damage_condition" },
      { label: "Non-functioning TV", short: "Non-functioning TV", next: "ob_bb_warranty_tv_nonfunc_terminal" }
    ]
  },

  ob_bb_warranty_tv_damage_condition: {
    id: "ob_bb_warranty_tv_damage_condition",
    type: "question",
    section: "Best Buy / Walmart — Damaged TV",
    question: "What is the damage condition?",
    helpText: "Review photos/videos provided by the customer and determine whether the damage is minor/cosmetic or whether it affects the TV's ability to function.",
    emailTemplate: "Hello,\n\nWe're sorry to hear that your TV arrived damaged.\n\nTo help us review the issue and proceed with the next steps, could you please provide the following photos:\n\n• A minimum of 2–3 clear photos of the damage to the TV, taken from multiple angles.\n• Clear photos of the exterior shipping box, including the front, back, both sides, and any visible damage to the packaging.\n• Photos showing the internal packaging and how the TV was packaged when it arrived.\n• A clear photo of the serial number label on the TV.\n• A clear photo of the serial number label on the shipping box.\n\nPlease ensure the photos are clear and show the full extent of the damage. Once we receive them, we will review the information and assist you with the next steps as quickly as possible.\n\nBest Regards,\n\nSingh Electronics",
    choices: [
      { label: "Minor damage only — TV is still functioning", short: "Minor damage, still working", next: "ob_bb_warranty_tv_discount_terminal" },
      { label: "Damaged and non-functioning", short: "Damaged and non-functioning", next: "ob_bb_warranty_tv_carrier_terminal" }
    ]
  },

  ob_bb_warranty_tv_discount_terminal: {
    id: "ob_bb_warranty_tv_discount_terminal",
    type: "terminal",
    section: "Best Buy / Walmart — Minor TV Damage",
    terminalType: "info-end",
    title: "Offer Discount to Keep Unit",
    body: "If the damage is minimal and the TV is still working, offer the customer a reasonable discount/partial refund to keep the unit.\n\n⚠️ Confirm the discount amount with a manager before making the offer if required.\n\nMake sure the customer understands that accepting the discount means they agree to keep the TV in its current condition and the return request for the reported damage will be considered resolved.",
    emailTemplate: "Hello,\n\nThank you for sharing the photos and details with us.\n\nBased on the information provided, it appears the damage is minor and the TV is still functioning. To avoid the inconvenience of returning the TV, we can offer a partial refund/discount if you are willing to keep the unit in its current condition.\n\nPlease let us know if you would like to accept this option, and we can review the discount amount for you.\n\nBest Regards,"
  },

  ob_bb_warranty_tv_carrier_terminal: {
    id: "ob_bb_warranty_tv_carrier_terminal",
    type: "terminal",
    section: "Best Buy / Walmart — Damaged & Non-Functioning TV",
    terminalType: "approve",
    title: "Approve Return + Carrier Claim",
    body: "Approve the return and provide a prepaid return label via CANPAR. Once the TV is received back, inspect the unit and packaging carefully.\n\nPhotos required:\n• TV front screen\n• Damaged area\n• Serial number label\n• Outer box\n• Inner packaging/foam\n• Any visible impact marks\n• Shipping label\n• All accessories received back\n\nAfter inspection, open a carrier claim using the shipment details and photos.",
    emailTemplate: "Hello,\n\nYour return request has been approved, and RA #265528813-A has been issued.\n\nPlease ensure the TV is returned in the same condition as received, including the original manufacturer packaging and all accessories.\n\nImportant:\n\nIf the item is returned without original packaging or accessories, a restocking fee may apply or the return may be refused.\n\nThe unit will be inspected in-store upon arrival. If physical damage is found without corresponding damage to the shipping box, it may be considered customer-caused.\n\nAll serial numbers are verified upon return.\n\nA Canpar return shipping label has been attached for your convenience. Please print the label and securely attach it to the TV box.\n\nA pickup has been scheduled for Monday between 10:00 AM and 5:00 PM.\n\nIf you have any questions or need assistance, please feel free to reach out.\n\nBest Regards,"
  },

  ob_bb_warranty_tv_nonfunc_terminal: {
    id: "ob_bb_warranty_tv_nonfunc_terminal",
    type: "terminal",
    section: "Best Buy / Walmart — Non-Functioning TV",
    terminalType: "approve",
    title: "Troubleshoot Then Approve Return — Non-Functioning TV",
    body: "First help the customer with troubleshooting: power reset, checking the power outlet, remote/battery check, input/source check, HDMI/cable check, factory reset, or model-specific troubleshooting.\n\nIf troubleshooting does not resolve the issue and the item is within the eligible warranty period, approve the warranty request and provide a prepaid return label via CANPAR.\n\nAfter inspection, if the defect is confirmed the unit will need to be RMAed with the appropriate vendor.",
    emailTemplate: "Hello,\n\nYour return request has been approved, and RA #265528813-A has been issued.\n\nPlease ensure the TV is returned in the same condition as received, including the original manufacturer packaging and all accessories.\n\nImportant:\n\nIf the item is returned without original packaging or accessories, a restocking fee may apply or the return may be refused.\n\nThe unit will be inspected in-store upon arrival. If we are able to replicate the issue you mentioned, a full refund will then be issued.\n\nPlease note: all serial numbers are verified upon return.\n\nA Canpar return shipping label has been attached for your convenience. Please print the label and securely attach it to the TV box.\n\nA pickup has been scheduled for Monday between 10:00 AM and 5:00 PM.\n\nIf you have any questions or need assistance, please feel free to reach out.\n\nBest Regards,"
  },

  // ── BB WARRANTY OVER 30 DAYS ─────────────
  ob_bb_warranty_over30_category: {
    id: "ob_bb_warranty_over30_category",
    type: "question",
    section: "Best Buy / Walmart — Warranty Over 30 Days",
    question: "What type of open box product is this warranty claim for?",
    helpText: "Confirm the item's original listed condition. If listed as Refurbished, it only carries a 30-day warranty and the claim should be declined.",
    choices: [
      { label: "Open Box TV", short: "Open Box TV", next: "ob_bb_warranty_tv_over30_terminal" },
      { label: "Open Box Multimedia Product (Erikson)", short: "Multimedia Product", next: "ob_bb_warranty_mm_over30_terminal" }
    ]
  },

  ob_bb_warranty_tv_over30_terminal: {
    id: "ob_bb_warranty_tv_over30_terminal",
    type: "terminal",
    section: "Best Buy / Walmart — TV Warranty Over 30 Days",
    terminalType: "info-end",
    title: "Troubleshoot First — TV Warranty Over 30 Days",
    body: "Search the TV model online and provide model-specific troubleshooting steps. Common steps: power reset, factory reset, software update, input/source check, remote/battery check, HDMI/cable check, outlet/power bar check, or display/panel test.\n\nIf the issue is resolved by troubleshooting → close the warranty request.\n\nIf the issue cannot be resolved → approve the warranty request and provide a prepaid return label for inspection and further resolution.",
    emailTemplate: "Hello,\n\nThank you for reaching out to us.\n\nWe're sorry to hear you are experiencing an issue with the TV. Before proceeding further, please try the troubleshooting steps below:\n**[INSERT MODEL-SPECIFIC TROUBLESHOOTING STEPS]**\n\nIf the issue still remains after completing these steps, please let us know and we will proceed with the next step under the warranty process.\n\nBest Regards,"
  },

  ob_bb_warranty_mm_over30_terminal: {
    id: "ob_bb_warranty_mm_over30_terminal",
    type: "terminal",
    section: "Best Buy / Walmart — Multimedia Warranty Over 30 Days",
    terminalType: "direct",
    title: "Redirect to Erikson RMA — Multimedia Over 30 Days",
    body: "Search the product model online and provide model-specific troubleshooting steps. Common steps: factory reset, power reset, Bluetooth reset, pairing reset, firmware update, wiring check, cable check, app reset, or connection setup verification.\n\nIf the issue is resolved by troubleshooting → close the warranty request.\n\nIf troubleshooting does not resolve the issue → forward the customer to the Erikson RMA center.\n\n⚠️ Important: If Erikson rejects the warranty claim or is unable to assist, get the unit back and help them with the next resolution.",
    emailTemplate: "Hello,\n\nThank you for confirming.\n\nSince the issue remains after troubleshooting, the next step is to proceed through the Erikson RMA center for warranty assistance or repair support.\n\nPlease submit the warranty request through Erikson and follow their instructions for service.\nhttps://jamindustries.com/rma-request-forms/\n\nBest regards,"
  },

  // ══════════════════════════════════════════
  // WEBSITE
  // ══════════════════════════════════════════
  ob_web_type: {
    id: "ob_web_type",
    type: "question",
    section: "Website",
    question: "Is a return request or warranty claim being requested?",
    helpText: "",
    choices: [
      { label: "Return Request — A return is when a customer wishes to send back an open box item for a refund or exchange because they no longer need it or are not satisfied with it.", short: "Return Request", next: "ob_web_return_terminal" },
      { label: "Warranty Claim — A \"warranty claim\" is when a product has been used/installed and the customer is experiencing an issue or the product is malfunctioning.", short: "Warranty Claim", next: "ob_web_warranty_30" }
    ]
  },

  ob_web_return_terminal: {
    id: "ob_web_return_terminal",
    type: "terminal",
    section: "Website — Return Request",
    terminalType: "decline",
    title: "Return Declined — Website Open Box Items Are Final Sale",
    body: "For website orders, all open box items are final sale and are not eligible for return or exchange of any sort.\n\nThis applies to return requests based on customer preference, dissatisfaction, change of mind, compatibility issues, or no longer needing the item.\n\nIf the customer is reporting that the item is malfunctioning after use or installation, it should be reviewed separately as a warranty claim, if applicable.",
    emailTemplate: "Hello,\n\nThank you for reaching out to us.\n\nPlease note that open box items purchased from our website are final sale and are not eligible for return or exchange of any sort. These items are sold at a discounted price based on their open box condition.\n\nFor this reason, we are unable to accept this item back for return or exchange.\n\nBest Regards,"
  },

  // ── WEBSITE WARRANTY ─────────────────────
  ob_web_warranty_30: {
    id: "ob_web_warranty_30",
    type: "question",
    section: "Website — Warranty",
    question: "Is the website warranty request being made within 30 days from the date of purchase?",
    helpText: "",
    choices: [
      { label: "Yes — Within 30 days", short: "Within 30 days", next: "ob_web_warranty_category" },
      { label: "No — Over 30 days", short: "Over 30 days", next: "ob_web_warranty_over30_category" }
    ]
  },

  ob_web_warranty_category: {
    id: "ob_web_warranty_category",
    type: "question",
    section: "Website — Warranty Within 30 Days",
    question: "What type of open box product is this warranty request for?",
    helpText: "",
    choices: [
      { label: "Open Box Multimedia Product", short: "Multimedia Product", next: "ob_web_warranty_mm_within30_terminal" },
      { label: "Open Box TV", short: "Open Box TV", next: "ob_web_warranty_tv_damage" }
    ]
  },

  ob_web_warranty_mm_within30_terminal: {
    id: "ob_web_warranty_mm_within30_terminal",
    type: "info",
    section: "Website — Multimedia Warranty Within 30 Days",
    infoType: "info",
    title: "Troubleshoot First — Website Multimedia Within 30 Days",
    body: "Search the product model and provide suitable troubleshooting steps: factory reset, power reset, Bluetooth reset, pairing reset, firmware update, wiring check, connection check, app reset, or setup verification.\n\nIf troubleshooting resolves the issue → close the request.\n\nIf the issue is not resolved → redirect customer to the Erikson RMA center for warranty assistance or repair support.",
    emailTemplate: "Hello,\n\nThank you for reaching out to us.\n\nWe're sorry to hear you are experiencing an issue with the item. Before proceeding further, please try the troubleshooting steps below:\n**[INSERT PRODUCT/MODEL-SPECIFIC TROUBLESHOOTING STEPS]**\n\nIf the issue still remains after completing these steps, please let us know and we will assist you further.\n\nBest Regards,",
    next: "ob_web_warranty_mm_erikson_question"
  },

  ob_web_warranty_mm_erikson_question: {
    id: "ob_web_warranty_mm_erikson_question",
    type: "question",
    section: "Website — Multimedia Warranty Within 30 Days",
    question: "What was the outcome after the customer contacted Erikson?",
    helpText: "Direct the customer to submit their warranty request through the Erikson RMA center and follow their instructions: https://jamindustries.com/rma-request-forms/",
    emailTemplate: "Hello,\n\nThank you for confirming.\n\nSince the issue remains after troubleshooting, the next step is to proceed through the Erikson RMA center for warranty assistance or repair support.\n\nPlease submit the warranty request through Erikson and follow their instructions for service.\nhttps://jamindustries.com/rma-request-forms/\n\nBest regards,",
    choices: [
      { label: "Erikson resolved the issue — no further action needed", short: "Erikson resolved it", next: "ob_web_warranty_mm_erikson_resolved_terminal" },
      { label: "Erikson directed the customer back to us for further assistance", short: "Erikson sent back to us", next: "ob_web_warranty_mm_shipback_terminal" }
    ]
  },

  ob_web_warranty_mm_erikson_resolved_terminal: {
    id: "ob_web_warranty_mm_erikson_resolved_terminal",
    type: "terminal",
    section: "Website — Multimedia Warranty Within 30 Days",
    terminalType: "info-end",
    title: "Issue Resolved via Erikson — Close Request",
    body: "Erikson Consumer has resolved the issue directly with the customer. No further action is required on our end.\n\nClose the warranty request."
  },

  ob_web_warranty_mm_shipback_terminal: {
    id: "ob_web_warranty_mm_shipback_terminal",
    type: "terminal",
    section: "Website — Multimedia Warranty Within 30 Days",
    terminalType: "approve",
    title: "Ship Back to Store — Standard Warranty Process",
    body: "Erikson has directed the customer back to us. Standard warranty procedures apply.\n\nCustomer ships unit back with all original accessories. Customer responsible for return shipping.\n\nIf confirmed defective:\n• Replacement issued if in stock\n• Replacement issued only ONCE\n• If replacement also defective → contact manufacturer\n\nIf sold out / discontinued → exchange or store credit (no refunds)\n\n⚠️ If no defect found → claim denied. Customer responsible for return shipping.",
    emailTemplate: "Hello,\n\nThank you for following up with us. Since Erikson Consumer has directed you back to our store for further assistance, we will be happy to proceed with the next steps under our standard warranty process.\n\nTo proceed, please ship the unit back to us or drop it off at our store location for evaluation. Once received, our team will thoroughly inspect the unit. If we are able to replicate the issue and confirm the defect, we will be happy to provide a replacement.\n\nKindly ensure the item is returned in the same condition as received, including the original manufacturer packaging and all accessories. Please do not place labels directly on the manufacturer's box, as the barcodes are required for processing. Instead, place the manufacturer's box inside a separate shipping box and use protective material to prevent any damage in transit.\n\nWhen returning the item, we recommend using a trackable carrier such as Purolator or UPS. Once shipped, please provide the tracking number so our team can process the return upon receipt.\n\nPlease note that if no fault is found, return shipping costs will not be covered. All serial numbers are verified on returns, and if an item is found to be tampered with or does not match our records, the claim may be refused.\n\nThe warranty evaluation process may take up to seven business days from the date of arrival.\n\n**Ship to Address:**\nATTN: Singh Electronics Warranty **RMA # (INSERT ORDER NUMBER)**\n7003 Steeles Avenue West, Unit #15\nToronto, Ontario M9W 0A2\n\nThank you,"
  },

  ob_web_warranty_tv_damage: {
    id: "ob_web_warranty_tv_damage",
    type: "question",
    section: "Website — TV Warranty Within 30 Days",
    question: "Is the warranty request for a damaged TV or a non-functioning TV?",
    helpText: "",
    choices: [
      { label: "Damaged TV", short: "Damaged TV", next: "ob_web_warranty_tv_condition" },
      { label: "Non-functioning TV", short: "Non-functioning TV", next: "ob_web_warranty_tv_nonfunc_terminal" }
    ]
  },

  ob_web_warranty_tv_condition: {
    id: "ob_web_warranty_tv_condition",
    type: "question",
    section: "Website — Damaged TV",
    question: "What is the TV damage condition?",
    helpText: "Review photos/videos provided and determine whether the damage is minimal or heavy.",
    emailTemplate: "Hello,\n\nWe're sorry to hear that your TV arrived damaged.\n\nTo help us review the issue and proceed with the next steps, could you please provide the following photos:\n\n• A minimum of 2–3 clear photos of the damage to the TV, taken from multiple angles.\n• Clear photos of the exterior shipping box, including the front, back, both sides, and any visible damage to the packaging.\n• Photos showing the internal packaging and how the TV was packaged when it arrived.\n• A clear photo of the serial number label on the TV.\n• A clear photo of the serial number label on the shipping box.\n\nPlease ensure the photos are clear and show the full extent of the damage. Once we receive them, we will review the information and assist you with the next steps as quickly as possible.\n\nBest Regards,\n\nSingh Electronics",
    choices: [
      { label: "Minor damage only — TV is still functioning", short: "Minor damage, still working", next: "ob_web_warranty_tv_discount_terminal" },
      { label: "Heavy damage and non-functioning", short: "Heavy damage, non-functioning", next: "ob_web_warranty_tv_carrier_terminal" }
    ]
  },

  ob_web_warranty_tv_discount_terminal: {
    id: "ob_web_warranty_tv_discount_terminal",
    type: "terminal",
    section: "Website — Minor TV Damage",
    terminalType: "info-end",
    title: "Offer Discount to Keep Unit",
    body: "If the damage is minimal and the TV is still working, offer the customer a reasonable discount/partial refund to keep the unit.\n\n⚠️ Confirm the discount amount with a manager before making the offer.\n\nMake sure the customer understands that accepting the discount means they agree to keep the TV in its current condition.",
    emailTemplate: "Hello,\n\nThank you for sharing the photos and details with us.\n\nBased on the information provided, it appears the damage is minor and the TV is still functioning. To avoid the inconvenience of returning the TV, we can offer a partial refund/discount if you are willing to keep the unit in its current condition.\n\nPlease let us know if you would like to accept this option, and we can review the discount amount for you.\n\nBest Regards,"
  },

  ob_web_warranty_tv_carrier_terminal: {
    id: "ob_web_warranty_tv_carrier_terminal",
    type: "terminal",
    section: "Website — Heavy TV Damage",
    terminalType: "approve",
    title: "Approve Return + Carrier Claim — Heavy TV Damage",
    body: "Approve the return and provide a prepaid return label via CANPAR. Once the TV is received back, inspect the unit and packaging carefully.\n\nPhotos required:\n• TV front screen\n• Damaged area\n• Serial number label\n• Outer box / inner packaging/foam\n• Any visible impact marks\n• Shipping label\n• All accessories received back\n\nAfter inspection, open a carrier claim using the shipment details and photos.",
    emailTemplate: "Hello,\n\nYour return request has been approved, and RA #265528813-A has been issued.\n\nPlease ensure the TV is returned in the same condition as received, including the original manufacturer packaging and all accessories.\n\nImportant:\n\nIf the item is returned without original packaging or accessories, a restocking fee may apply or the return may be refused.\n\nThe unit will be inspected in-store upon arrival. If physical damage is found without corresponding damage to the shipping box, it may be considered customer-caused.\n\nAll serial numbers are verified upon return.\n\nA Canpar return shipping label has been attached for your convenience. Please print the label and securely attach it to the TV box.\n\nA pickup has been scheduled for Monday between 10:00 AM and 5:00 PM.\n\nIf you have any questions or need assistance, please feel free to reach out.\n\nBest Regards,"
  },

  ob_web_warranty_tv_nonfunc_terminal: {
    id: "ob_web_warranty_tv_nonfunc_terminal",
    type: "terminal",
    section: "Website — Non-Functioning TV Within 30 Days",
    terminalType: "approve",
    title: "Troubleshoot Then Approve Return — Non-Functioning TV",
    body: "First help the customer with troubleshooting: power reset, checking the power outlet, remote/battery check, input/source check, HDMI/cable check, factory reset, or model-specific troubleshooting.\n\nIf troubleshooting does not resolve the issue, approve the warranty request and provide a prepaid return label via CANPAR.\n\nAfter inspection, if the defect is confirmed the unit will need to be RMAed with the appropriate vendor.",
    emailTemplate: "Hello,\n\nYour return request has been approved, and RA #265528813-A has been issued.\n\nPlease ensure the TV is returned in the same condition as received, including the original manufacturer packaging and all accessories.\n\nImportant:\n\nIf the item is returned without original packaging or accessories, a restocking fee may apply or the return may be refused.\n\nThe unit will be inspected in-store upon arrival. If we are able to replicate the issue you mentioned, a full refund will then be issued.\n\nPlease note: all serial numbers are verified upon return.\n\nA Canpar return shipping label has been attached for your convenience. Please print the label and securely attach it to the TV box.\n\nA pickup has been scheduled for Monday between 10:00 AM and 5:00 PM.\n\nIf you have any questions or need assistance, please feel free to reach out.\n\nBest Regards,"
  },

  ob_web_warranty_over30_category: {
    id: "ob_web_warranty_over30_category",
    type: "question",
    section: "Website — Warranty Over 30 Days",
    question: "What type of open box product is this warranty request for?",
    helpText: "",
    choices: [
      { label: "Open Box Multimedia Product", short: "Multimedia Product", next: "ob_web_warranty_mm_over30_terminal" },
      { label: "Open Box TV", short: "Open Box TV", next: "ob_web_warranty_tv_over30_terminal" }
    ]
  },

  ob_web_warranty_mm_over30_terminal: {
    id: "ob_web_warranty_mm_over30_terminal",
    type: "terminal",
    section: "Website — Multimedia Warranty Over 30 Days",
    terminalType: "direct",
    title: "Redirect to Erikson RMA — Multimedia Over 30 Days",
    body: "Since the item is an open box final sale product, it does not come with a standard warranty from us. Redirect the customer to the Erikson RMA center for warranty assistance or repair support.",
    emailTemplate: "Hello,\n\nSince the item is an open-box and marked as final sale, please note that it does not come with a warranty. The next step is to go through the Erikson RMA center for any warranty assistance or repair support.\n\nPlease submit the warranty request through Erikson and follow their instructions for service.\nhttps://jamindustries.com/rma-request-forms/\n\nBest regards,"
  },

  ob_web_warranty_tv_over30_terminal: {
    id: "ob_web_warranty_tv_over30_terminal",
    type: "terminal",
    section: "Website — TV Warranty Over 30 Days",
    terminalType: "decline",
    title: "Cannot Assist — Website Open Box TV Over 30 Days",
    body: "For website open box TVs over 30 days from purchase, the item is considered final sale. We cannot approve a return, exchange, prepaid label, refund, or warranty resolution without management approval.\n\n⚠️ Do not proceed without escalating to management first.",
    emailTemplate: "Hello,\n\nThank you for reaching out to us.\n\nPlease note that open box TVs purchased from our website are final sale, and as this request is over 30 days from the purchase date, we are unable to assist further with a return, exchange, or warranty resolution.\n\nWe apologize for any inconvenience this may cause. Please let us know if you have any further questions.\n\nBest Regards,"
  },

  // ══════════════════════════════════════════
  // AMAZON
  // ══════════════════════════════════════════
  ob_amz_type: {
    id: "ob_amz_type",
    type: "question",
    section: "Amazon",
    question: "Is a return request or warranty claim being requested?",
    helpText: "",
    choices: [
      { label: "Return Request — A return is when a customer wishes to send back an open box item for a refund or exchange because they no longer need it or are not satisfied with it.", short: "Return Request", next: "ob_amz_return_90" },
      { label: "Warranty Claim — A \"warranty claim\" is when a product has been used/installed and the customer is experiencing an issue or the product is malfunctioning.", short: "Warranty Claim", next: "ob_amz_warranty_90" }
    ]
  },

  // ── AMAZON RETURN ────────────────────────
  ob_amz_return_90: {
    id: "ob_amz_return_90",
    type: "question",
    section: "Amazon — Return Request",
    question: "Is the return request within 90 days of the purchase date?",
    helpText: "",
    choices: [
      { label: "Yes — Within 90 Days", short: "Within 90 days", next: "ob_amz_return_within90_terminal" },
      { label: "No — Over 90 Days", short: "Over 90 days", next: "ob_amz_return_over90_terminal" }
    ]
  },

  ob_amz_return_within90_terminal: {
    id: "ob_amz_return_within90_terminal",
    type: "terminal",
    section: "Amazon — Return Within 90 Days",
    terminalType: "approve",
    title: "Return Approved — Amazon Within 90 Days",
    body: "Approve the return request. Customers may still be able to open an A-to-z Guarantee claim for orders within this period so it is important to avoid escalation.\n\nClearly inform the customer that the item must be returned in proper condition. If the item is received opened, used, installed, damaged, missing accessories, missing packaging, or in a different condition than expected:\n• A restocking fee may be applied, or\n• The return may be refused depending on final inspection\n\nThe returned item should be inspected and tested before any final refund is issued.\n\n⚠️ Ensure the order number is updated to the correct one in the email template before sending.",
    emailTemplate: "Hello,\n\nYour return request has been approved, and RA #AMZ1287432 has been issued. Please ship the item to the address below:\n\nGTA ELECTRONICS – ATTN: Returns RA #AMZ1287432\n7003 Steeles Ave West, Unit 15–16\n\nToronto, ON M9W 0A2\n\nKindly ensure the item is returned in the same condition as received, including original manufacturer packaging and all accessories. Do not place labels directly on the manufacturer's box, as the barcodes are required for processing. Instead, please pack the manufacturer's box inside another shipping box and use protective material to prevent damage in transit.\n\nPlease note: If the item is found to be missing packaging or accessories, a restocking fee may apply or the return may be refused.\n\nOnce shipped, please provide the tracking number so we can process your return promptly.\n\nRegards,"
  },

  ob_amz_return_over90_terminal: {
    id: "ob_amz_return_over90_terminal",
    type: "terminal",
    section: "Amazon — Return Over 90 Days",
    terminalType: "decline",
    title: "Return Declined — Amazon Over 90 Days",
    body: "For Amazon return requests over 90 days from the purchase date, the return should be declined. Customers generally have up to 90 days from the purchase date to open an A-to-z Guarantee claim.\n\nDo not approve unless management has made a special exception.\n\nIf the customer is reporting a product malfunction, the case may be reviewed separately as a warranty claim, if applicable.",
    emailTemplate: "Hello,\n\nThank you for reaching out to us.\n\nUnfortunately, as this return request is over 90 days from the purchase date, we are unable to approve the return request.\n\nThank you,"
  },

  // ── AMAZON WARRANTY ──────────────────────
  ob_amz_warranty_90: {
    id: "ob_amz_warranty_90",
    type: "question",
    section: "Amazon — Warranty",
    question: "Is the Amazon warranty request being made within 90 days from the purchase date?",
    helpText: "",
    choices: [
      { label: "Yes — Within 90 days of purchase date", short: "Within 90 days", next: "ob_amz_warranty_within90_terminal" },
      { label: "No — Over 90 days from purchase date", short: "Over 90 days", next: "ob_amz_warranty_over90_terminal" }
    ]
  },

  ob_amz_warranty_within90_terminal: {
    id: "ob_amz_warranty_within90_terminal",
    type: "terminal",
    section: "Amazon — Warranty Within 90 Days",
    terminalType: "approve",
    title: "Direct Customer to Amazon Return Process — Within 90 Days",
    body: "Ask the customer to initiate a return request directly through Amazon first. Once the return request is opened and approved through Amazon, the customer can send the item back for inspection, testing, and further resolution.\n\n⚠️ Do not manually provide a separate prepaid label outside Amazon unless approved by management. The customer should use Amazon's return process so the case is properly documented on the marketplace.\n\nAfter the item is received back, inspect the product, verify the serial number, test the reported issue, and check whether the item is damaged, used improperly, missing accessories, or returned in a different condition.",
    emailTemplate: "Hello,\n\nThank you for reaching out to us.\n\nSince your order is still within 90 days of the purchase date, please initiate a return request directly through Amazon for this order. Once the return request is opened through Amazon, you can send the item back using Amazon's return process, and we will review the item once it is received.\n\nAfter the item is received back, it will be inspected and tested. Once the inspection is completed, we will proceed with the next available resolution.\n\nThank you,\n\nRegards,\n\nGTA Electronics Store."
  },

  ob_amz_warranty_over90_terminal: {
    id: "ob_amz_warranty_over90_terminal",
    type: "terminal",
    section: "Amazon — Warranty Over 90 Days",
    terminalType: "decline",
    title: "Cannot Assist — Amazon Warranty Over 90 Days",
    body: "For Amazon warranty requests over 90 days from the purchase date, no direct return, exchange, refund, or seller-side resolution should be provided unless an exception is approved by management.\n\nAdvise the customer to contact the manufacturer directly for warranty support, repairs, or troubleshooting. General manufacturer contact information may be provided if available.\n\n⚠️ Do not approve a prepaid label, refund, or replacement without management approval.",
    emailTemplate: "Hello,\n\nThank you for reaching out to us.\n\nUnfortunately, as this order is over 90 days from the purchase date, we are unable to provide a return, exchange, refund, or direct seller-side warranty resolution.\n\nAt this stage, you would need to contact the manufacturer directly for any warranty support, repair options, or further assistance.\n\nThank you,\n\nRegards,\n\nGTA Electronics Store."
  }

};
