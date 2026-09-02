import type { StepsMap } from "./interface";

export const STEPS: StepsMap = {

  // ══════════════════════════════════════════
  // ROOT
  // ══════════════════════════════════════════
  start: {
    id: "start",
    type: "question",
    section: "Start",
    question: "Is a return request or warranty claim being requested?",
    helpText: "",
    choices: [
      {
        label: "Return Request — A return is when a customer wishes to send back a new or \"like-new\" product for a refund, exchange, or store credit due to no longer needing it or not being satisfied with it.",
        short: "Return Request",
        next: "return_purchase_type"
      },
      {
        label: "Warranty Claim — A \"warranty claim\" is when a product has been used/installed and the customer is experiencing an issue or the product is malfunctioning.",
        short: "Warranty Claim",
        next: "warranty_within_1yr"
      }
    ]
  },

  // ══════════════════════════════════════════
  // RETURN FLOW
  // ══════════════════════════════════════════
  return_purchase_type: {
    id: "return_purchase_type",
    type: "question",
    section: "Return Request",
    question: "Was the purchase made online or in-stores?",
    helpText: "",
    choices: [
      { label: "In-store", short: "In-store", next: "return_instore_terminal" },
      { label: "Online", short: "Online", next: "return_redo_info" }
    ]
  },

  return_instore_terminal: {
    id: "return_instore_terminal",
    type: "terminal",
    section: "In-store Purchases",
    terminalType: "info-end",
    title: "In-Store Purchase Policy",
    body: "No Refunds. Exchanges valid within 7 days of original date of purchase and is only valid if product(s) is unused and in the original packaging.\n\nIf the customer is adamant about proceeding with a return, kindly advise them to visit the store and speak directly with one of our associates.",
    emailTemplate: "As per our in-store return policy stated on the receipt, returns are only accepted within 7 days of the original purchase date, and only if the product(s) are unused and in their original packaging. Since the purchase falls outside the 7-day return window, or if the item has been opened or installed, you can visit our store location and speak to an associate who will be able to further review the situation in person and advise if any exceptions or alternatives may be possible."
  },

  return_redo_info: {
    id: "return_redo_info",
    type: "info",
    section: "Return Request — Online",
    infoType: "info",
    title: "Re-Do Return Portal",
    body: "If a customer submits a return request or carrier claim, please redirect them to process the return through Re-Do using the template below.",
    emailTemplate: "Hello,\n\nThank you for reaching out to us. We have received your request, and we're sorry to hear that the item did not work out for you.\n\nTo initiate your return request, please use the link below to access our Returns Portal:\nhttps://returns.getredo.com/widget_id/xya4an7bwb6kcwf/returns-portal/login\n\nTo locate your order in the portal, you will need to provide either the email address used to place the order or the ZIP/postal code associated with the order, along with your order number or tracking number. Once your request has been submitted, our team can review it and assist you accordingly.\n\nThank you,",
    next: "return_within_30"
  },

  return_within_30: {
    id: "return_within_30",
    type: "question",
    section: "Return Request — Online",
    question: "Is the return request being made within 30 days from the day of delivery or pickup?",
    helpText: "Purchases made between Nov. 1 and Dec. 31 are eligible for extended returns until Jan. 31 of the following year provided it is noted as a gift at the time of purchase.",
    choices: [
      { label: "Yes — Within 30 Days", short: "Within 30 days", next: "return_special_order" },
      { label: "No — Over 30 Days", short: "Over 30 days", next: "return_over30_terminal" }
    ]
  },

  return_over30_terminal: {
    id: "return_over30_terminal",
    type: "terminal",
    section: "Return Request — Over 30 Days",
    terminalType: "decline",
    title: "Return Request — Over 30 Days",
    body: "If a return request is made after 30 days without prior communication or indication of intent to return, it can be declined and refused.\n\nException: If the customer follows up after the initial refusal or insists on a return, we can authorize it if:\n• Product is in brand-new condition\n• Within one week past the 30-day period\n• Order value is $200 or under\n→ Return will be issued as STORE CREDIT ONLY.",
    emailTemplateDecline: "Hello,\n\nThank you for reaching out to us. We're sorry to hear the item didn't work out for you. However, as the return request is outside our 30-day return period, it is no longer eligible for return. Returns are only accepted for unused and uninstalled items requested within 30 days of delivery or pickup. We apologize for any inconvenience this may cause. Let us know if you have any further questions.\nShipping/Returns Policy: https://shop.singhelectronics.ca/shipping-returns-policy/\n\nThank you,",
    emailTemplateException: "Hello,\n\nAfter consulting with our manager team, we can accommodate a one-time exception and issue a store credit for the product, provided it is in new condition and has not been used or installed. To proceed with the return, you have two options for returning it: you may either drop it off at our store location or ship it back using the return address and RMA number provided below. Please note that the RMA number has now been issued, and you have up to 30 days to ensure the product is delivered to the designated return address.\nYou will be responsible for return shipping, and we recommend using a trackable carrier such as Purolator or UPS. Once shipped, please provide the tracking number so our team can process the return upon receipt.\nReturn processing may take up to 7 business days after delivery. Please note that shipping, Route, and programming fees are non-refundable. If the product is found to be opened, used, or installed, a restocking fee will apply. Let us know if you have any questions.\n\nATTN: Singh Electronics **RMA # (INSERT ORDER NUMBER)**\n7003 Steeles Avenue West, Unit #15\nToronto, Ontario M9W 0A2\n\nThank you,"
  },

  return_special_order: {
    id: "return_special_order",
    type: "question",
    section: "Return Request — Within 30 Days",
    question: "Did we special order the item(s) from Gemsen, Importel, Inmusic or Yorkville?",
    helpText: "",
    choices: [
      { label: "Yes — Item was special ordered", short: "Yes, special order", next: "return_special_order_terminal" },
      { label: "No — Not a special order", short: "No, not special order", next: "return_product_condition" }
    ]
  },

  return_special_order_terminal: {
    id: "return_special_order_terminal",
    type: "terminal",
    section: "Special Order — Return",
    terminalType: "decline",
    title: "Special Order — Return Not Approved",
    body: "If the item is a special-order product from Gemsen, Importel, Inmusic or Yorkville and is classified as a non-stocking item, return requests should not be approved.\n\nException: If the customer becomes argumentative, an exception may be made ONLY if the product remains unopened. In such cases, a restocking fee of 20–40% will apply.",
    emailTemplateDecline: "Hello,\n\nThank you for reaching out to us. We're sorry to hear that the item didn't work out for you. Unfortunately, because this product is a special-order item, it does not qualify for a return or exchange. We apologize for any inconvenience this may cause. For more details, please refer to our Shipping/Returns Policy. If you have any further questions, we're here to help.\n\nShipping/Returns Policy:\nhttps://shop.singhelectronics.ca/shipping-returns-policy/\n\nThank you,",
    emailTemplateException: "Hello,\n\nDespite the item being classified as a special-order product, your return request has been authorized by management as a one-time exception. If the product has not been used or installed, you may return it in one of two ways: you can drop it off at our store location, or you can ship it back using the return address and RMA number provided below. Please note that the RMA number has been issued, and you have 30 days to ensure the product is delivered to the designated return address.\n\nYou will be responsible for return shipping costs, and we recommend using a trackable carrier such as Purolator or UPS. Once the item has been shipped, please provide us with the tracking number so our team can prepare for processing upon receipt.\n\nReturn processing may take up to 7 business days after the item is delivered. Please note that shipping fees, Route protection, and programming fees are non-refundable. Additionally, a 20–40% restocking fee will apply.\n\nATTN: Singh Electronics **RMA # (INSERT ORDER NUMBER)**\n7003 Steeles Avenue West, Unit #15\nToronto, Ontario M9W 0A2\n\nThank you,"
  },

  return_product_condition: {
    id: "return_product_condition",
    type: "question",
    section: "Return Request — Product Condition",
    question: "Has the product been opened, used or installed?",
    helpText: "",
    emailTemplate: "Hello,\n\nThank you for reaching out to us. We have received your return request and are sorry to hear the item didn't work out for you. Before we proceed, could you confirm if the product has been opened, used, or installed, along with the reason for the return? Once we have this information, we can assist you accordingly.\n\nThank you,",
    choices: [
      { label: "No — Product has NOT been opened, used or installed", short: "Not opened/used", next: "return_unopened_terminal" },
      { label: "Yes — Product has been opened but NOT used or installed", short: "Opened, not used", next: "return_opened_terminal" },
      { label: "Yes — Product has been opened, used AND installed", short: "Opened, used & installed", next: "return_used_terminal" }
    ]
  },

  return_unopened_terminal: {
    id: "return_unopened_terminal",
    type: "terminal",
    section: "Return — Not Opened",
    terminalType: "approve",
    title: "Return Authorized — Product Unopened",
    body: "Return request can be authorized.\nCustomer will be responsible for shipping or dropping off the product at our store.\nShipping, Route, and programming fees are non-refundable.",
    emailTemplate: "Hello,\n\nYour return request has been approved. If the product has not been opened, used, or installed, you may return it in one of two ways:\n\n• Drop it off at our store location, or\n• Ship it back using the return address and **RMA # (INSERT ORDER NUMBER)** provided below.\n\nYour RMA number has now been issued, and you have up to 30 days to ensure the product is delivered to the designated return address.\n\nPlease ensure the item is returned in the same condition in which it was received, including the original manufacturer's packaging and all accessories. Do not place shipping labels or tape directly on the manufacturer's box, as the original barcodes are required for processing. Instead, place the manufacturer's box inside a separate shipping carton with adequate protective packaging to prevent damage during transit.\n\nReturn shipping is the customer's responsibility. We recommend using a trackable shipping service such as UPS or Purolator. Once the item has been shipped, please send us the tracking number so we can monitor the return and process it promptly upon arrival.\n\nPlease allow up to 7 business days for the return to be processed after the item has been delivered to our facility.\n\nPlease note that shipping charges, Route Package Protection, and programming fees are non-refundable. If the returned product is found to have been opened, used, or installed, a restocking fee will apply. If you have any questions, please don't hesitate to contact us.\n\nATTN: Singh Electronics **RMA # (INSERT ORDER NUMBER)**\n7003 Steeles Avenue West, Unit #15\nToronto, Ontario M9W 0A2\n\nThank you,"
  },

  return_opened_terminal: {
    id: "return_opened_terminal",
    type: "terminal",
    section: "Return — Opened, Not Used",
    terminalType: "approve",
    title: "Return Authorized — Opened but Not Used/Installed",
    body: "Return can be authorized. A restocking fee may apply and will be assessed upon receiving the product.\nCustomer responsible for shipping or drop-off.\nShipping, Route, and programming fees are non-refundable.\n\n⚠️ Exception: For amplifiers with an inner seal (e.g., Taramps, Stetsom, etc.), if the inner seal is broken or opened, the return will be DECLINED and refused.",
    emailTemplate: "Hello,\n\nYour return request has been approved. If the product has not been used or installed, you may return it in one of two ways:\n\n• Drop it off at our store location, or\n• Ship it back using the return address and **RMA # (INSERT ORDER NUMBER)** provided below.\n\nYour RMA number has now been issued, and you have up to 30 days to ensure the product is delivered to the designated return address.\n\nPlease ensure the item is returned in the same condition in which it was received, including the original manufacturer's packaging and all accessories. Do not place shipping labels or tape directly on the manufacturer's box, as the original barcodes are required for processing. Instead, place the manufacturer's box inside a separate shipping carton with adequate protective packaging to prevent damage during transit.\n\nReturn shipping is the customer's responsibility. We recommend using a trackable shipping service such as UPS or Purolator. Once the item has been shipped, please send us the tracking number so we can monitor the return and process it promptly upon arrival.\n\nPlease allow up to 7 business days for the return to be processed after the item has been delivered to our facility.\n\nPlease note that shipping charges, Route Package Protection, and programming fees are non-refundable. If the returned product is found to have been opened, used, or installed, a restocking fee will apply. If you have any questions, please don't hesitate to contact us.\n\nATTN: Singh Electronics **RMA # (INSERT ORDER NUMBER)**\n7003 Steeles Avenue West, Unit #15\nToronto, Ontario M9W 0A2\n\nThank you,"
  },

  return_used_terminal: {
    id: "return_used_terminal",
    type: "terminal",
    section: "Return — Opened, Used & Installed",
    terminalType: "decline",
    title: "Return Refused — Product Used & Installed",
    body: "If the product has been opened, used, and installed, the return can be refused.\nHowever, please check if the situation falls within the scope of a warranty claim.\n\nException: If a customer has used or installed a radio installation part (e.g., dash kit, harness, interface, antenna adapter, etc.) but wishes to exchange it for the correct part, we can make an exception:\n• A restocking fee will apply\n• Original box and all included accessories must be returned\n• EXCHANGE ONLY — refunds are not applicable",
    emailTemplate: "Hello,\n\nThank you for reaching out to us. We're sorry to hear the item didn't work out for you. However, as the product has been used and installed, it is no longer eligible for return. Returns are only accepted for items that have not been used or installed. We apologize for any inconvenience this may cause. Please let us know if you have any further questions.\nShipping/Returns Policy: https://shop.singhelectronics.ca/shipping-returns-policy/\n\nThank you,"
  },

  // ══════════════════════════════════════════
  // WARRANTY FLOW
  // ══════════════════════════════════════════
  warranty_within_1yr: {
    id: "warranty_within_1yr",
    type: "question",
    section: "Warranty Claim",
    question: "Is the warranty claim being made within 1 year from the day of purchase?",
    helpText: "Most products come with a one-year manufacturer's warranty which typically covers defects in workmanship or parts only.",
    choices: [
      { label: "No — Over 1 Year", short: "Over 1 year", next: "warranty_over1yr_terminal" },
      { label: "Yes — Within 1 Year", short: "Within 1 year", next: "warranty_product_type" }
    ]
  },

  warranty_over1yr_terminal: {
    id: "warranty_over1yr_terminal",
    type: "terminal",
    section: "Warranty — Over 1 Year",
    terminalType: "decline",
    title: "Warranty Declined — Over 1 Year",
    body: "If the warranty claim is being made beyond the one-year period, it will be declined, as it exceeds the manufacturer's one-year warranty. Customer may contact the manufacturer directly.\n\nExtended Warranty Exceptions:\n• Kenwood Excelon products & DMX40S/DMX50S → 2 years\n• JBL Stadium series → 3 years\n• Audiocontrol (by Authorized dealer) → Electronics: 5 years / Speakers & Subwoofers: 2 years\n• Shure → 2 years (except rechargeable batteries and Q5X series = 1 year)\n• Digiflex standard cables → LIFETIME warranty\n• Tury products → 2 years\n• Wet Sounds → 2 years",
    emailTemplate: "Hello,\n\nThank you for reaching out to us. We're sorry to hear you're experiencing issues with your product. Unfortunately, since the claim is being made outside the one-year warranty period, it is no longer eligible for warranty coverage. For further assistance, we recommend contacting the manufacturer directly.\nWarranty Policy: https://shop.singhelectronics.ca/warranty-policy/\n\nThank you,"
  },

  warranty_product_type: {
    id: "warranty_product_type",
    type: "question",
    section: "Warranty — Product Type",
    question: "What type of product is it?",
    helpText: "",
    choices: [
      { label: "Radio / Receiver / Stereo / Head Unit", short: "Radio/Stereo", next: "warranty_stereo_confirm" },
      { label: "Subwoofer", short: "Subwoofer", next: "warranty_sub_confirm" },
      { label: "Speaker / Tweeter", short: "Speaker/Tweeter", next: "warranty_speaker_confirm" },
      { label: "Amplifier", short: "Amplifier", next: "warranty_amp_confirm" },
      { label: "Signal Processor", short: "Signal Processor", next: "warranty_sp_confirm" },
      { label: "Battery", short: "Battery", next: "warranty_battery_confirm" },
      { label: "Remote Starter / Interfaces", short: "Remote Starter/Interface", next: "warranty_remote_confirm" },
      { label: "All Other Products", short: "Other Products", next: "warranty_other_confirm" }
    ]
  },

  // ── STEREO ──────────────────────────────
  warranty_stereo_confirm: {
    id: "warranty_stereo_confirm",
    type: "info",
    section: "Warranty — Stereo",
    title: "Step Required Before Proceeding",
    infoType: "info",
    body: "Ask the customer for:\n• A detailed description of the issue they're experiencing (a general statement is not sufficient)\n• The serial number of the product (clear photo)\n\nA sufficient explanation includes: specific symptoms, when it happens, under what conditions, etc.",
    emailTemplate: "Hello,\n\nThank you for reaching out. In order for us to assist you further, could you please provide a detailed description of the issue you're experiencing with the product? Additionally, if the stereo has a serial number, kindly include a clear photo of it as well. This information will help us move forward with the necessary support or warranty steps.\n\nThank you,",
    images: [
      { src: "/stereo-bad-description.png", caption: "❌ Insufficient — vague, no symptoms, no detail" },
      { src: "/stereo-good-description.png", caption: "✅ Sufficient — specific symptoms, conditions, actions taken" },
    ],
    next: "warranty_stereo_within30"
  },

  warranty_stereo_within30: {
    id: "warranty_stereo_within30",
    type: "question",
    section: "Warranty — Stereo",
    question: "Was the product picked up or delivered within the last 30 days?",
    helpText: "",
    choices: [
      { label: "Yes — Within 30 days", short: "Within 30 days", next: "warranty_stereo_within30_terminal" },
      { label: "No — Over 30 days ago", short: "Over 30 days", next: "warranty_stereo_brand" }
    ]
  },

  warranty_stereo_within30_terminal: {
    id: "warranty_stereo_within30_terminal",
    type: "terminal",
    section: "Warranty — Stereo Within 30 Days",
    terminalType: "approve",
    title: "Ship Back to Store — Within 30 Days",
    body: "Customer believes the stereo has a manufacturing defect. They can return the unit with all original accessories.\n\nIf confirmed defective and issue replicated:\n• We cover return shipping within Canada via ground service\n• Provide replacement if in stock\n• If sold out / long ETA / discontinued → exchange or store credit (no refunds)\n• Replacement issued only ONCE. If replacement also defective → customer contacts manufacturer.\n\n⚠️ If no defect found and issue cannot be replicated → warranty claim denied. Customer responsible for return shipping.\n\n⚠️ Replacement Policy: If a product is deemed defective, a replacement will only be issued once. If the customer believes the replacement unit is also defective, they will need to contact the manufacturer for further assistance.",
    emailTemplate: "Hello,\n\nThank you for reaching out to us. If you believe the stereo may be defective, you have two options: you can either ship it back to our store location or drop it off in stores for evaluation. Once received, our team will thoroughly inspect the unit. If we are able to replicate the issue and confirm the defect, we will be happy to provide a replacement.\n\nKindly ensure the item is returned in the same condition as received, including the original manufacturer packaging and all accessories. Please do not place labels directly on the manufacturer's box, as the barcodes are required for processing. Instead, please place the manufacturer's box inside a separate shipping box and use protective material to prevent any damage in transit.\n\nWhen returning the item, we recommend using a trackable carrier such as Purolator or UPS. Once shipped, please provide the tracking number so our team can process the return upon receipt.\n\nPlease note that if no fault is found, return shipping costs will not be covered. All serial numbers are verified on returns, and if an item is found to be tampered with or does not match our records, the claim may be refused.\n\nThe warranty evaluation process may take up to seven business days from the date of arrival.\n\n**Ship to Address:**\nATTN: Singh Electronics Warranty **RMA # (INSERT ORDER NUMBER)**\n7003 Steeles Avenue West, Unit #15\nToronto, Ontario M9W 0A2\n\nThank you,"
  },

  warranty_stereo_brand: {
    id: "warranty_stereo_brand",
    type: "question",
    section: "Warranty — Stereo Brand",
    question: "What brand stereo is it?",
    helpText: "",
    choices: [
      { label: "Pioneer", short: "Pioneer", next: "warranty_stereo_pioneer_terminal" },
      { label: "JVC / Kenwood", short: "JVC/Kenwood", next: "warranty_stereo_kenwood_terminal" },
      { label: "Boss Audio / Clarion / Precision Power (Gemsen Brands)", short: "Boss/Clarion/PP (Gemsen)", next: "warranty_stereo_gemsen_terminal" },
      { label: "All Other Brands (e.g. Atoto, DS18, Sony, Alpine, etc.)", short: "Other brands", next: "warranty_stereo_other_terminal" }
    ]
  },

  warranty_stereo_pioneer_terminal: {
    id: "warranty_stereo_pioneer_terminal",
    type: "terminal",
    section: "Warranty — Pioneer Stereo",
    terminalType: "direct",
    title: "Direct to Authorized Service Centre — Pioneer",
    body: "After 30 days, the customer must contact Northstar Electronics Company (Pioneer's authorized repair center) in Markham, ON.\n\nContact Details:\nAddress: 75 Cathedral High St, Markham, ON L6C 0P1\nEmail: info@northstarelectronics.ca\nPhone: (647) 880-6888\nHours: Monday to Friday, 9am–6pm\n\nCustomer must provide a sales receipt.",
    emailTemplate: "Hello,\n\nThank you for contacting us. We are sorry to hear that you are experiencing issues with your Pioneer stereo. Please be informed that the Pioneer stereo is covered under a 1-year manufacturer's warranty. To initiate the warranty process, kindly reach out to the designated warranty service center. They will facilitate the necessary arrangements for the repair or replacement of your stereo. Below, you will find the contact information and location details of the warranty service center.\nAddress: 75 Cathedral High St, Markham, ON L6C 0P1\nEmail: info@northstarelectronics.ca\nPhone: (647) 880-6888\nMonday to Friday: 9am–6pm\n\nThank you,"
  },

  warranty_stereo_kenwood_terminal: {
    id: "warranty_stereo_kenwood_terminal",
    type: "terminal",
    section: "Warranty — JVC/Kenwood Stereo",
    terminalType: "direct",
    title: "Direct to Authorized Service Centre — JVC/Kenwood",
    body: "After 30 days, customer contacts an authorized repair center. If unrepairable, a replacement may be issued.\nCustomer must contact repair center directly and provide a sales receipt.\n\nUse link to find nearest service center:\nhttps://locator.kenwood.com/ca/\n\nNearest known centre:\nDowntown Audio Video Electronics\n1585 Britannia Rd E Unit F7, Mississauga, ON L4W 2M4\nPhone: (905) 564-3682",
    emailTemplate: "Hello,\n\nThank you for contacting us. We are sorry to hear that you are experiencing issues with your Kenwood stereo. Please be informed that the Kenwood stereo is covered under a 1-year manufacturer's warranty. To initiate the warranty process, kindly reach out to the designated warranty service center.\nKenwood's Official website: https://locator.kenwood.com/ca/\n\nService Centre: Downtown Audio Video Electronics\nAddress: 1585 Britannia Rd E Unit F7, Mississauga, ON L4W 2M4\nPhone: (905) 564-3682\n\nThank you,"
  },

  warranty_stereo_gemsen_terminal: {
    id: "warranty_stereo_gemsen_terminal",
    type: "terminal",
    section: "Warranty — Gemsen Brand Stereo",
    terminalType: "approve",
    title: "Ship Back to Store — Gemsen Brand Stereo",
    body: "Customer ships defective unit back to store with all original accessories.\nIf confirmed defective → sent to distributor for repair.\nIf unrepairable → replacement issued.\nProcess takes approximately 1–2 weeks. Customer should be informed of timeframe.\nWe cover return shipping within Canada (ground service) if defective.\n\n⚠️ If no defect found → claim denied. Customer responsible for return shipping.\n\n⚠️ Replacement Policy: If a product is deemed defective, a replacement will only be issued once. If the customer believes the replacement unit is also defective, they will need to contact the manufacturer for further assistance.",
    emailTemplate: "Hello,\n\nThank you for reaching out to us. If you believe the stereo may be defective, you have two options: you can either ship it back to our store location or drop it off in stores for evaluation. Once received, our team will thoroughly inspect the unit. If we are able to replicate the issue and confirm the defect, we will be happy to provide a replacement.\n\nKindly ensure the item is returned in the same condition as received, including the original manufacturer packaging and all accessories. Please do not place labels directly on the manufacturer's box, as the barcodes are required for processing. Instead, please place the manufacturer's box inside a separate shipping box and use protective material to prevent any damage in transit.\n\nWhen returning the item, we recommend using a trackable carrier such as Purolator or UPS. Once shipped, please provide the tracking number so our team can process the return upon receipt.\n\nPlease note that if no fault is found, return shipping costs will not be covered. All serial numbers are verified on returns, and if an item is found to be tampered with or does not match our records, the claim may be refused.\n\nThe warranty evaluation process may take up to seven business days from the date of arrival.\n\n**Ship to Address:**\nATTN: Singh Electronics Warranty **RMA # (INSERT ORDER NUMBER)**\n7003 Steeles Avenue West, Unit #15\nToronto, Ontario M9W 0A2\n\nThank you,"
  },

  warranty_stereo_other_terminal: {
    id: "warranty_stereo_other_terminal",
    type: "terminal",
    section: "Warranty — Other Brand Stereo",
    terminalType: "approve",
    title: "Ship Back to Store — Other Brand Stereo",
    body: "Customer ships defective unit back to store with all original accessories.\nIf confirmed defective → we cover return shipping (Canada, ground) and replace if in stock.\nIf sold out / long ETA / discontinued → exchange or store credit (no refunds).\n\n⚠️ If no defect found and issue cannot be replicated → claim denied. Customer responsible for return shipping.\n\n⚠️ Replacement Policy: If a product is deemed defective, a replacement will only be issued once. If the customer believes the replacement unit is also defective, they will need to contact the manufacturer for further assistance.",
    emailTemplate: "Hello,\n\nThank you for reaching out to us. If you believe the stereo may be defective, you have two options: you can either ship it back to our store location or drop it off in stores for evaluation. Once received, our team will thoroughly inspect the unit. If we are able to replicate the issue and confirm the defect, we will be happy to provide a replacement.\n\nKindly ensure the item is returned in the same condition as received, including the original manufacturer packaging and all accessories. Please do not place labels directly on the manufacturer's box, as the barcodes are required for processing. Instead, please place the manufacturer's box inside a separate shipping box and use protective material to prevent any damage in transit.\n\nWhen returning the item, we recommend using a trackable carrier such as Purolator or UPS. Once shipped, please provide the tracking number so our team can process the return upon receipt.\n\nPlease note that if no fault is found, return shipping costs will not be covered. All serial numbers are verified on returns, and if an item is found to be tampered with or does not match our records, the claim may be refused.\n\nThe warranty evaluation process may take up to seven business days from the date of arrival.\n\n**Ship to Address:**\nATTN: Singh Electronics Warranty **RMA # (INSERT ORDER NUMBER)**\n7003 Steeles Avenue West, Unit #15\nToronto, Ontario M9W 0A2\n\nThank you,"
  },

  // ── SUBWOOFER ────────────────────────────
  warranty_sub_confirm: {
    id: "warranty_sub_confirm",
    type: "info",
    section: "Warranty — Subwoofer",
    infoType: "info",
    title: "Step Required Before Proceeding",
    body: "Ask the customer for a detailed description of the issue:\n• Describe their full setup (amplifier, enclosure, wiring)\n• Is the subwoofer stiff and not moving?\n• Is there any sound or distortion?\n• Serial number (clear photo)\n\nNOT covered under warranty:\n• Blown or burnt voice coil\n• Damage from excessive power\n• Damaged dust caps\n• Improper installation or enclosure\n• Accidental damage, misuse, abuse, improper wiring\n• Fire or water damage\n• Operation outside listed specifications\n• Modifications or repairs by unauthorized parties\n• Normal wear and tear",
    emailTemplate: "Hello,\n\nWe're sorry to hear you're experiencing an issue with your subwoofer. In order to better understand what may have occurred and determine how we can assist you, we kindly ask that you provide a few additional details:\n• Could you describe your full setup, including the amplifier, enclosure, and wiring used?\n• Is there any burning smell coming from the subwoofer?\n• When gently pressing on the center of the cone, does it move freely, or does it feel stiff or scratchy?\n• If possible, please send us a clear photo of the voice coil.\n• If the subwoofer has a visible serial number, kindly include a clear photo of it as well.\nThis information will help us determine the most appropriate next steps.\n\nWe look forward to your response,",
    next: "warranty_sub_voicecoil"
  },

  warranty_sub_voicecoil: {
    id: "warranty_sub_voicecoil",
    type: "question",
    section: "Warranty — Subwoofer",
    question: "Does the subwoofer have a burnt or blown voice coil?",
    helpText: "Check: Is there visible smoke or burning smell? When pressing the cone, is there a scratching sound? Ask customer to provide a clear picture of the voice coil. A healthy coil has bright copper color. A damaged coil appears separated, discolored (dark/burnt), or frayed.",
    images: [
      { src: "/voicecoil-3.png", caption: "Where to look — voice coil visible through vents (highlighted)" },
      { src: "/voicecoil-1.png", caption: "Burnt voice coil — discolored, dark/red, damaged winding" },
      { src: "/voicecoil-2.png", caption: "Burnt voice coil — close-up of damage" },
    ],
    choices: [
      { label: "Yes — Voice coil is blown or burnt", short: "Yes, blown/burnt", next: "warranty_sub_blownvc_terminal" },
      { label: "No — Voice coil appears normal", short: "No, voice coil OK", next: "warranty_sub_brand" },
      { label: "Unable to verify", short: "Unable to verify", next: "warranty_sub_unverified_terminal" }
    ]
  },

  warranty_sub_blownvc_terminal: {
    id: "warranty_sub_blownvc_terminal",
    type: "terminal",
    section: "Warranty — Subwoofer",
    terminalType: "decline",
    title: "Warranty Declined — Blown/Burnt Voice Coil",
    body: "Voice coil damage is NOT covered under the manufacturer's warranty.\nOffer a goodwill discount on a replacement subwoofer or next purchase.",
    emailTemplate: "Hello,\n\nThank you for providing the images. After reviewing the photos, it appears the issue is related to damage to the voice coil. Unfortunately, this type of issue is not covered under the manufacturer's warranty, and as such, we are unable to process a warranty claim in this case.\n\nThat said, we truly value your business and would like to offer a goodwill discount toward a replacement subwoofer or your next purchase. If you have a specific model in mind, please let us know and we'll be happy to provide you with the best possible pricing.\n\nThank you,"
  },

  warranty_sub_unverified_terminal: {
    id: "warranty_sub_unverified_terminal",
    type: "terminal",
    section: "Warranty — Subwoofer",
    terminalType: "info-end",
    title: "Voice Coil — Unable to Verify",
    body: "Customer is unable to provide sufficient photos or detailed description → warranty claim cannot be approved at this time.\nSubwoofer must be shipped back for evaluation.\n\n⚠️ Inform customer: if the issue is determined to be a damaged or blown voice coil, it will NOT be covered under warranty.",
    emailTemplate: "Hello,\n\nThank you for reaching out to us. If you believe the subwoofer may be defective, you have two options: you can either ship it back to our store location or drop it off in stores for evaluation. Once received, our team will thoroughly inspect the unit. If we are able to replicate the issue and confirm the defect, we will be happy to provide a replacement.\n\nKindly ensure the item is returned in the same condition as received, including the original manufacturer packaging and all accessories. Please do not place labels directly on the manufacturer's box, as the barcodes are required for processing. Instead, please place the manufacturer's box inside a separate shipping box and use protective material to prevent any damage in transit.\n\nWhen returning the item, we recommend using a trackable carrier such as Purolator or UPS. Once shipped, please provide the tracking number so our team can process the return upon receipt.\n\nPlease note that if no fault is found, return shipping costs will not be covered. All serial numbers are verified on returns, and if an item is found to be tampered with or does not match our records, the claim may be refused.\n\nThe warranty evaluation process may take up to seven business days from the date of arrival.\n\n**Ship to Address:**\nATTN: Singh Electronics Warranty **RMA # (INSERT ORDER NUMBER)**\n7003 Steeles Avenue West, Unit #15\nToronto, Ontario M9W 0A2\n\nThank you,"
  },

  warranty_sub_brand: {
    id: "warranty_sub_brand",
    type: "question",
    section: "Warranty — Subwoofer Brand",
    question: "What brand subwoofer is it?",
    helpText: "",
    choices: [
      { label: "American Bass, B2 Audio, Cerwin-Vega (Direct), Fi Audio, Orion, Pride Audio, Timpano, VFL Audio — Direct to Manufacturer", short: "Direct to Manufacturer brands", next: "warranty_sub_direct_terminal" },
      { label: "Avatar, Audiocontrol, Clarion (Marine), Deaf Bonce, Focal, JL Audio (W6/W7/TW), Morel, Sundown Audio (M-Series, SA v.2, SA v.3, X-Series, Zv-Series, Nightshade Series) — Ship Back to Store", short: "Ship to Store brands", next: "warranty_sub_shipback_terminal" },
      { label: "Alpine, Boss Audio, Cerwin-Vega (Automob), Clarion (Car), CT Sounds, DB Drive, DS18, Hertz, Infinity, JBL, JL Audio (W0/W1/W3), Kenwood, Kicker (Gemsen), Memphis, MTX, Pioneer, Rockford, Skar, Sony, Sundown Audio (LCS, SA Classic Series, E-Series, SML, SLD, U-Series) — IFD Eligible", short: "IFD eligible brands", next: "warranty_sub_price" },
      { label: "All Other Brands / Powered Enclosures", short: "Other brands", next: "warranty_sub_shipback_terminal" }
    ]
  },

  warranty_sub_direct_terminal: {
    id: "warranty_sub_direct_terminal",
    type: "terminal",
    section: "Warranty — Subwoofer",
    terminalType: "direct",
    title: "Direct to Manufacturer — Subwoofer",
    body: "Customer contacts manufacturer directly for warranty assistance.\n\nManufacturer Contacts:\n• B2 Audio: https://www.b2audio.com/warranty/\n• Cerwin-Vega (Direct): https://cerwinvega.com/pages/contact\n• Fi Audio: https://ficaraudio.com/warranty/\n• Orion: https://orioncaraudio.com/pages/contact-us-draft\n• Pride Audio: https://pride.audio/support/\n• Timpano: https://timpanoaudio.com/warranty-center/\n• American Bass: https://www.americanbassusa.com/pages/contact",
    emailTemplate: "Hello,\n\nThank you for contacting us. We're sorry to hear you're experiencing issues with your subwoofer. Please note that this brand handles all warranty claims directly. To initiate the warranty process, you will need to contact the manufacturer for further assistance. **[INSERT MANUFACTURER WARRANTY/CONTACT LINK HERE]** You can find their contact information and submit your inquiry through their official website. If you have any questions or need further support during this process, please don't hesitate to reach out.\n\nThank you,"
  },

  warranty_sub_shipback_terminal: {
    id: "warranty_sub_shipback_terminal",
    type: "terminal",
    section: "Warranty — Subwoofer",
    terminalType: "approve",
    title: "Ship Back to Store — Subwoofer",
    body: "One-year manufacturer's warranty. Customer ships unit back with all original accessories. Customer responsible for return shipping.\n\nIf confirmed defective:\n• We cover return shipping within Canada (ground service)\n• Replacement issued if in stock\n• Replacement issued only ONCE\n• If replacement also defective → contact manufacturer\n\nIf sold out / discontinued → exchange or store credit (no refunds)\n\n⚠️ Note: Audiocontrol and Morel — initiate RMA process with Gemsen first (they may authorize in-field destroy). Must be approved by Gemsen first!\n\n⚠️ If no defect found → claim denied. Customer responsible for return shipping.\n\n⚠️ Replacement Policy: If a product is deemed defective, a replacement will only be issued once. If the customer believes the replacement unit is also defective, they will need to contact the manufacturer for further assistance.",
    emailTemplate: "Hello,\n\nThank you for reaching out to us. If you believe the subwoofer may be defective, you have two options: you can either ship it back to our store location or drop it off in stores for evaluation. Once received, our team will thoroughly inspect the unit. If we are able to replicate the issue and confirm the defect, we will be happy to provide a replacement.\n\nKindly ensure the item is returned in the same condition as received, including the original manufacturer packaging and all accessories. Please do not place labels directly on the manufacturer's box, as the barcodes are required for processing. Instead, please place the manufacturer's box inside a separate shipping box and use protective material to prevent any damage in transit.\n\nWhen returning the item, we recommend using a trackable carrier such as Purolator or UPS. Once shipped, please provide the tracking number so our team can process the return upon receipt.\n\nPlease note that if no fault is found, return shipping costs will not be covered. All serial numbers are verified on returns, and if an item is found to be tampered with or does not match our records, the claim may be refused.\n\nThe warranty evaluation process may take up to seven business days from the date of arrival.\n\n**Ship to Address:**\nATTN: Singh Electronics Warranty **RMA # (INSERT ORDER NUMBER)**\n7003 Steeles Avenue West, Unit #15\nToronto, Ontario M9W 0A2\n\nThank you,"
  },

  warranty_sub_price: {
    id: "warranty_sub_price",
    type: "question",
    section: "Warranty — Subwoofer IFD",
    question: "What is the retail price of the subwoofer (before taxes)?",
    helpText: "This determines whether In-Field Destroy (IFD) can be authorized directly or requires management approval.",
    choices: [
      { label: "$300 and under", short: "$300 and under", next: "warranty_sub_ifd_terminal" },
      { label: "Over $300", short: "Over $300", next: "warranty_sub_over300_terminal" }
    ]
  },

  warranty_sub_ifd_terminal: {
    id: "warranty_sub_ifd_terminal",
    type: "terminal",
    section: "Warranty — Subwoofer IFD",
    terminalType: "approve",
    title: "In-Field Destroy (IFD) Authorized — Subwoofer ≤$300",
    body: "Serial number (if applicable) must match our records.\n\nInstructions for customer:\n1. Remove subwoofer from enclosure (if applicable)\n2. Render permanently unusable by cutting the surround and damaging the driver\n3. Ensure serial number is clearly visible in photos\n4. Send photos to us for approval\n\nOnce photos approved → issue replacement unit (core product only, no accessories).\n\n⚠️ Add case to the RMA sheet and notify the appropriate person so the warranty claim can be processed with the supplier/distributor.",
    emailTemplate: "Hello,\n\nThank you for your patience as we reviewed your case. Based on the details provided, we have approved an In-Field Destruct (IFD) for your defective subwoofer. To proceed, you will need to remove the subwoofer from the enclosure (if applicable) and render it permanently unusable by cutting the surround and damaging the driver. Please also ensure the serial number is clearly visible in the images, if applicable.\n\nOnce we receive and approve the images showing the completed IFD process, we will proceed with issuing a replacement unit. The defective subwoofer can then be safely discarded.\n\nThank you,",
    images: [
      { src: "/ifd-example-sub-kicker.png", caption: "✅ Acceptable IFD — surround cut, driver damaged, serial visible (Kicker)" },
      { src: "/ifd-example-sub-pioneer.png", caption: "✅ Acceptable IFD — removed from enclosure, surround cut (Pioneer)" },
    ],
  },

  warranty_sub_over300_terminal: {
    id: "warranty_sub_over300_terminal",
    type: "terminal",
    section: "Warranty — Subwoofer IFD Over $300",
    terminalType: "escalate",
    title: "Escalate to Management — Subwoofer Over $300",
    body: "Subwoofer retails for over $300 before taxes.\nConsult with management before proceeding and approving an in-field destroy.\n\nManagement will:\n• Review case details to confirm issue is a general defect\n• Ensure customer's responses provide sufficient information\n• Initiate the RMA process with the vendor/distributor\n• Authorize if approved"
  },

  // ── SPEAKER / TWEETER ────────────────────
  warranty_speaker_confirm: {
    id: "warranty_speaker_confirm",
    type: "info",
    section: "Warranty — Speaker/Tweeter",
    infoType: "info",
    title: "Step Required Before Proceeding",
    body: "Ask the customer for a detailed description:\n• How many speakers/tweeters are affected?\n• Describe the issue (crackling, distorting, no sound, etc.)\n• Are the products amplified?\n• Serial numbers (if applicable)\n\nNOT covered under warranty:\n• Blown/burnt voice coil\n• Damage from excessive power / damaged dust caps\n• Improper installation\n• Accidental damage, misuse, abuse, improper wiring\n• Broken or ceased speaker baskets/cones\n• Fire or water damage / broken speaker terminals\n• Operation outside listed specifications\n• Normal wear and tear",
    emailTemplate: "Hello,\n\nWe're sorry to hear you're experiencing an issue with your speakers. To help us better understand the situation, we kindly ask that you provide the following details:\n• How many speakers or tweeters are affected?\n• Detailed description of the issue (no sound, distortion, crackling, etc.)\n• Are the speakers or tweeters amplified?\n• If possible, please provide a clear photo of the serial number on the speaker(s).\n\nThank you,",
    next: "warranty_speaker_issue_type"
  },

  warranty_speaker_issue_type: {
    id: "warranty_speaker_issue_type",
    type: "question",
    section: "Warranty — Speaker/Tweeter",
    question: "Is the speaker or tweeter producing no sound, or is it experiencing crackling or distortion?",
    helpText: "",
    choices: [
      { label: "Crackling or Distortion", short: "Crackling/Distortion", next: "warranty_speaker_amplified" },
      { label: "No Sound", short: "No Sound", next: "warranty_speaker_how_many" }
    ]
  },

  warranty_speaker_amplified: {
    id: "warranty_speaker_amplified",
    type: "question",
    section: "Warranty — Speaker/Tweeter",
    question: "Is the speaker or tweeter being amplified?",
    helpText: "",
    choices: [
      { label: "Yes — Amplified (advise customer to tune system first and check if issue resolves)", short: "Yes, amplified", next: "warranty_speaker_amplified_info" },
      { label: "No — Not amplified (could suggest a defect, proceed to next step)", short: "Not amplified", next: "warranty_speaker_how_many" }
    ]
  },

  warranty_speaker_amplified_info: {
    id: "warranty_speaker_amplified_info",
    type: "info",
    section: "Warranty — Speaker/Tweeter",
    infoType: "warn",
    title: "Advise Customer to Tune System First",
    body: "If crackling/distortion is present and product is amplified, advise customer to tune their system:\n• Check amplifier gain settings\n• Check crossover points\n• Ensure no clipping or signal imbalance\n\nAfter tuning, test the system again. If issue persists → proceed to next step.",
    emailTemplate: "Hello,\n\nThank you for the update. If you're experiencing crackling or distortion from your speakers and they are connected to an amplifier, we recommend starting by tuning your system—this includes checking your amplifier gain settings, crossover points, and making sure there's no clipping or signal imbalance. Sometimes improper tuning can cause unwanted distortion or noise.\nAfter tuning, please test the system again. If the issue persists despite proper tuning, let us know and we can proceed with the next steps.\n\nThank you,",
    next: "warranty_speaker_how_many"
  },

  warranty_speaker_how_many: {
    id: "warranty_speaker_how_many",
    type: "question",
    section: "Warranty — Speaker/Tweeter",
    question: "How many speakers or tweeters are defective?",
    helpText: "",
    choices: [
      { label: "1 (only one of two is defective)", short: "Only 1 defective", next: "warranty_speaker_swap" },
      { label: "2 (both are defective)", short: "Both defective", next: "warranty_speaker_brand" }
    ]
  },

  warranty_speaker_swap: {
    id: "warranty_speaker_swap",
    type: "question",
    section: "Warranty — Speaker/Tweeter",
    question: "Only 1 of 2 speakers/tweeters is defective. Ask customer to swap it with the working one and test.",
    helpText: "If customer is unable to swap, proceed to next step.",
    emailTemplate: "Hello,\n\nThank you for the update. If only one out of the two speakers or tweeters is experiencing issues, we recommend trying to swap its position with the working one. This will help determine whether the issue is with the speaker itself or something else in the setup, such as wiring or the amplifier channel.\n\nIf you've already done this and the problem still persists with the same speaker or if you're unable to perform the swap, please let us know and we'll guide you on the next steps.\n\nThank you,",
    choices: [
      { label: "Issue is No Longer Present after swapping — problem is likely wiring/setup, not the product", short: "Issue gone after swap", next: "warranty_speaker_wiring_terminal" },
      { label: "Issue Remains with the same speaker after swapping — suggests a defect in the product", short: "Issue stays with speaker", next: "warranty_speaker_brand" },
      { label: "Customer is unable to test/swap the speakers", short: "Unable to test", next: "warranty_speaker_brand" }
    ]
  },

  warranty_speaker_wiring_terminal: {
    id: "warranty_speaker_wiring_terminal",
    type: "terminal",
    section: "Warranty — Speaker/Tweeter",
    terminalType: "info-end",
    title: "Issue Appears to Be Wiring / Setup",
    body: "After swapping positions, the issue no longer follows the speaker — this suggests the problem is related to wiring or the setup (e.g., amplifier channel, wiring harness), not a defect in the product."
  },

  warranty_speaker_brand: {
    id: "warranty_speaker_brand",
    type: "question",
    section: "Warranty — Speaker Brand",
    question: "What brand speaker or tweeter is it?",
    helpText: "",
    choices: [
      { label: "DS18 and Selenium Tweeters", short: "DS18 & Selenium Tweeters", next: "warranty_speaker_ds18_terminal" },
      { label: "7Driver, 18 Sound, Alphasonik, American Bass, B2 Audio, Blastking, BSA, Cerwin-Vega (Direct), Crunch, Eros, Orion, PRV, Sky High Car Audio, Timpano — Direct to Manufacturer", short: "Direct to Manufacturer brands", next: "warranty_speaker_direct_terminal" },
      { label: "Avatar, Audiocontrol, Clarion (Marine), Deaf Bonce, Focal, JL Audio (C6/C7 & Marine), Morel, Nakamichi, PowerBass, All Other Brands — Ship Back to Store", short: "Ship to Store brands", next: "warranty_speaker_shipback_terminal" },
      { label: "Alpine, Boss, Cerwin-Vega (Automob), Clarion (Car), CT Sounds, DB Drive, DS18 (Speakers), Hertz, Infinity, JBL, JL Audio (C1/C2/C3), JVC/Kenwood, Kicker (Gemsen), Memphis, MTX, Pioneer, Rockford, Skar, Sony, Sundown — IFD Eligible", short: "IFD eligible brands", next: "warranty_speaker_price" }
    ]
  },

  warranty_speaker_ds18_terminal: {
    id: "warranty_speaker_ds18_terminal",
    type: "terminal",
    section: "Warranty — DS18 Tweeters",
    terminalType: "decline",
    title: "DS18 Tweeters — Not Covered Under Warranty",
    body: "DS18 tweeters are NOT covered under warranty.\nCustomer may purchase a replacement diaphragm as a potential solution, or contact DS18 directly.\n\nDS18 Warranty & Support: https://ds18.com/pages/warranty",
    emailTemplate: "Hello,\n\nThank you for reaching out to us. We're sorry to hear you're experiencing issues with your tweeter. Unfortunately, DS18 tweeters are not covered under warranty; however, you do have the option of purchasing a replacement diaphragm, which may help resolve the issue.\nYou're also welcome to contact DS18 directly for further details or assistance.\nDS18 Warranty & Support: https://ds18.com/pages/warranty\n\nThank you,"
  },

  warranty_speaker_direct_terminal: {
    id: "warranty_speaker_direct_terminal",
    type: "terminal",
    section: "Warranty — Speaker",
    terminalType: "direct",
    title: "Direct to Manufacturer — Speaker/Tweeter",
    body: "Customer contacts manufacturer directly.\n\nContacts:\n• 7Driver: https://www.taramps.com.br/en/rede-de-assistencias-tecnicas/\n• 18 Sound: https://eighteensound.it/en/resources/warranty/\n• Alphasonik: https://alphasonik.com/pages/warranty\n• American Bass: https://www.americanbassusa.com/pages/contact\n• B2 Audio: https://www.b2audio.com/warranty/\n• Blastking: https://blastkingusa.com/en-ca/pages/return-warranty-policy\n• Cerwin-Vega Direct: https://cerwinvega.com/pages/contact\n• Crunch: https://crunchcaraudio.com/contact/\n• Orion: https://orioncaraudio.com/pages/contact-us-draft\n• PRV: https://prvaudio.com/warranty-center/\n• Sky High Car Audio: https://skyhighcaraudio.com/contact-us/\n• Timpano: https://timpanoaudio.com/warranty-center/",
    emailTemplate: "Hello,\n\nThank you for clarifying and confirming. For warranty-related concerns, this brand handles claims directly. To initiate the warranty process, you will need to contact the manufacturer for further assistance. You can find their contact information and submit your inquiry through their official website. If you have any questions or need further support during this process, please don't hesitate to reach out.\n\nThank you,"
  },

  warranty_speaker_shipback_terminal: {
    id: "warranty_speaker_shipback_terminal",
    type: "terminal",
    section: "Warranty — Speaker",
    terminalType: "approve",
    title: "Ship Back to Store — Speaker/Tweeter",
    body: "One-year warranty. Customer ships unit with all original accessories. Customer responsible for return shipping.\n\nIf confirmed defective:\n• We cover return shipping within Canada (ground)\n• Replacement issued if in stock\n• Replacement issued only ONCE\n\nIf sold out / discontinued → exchange or store credit (no refunds)\n\n⚠️ Audiocontrol and Morel: Initiate RMA with Gemsen first — they may authorize in-field destroy. Must be approved by Gemsen first!\n\n⚠️ If no defect found → claim denied. Customer responsible for return shipping.\n\n⚠️ Replacement Policy: If a product is deemed defective, a replacement will only be issued once. If the customer believes the replacement unit is also defective, they will need to contact the manufacturer for further assistance.",
    emailTemplate: "Hello,\n\nThank you for reaching out to us. If you believe the speaker may be defective, you have two options: you can either ship it back to our store location or drop it off in stores for evaluation. Once received, our team will thoroughly inspect the unit. If we are able to replicate the issue and confirm the defect, we will be happy to provide a replacement.\n\nKindly ensure the item is returned in the same condition as received, including the original manufacturer packaging and all accessories. Please do not place labels directly on the manufacturer's box, as the barcodes are required for processing. Instead, please place the manufacturer's box inside a separate shipping box and use protective material to prevent any damage in transit.\n\nWhen returning the item, we recommend using a trackable carrier such as Purolator or UPS. Once shipped, please provide the tracking number so our team can process the return upon receipt.\n\nPlease note that if no fault is found, return shipping costs will not be covered. All serial numbers are verified on returns, and if an item is found to be tampered with or does not match our records, the claim may be refused.\n\nThe warranty evaluation process may take up to seven business days from the date of arrival.\n\n**Ship to Address:**\nATTN: Singh Electronics Warranty **RMA # (INSERT ORDER NUMBER)**\n7003 Steeles Avenue West, Unit #15\nToronto, Ontario M9W 0A2\n\nThank you,"
  },

  warranty_speaker_price: {
    id: "warranty_speaker_price",
    type: "question",
    section: "Warranty — Speaker IFD",
    question: "What is the retail price of the speaker/tweeter (before taxes)?",
    helpText: "",
    choices: [
      { label: "$300 and under", short: "$300 and under", next: "warranty_speaker_ifd_terminal" },
      { label: "Over $300", short: "Over $300", next: "warranty_speaker_over300_terminal" }
    ]
  },

  warranty_speaker_ifd_terminal: {
    id: "warranty_speaker_ifd_terminal",
    type: "terminal",
    section: "Warranty — Speaker IFD",
    terminalType: "approve",
    title: "In-Field Destroy (IFD) Authorized — Speaker/Tweeter ≤$300",
    body: "Instructions for customer:\n1. Render speaker/tweeter permanently unusable by cutting the surround and damaging the driver\n2. Ensure serial number is clearly visible in photos\n3. Send photos for our approval\n\nOnce photos approved → issue replacement unit (core product only, no accessories).\n\n⚠️ Add case to the RMA sheet and notify appropriate person.",
    emailTemplate: "Hello,\n\nThank you for your patience as we reviewed your case. Based on the details provided, we have approved an In-Field Destruct (IFD) for your defective speakers. To proceed, you will need to render the speakers permanently unusable by cutting the surround and damaging the driver. Please also ensure the serial number is clearly visible in the images, if applicable.\n\nOnce we receive and approve the images showing the completed IFD process, we will proceed with issuing a replacement unit.\n\nThank you,",
    images: [
      { src: "/ifd-example-speakers.png", caption: "✅ Acceptable IFD — surround cut, driver damaged on both speakers" },
    ],
  },

  warranty_speaker_over300_terminal: {
    id: "warranty_speaker_over300_terminal",
    type: "terminal",
    section: "Warranty — Speaker IFD Over $300",
    terminalType: "escalate",
    title: "Escalate to Management — Speaker/Tweeter Over $300",
    body: "Speaker/tweeter retails for over $300 before taxes.\nConsult with management before approving an in-field destroy.\n\nManagement will:\n• Review case to confirm it's a general defect\n• Ensure sufficient customer information\n• Initiate RMA process with vendor/distributor\n• Authorize if approved"
  },

  // ── AMPLIFIER ────────────────────────────
  warranty_amp_confirm: {
    id: "warranty_amp_confirm",
    type: "info",
    section: "Warranty — Amplifier",
    infoType: "info",
    title: "Step Required Before Proceeding",
    body: "Ask for a detailed description of the issue:\n• Is the amplifier in protection mode?\n• Does it power on?\n• Is there distortion, clipping, or other symptoms?\n• Serial number (clear photo)\n\nNOT covered: Improper installation, accidental damage, misuse, abuse, improper wiring, operation outside listed specifications, or modifications/repairs by unauthorized parties.\n\nTroubleshooting tips to provide first:\n• Protection Mode: Check vehicle wiring. Try disconnecting ALL wires (remote, RCA, speaker, ground, power) and leave disconnected for several hours. Then reinstall.\n• Distortion/Clipping: Check wiring, re-tune and adjust gains.",
    emailTemplate: "Hello,\n\nThank you for reaching out to us. We're sorry to hear you're experiencing issues with your amplifier. To better assist you, please provide a description of your current setup, including the subwoofers and wiring used. Additionally, if you can send us a clear photo of the amplifier's serial number, we'll be able to look into this further for you.\n\nIf the amplifier is going into protect mode as soon as it's powered on, we recommend first checking the vehicle's wiring to ensure everything is properly grounded and there are no shorts or loose connections. Before proceeding with a warranty claim, we suggest disconnecting all wiring from the amplifier—this includes the power, ground, remote, RCA, and speaker wires—and leaving it disconnected for several hours. Once this is done, you can try reinstalling the amplifier to see if it resets out of protection mode.\n\nThank you,",
    next: "warranty_amp_brand"
  },

  warranty_amp_brand: {
    id: "warranty_amp_brand",
    type: "question",
    section: "Warranty — Amplifier Brand",
    question: "What brand amplifier is it?",
    helpText: "",
    choices: [
      { label: "American Bass, B2 Audio, Cerwin-Vega (Direct), Crescendo Audio, Orion, VFL Audio — Direct to Manufacturer", short: "Direct to Manufacturer brands", next: "warranty_amp_direct_terminal" },
      { label: "PRV Audio, Stetsom, Taramps, Timpano — Repair/Replacement with Manufacturer", short: "Repair/Replace with Manufacturer", next: "warranty_amp_repair_terminal" },
      { label: "Infinity / JBL", short: "Infinity/JBL", next: "warranty_amp_infinityjbl_30" },
      { label: "Kenwood", short: "Kenwood", next: "warranty_amp_kenwood_30" },
      { label: "Pioneer", short: "Pioneer", next: "warranty_amp_pioneer_30" },
      { label: "Audiocontrol, Boss Audio, Clarion, JL Audio, Kicker, Morel, Precision Power — Repair/Replace via Gemsen", short: "Gemsen brands", next: "warranty_amp_gemsen_terminal" },
      { label: "Alpine, CT Sounds, DB Drive, DS18, Focal, Hertz, Memphis Audio, MTX Audio, Rockford, Skar, Sony, Sundown, and All Other Brands — Ship Back to Store", short: "Ship to Store brands", next: "warranty_amp_shipback_terminal" }
    ]
  },

  warranty_amp_direct_terminal: {
    id: "warranty_amp_direct_terminal",
    type: "terminal",
    section: "Warranty — Amplifier",
    terminalType: "direct",
    title: "Direct to Manufacturer — Amplifier",
    body: "Customer contacts manufacturer directly.\n\nContacts:\n• American Bass / VFL Audio: https://www.americanbassusa.com/pages/contact\n• B2 Audio: https://www.b2audio.com/contact-us/\n• Cerwin-Vega (Direct): https://cerwinvega.com/pages/contact\n• Crescendo Audio: https://www.crescendo-caraudio.com/contact\n• Orion: https://orioncaraudio.com/pages/contact-us-draft\n\n⚠️ High-Value Customer Exception: If customer has $800+ in purchases and follows up after being directed to manufacturer → consult management for exception.",
    emailTemplate: "Hello,\n\nThank you for contacting us. We're sorry to hear you're experiencing issues with your amplifier. Please note that this brand handles all warranty claims directly. To initiate the warranty process, you will need to contact the manufacturer for further assistance. You can find their contact information and submit your inquiry through their official website. If you have any questions or need further support during this process, please don't hesitate to reach out.\n\nThank you,"
  },

  warranty_amp_repair_terminal: {
    id: "warranty_amp_repair_terminal",
    type: "terminal",
    section: "Warranty — Amplifier",
    terminalType: "direct",
    title: "Repair/Replacement via Manufacturer — Amplifier",
    body: "Customer contacts manufacturer directly. Warranty covers repairs; replacement only if unrepairable. In some cases manufacturer may request we issue the replacement.\n\nForms:\n• PRV: https://prvaudio.com/warranty-center/\n• Stetsom: https://garantia.grupostetsom.com.br/\n• Taramps: https://www.taramps.com.br/en/rede-de-assistencias-tecnicas/\n• Timpano: https://timpanoaudio.com/warranty-center/",
    emailTemplate: "Hello,\n\nThank you for contacting us. We're sorry to hear you're experiencing issues with your amplifier. Please note that the amplifier is covered under a 1-year manufacturer's warranty. To begin the warranty process, you can use the link below to contact the manufacturer directly—they will handle all necessary arrangements for the repair or replacement of your amplifier.\n\nThank you,"
  },

  warranty_amp_infinityjbl_30: {
    id: "warranty_amp_infinityjbl_30",
    type: "question",
    section: "Warranty — Infinity/JBL Amplifier",
    question: "Was the Infinity/JBL amplifier purchased or delivered within the last 30 days?",
    helpText: "",
    choices: [
      { label: "Yes — Within 30 days", short: "Within 30 days", next: "warranty_amp_infinityjbl_within30_terminal" },
      { label: "No — Over 30 days ago", short: "Over 30 days", next: "warranty_amp_infinityjbl_over30_terminal" }
    ]
  },

  warranty_amp_infinityjbl_within30_terminal: {
    id: "warranty_amp_infinityjbl_within30_terminal",
    type: "terminal",
    section: "Warranty — Infinity/JBL Amplifier",
    terminalType: "approve",
    title: "Ship Back to Store — Infinity/JBL Within 30 Days",
    body: "Customer returns unit with all original accessories. Customer responsible for return shipping.\n\nIf confirmed defective:\n• We cover return shipping within Canada (ground)\n• Replacement issued if in stock\n• Replacement issued only ONCE\n\nIf sold out / discontinued → exchange or store credit (no refunds)\n\n⚠️ If no defect found → claim denied. Customer responsible for return shipping.\n\n⚠️ Replacement Policy: If a product is deemed defective, a replacement will only be issued once. If the customer believes the replacement unit is also defective, they will need to contact the manufacturer for further assistance.",
    emailTemplate: "Hello,\n\nThank you for reaching out to us. If you believe the amplifier may be defective, you have two options: you can either ship it back to our store location or drop it off in stores for evaluation. Once received, our team will thoroughly inspect the unit. If we are able to replicate the issue and confirm the defect, we will be happy to provide a replacement.\n\nKindly ensure the item is returned in the same condition as received, including the original manufacturer packaging and all accessories. Please do not place labels directly on the manufacturer's box, as the barcodes are required for processing. Instead, please place the manufacturer's box inside a separate shipping box and use protective material to prevent any damage in transit.\n\nWhen returning the item, we recommend using a trackable carrier such as Purolator or UPS. Once shipped, please provide the tracking number so our team can process the return upon receipt.\n\nPlease note that if no fault is found, return shipping costs will not be covered. All serial numbers are verified on returns, and if an item is found to be tampered with or does not match our records, the claim may be refused.\n\nThe warranty evaluation process may take up to seven business days from the date of arrival.\n\n**Ship to Address:**\nATTN: Singh Electronics Warranty **RMA # (INSERT ORDER NUMBER)**\n7003 Steeles Avenue West, Unit #15\nToronto, Ontario M9W 0A2\n\nThank you,"
  },

  warranty_amp_infinityjbl_over30_terminal: {
    id: "warranty_amp_infinityjbl_over30_terminal",
    type: "terminal",
    section: "Warranty — Infinity/JBL Amplifier",
    terminalType: "direct",
    title: "Direct to Erikson Consumer — Infinity/JBL Over 30 Days",
    body: "Customer contacts Erikson Consumer directly to complete RMA request form. Customer must provide a copy of original sales receipt.\n\nRMA Request Form: https://www.eriksonconsumer.com/rma-request-forms\n\n⚠️ High-Value Exception: Customer with $800+ in purchases follows up after being directed → consult management.",
    emailTemplate: "Hello,\n\nThank you for reaching out to us. We're sorry to hear that you're experiencing issues with your JBL amplifier. Please note that your amplifier is covered under a one-year manufacturer's warranty. To initiate the warranty process, kindly complete the RMA request form as the end user through the link provided below. This form is managed by Erikson Consumer, the authorized distributor for JBL and Infinity products in your region.\n\nOnce the form has been submitted, Erikson Consumer will coordinate the necessary arrangements for the repair or replacement of your amplifier. If you have any questions or require further assistance during this process, please don't hesitate to contact us. We're here to help every step of the way.\n\nInfinity/JBL: https://www.eriksonconsumer.com/rma-request-forms\n\nThank you,"
  },

  warranty_amp_kenwood_30: {
    id: "warranty_amp_kenwood_30",
    type: "question",
    section: "Warranty — Kenwood Amplifier",
    question: "Was the Kenwood amplifier purchased or delivered within the last 30 days?",
    helpText: "Note: Kenwood amplifiers = 1-year warranty. Kenwood Excelon amplifiers = 2-year warranty.",
    choices: [
      { label: "Yes — Within 30 days", short: "Within 30 days", next: "warranty_amp_kenwood_within30_terminal" },
      { label: "No — Over 30 days ago", short: "Over 30 days", next: "warranty_amp_kenwood_over30_terminal" }
    ]
  },

  warranty_amp_kenwood_within30_terminal: {
    id: "warranty_amp_kenwood_within30_terminal",
    type: "terminal",
    section: "Warranty — Kenwood Amplifier",
    terminalType: "approve",
    title: "Ship Back to Store — Kenwood Amplifier Within 30 Days",
    body: "Kenwood: 1-year warranty. Kenwood Excelon: 2-year warranty.\n\nCustomer returns unit with all original accessories. Customer responsible for return shipping.\n\nIf confirmed defective:\n• We cover return shipping within Canada (ground)\n• Replacement issued if in stock\n• Replacement issued only ONCE\n\nIf sold out / discontinued → exchange or store credit (no refunds)\n\n⚠️ If no defect found → claim denied. Customer responsible for return shipping.\n\n⚠️ Replacement Policy: If a product is deemed defective, a replacement will only be issued once. If the customer believes the replacement unit is also defective, they will need to contact the manufacturer for further assistance.",
    emailTemplate: "Hello,\n\nThank you for reaching out to us. If you believe the amplifier may be defective, you have two options: you can either ship it back to our store location or drop it off in stores for evaluation. Once received, our team will thoroughly inspect the unit. If we are able to replicate the issue and confirm the defect, we will be happy to provide a replacement.\n\nKindly ensure the item is returned in the same condition as received, including the original manufacturer packaging and all accessories. Please do not place labels directly on the manufacturer's box, as the barcodes are required for processing. Instead, please place the manufacturer's box inside a separate shipping box and use protective material to prevent any damage in transit.\n\nWhen returning the item, we recommend using a trackable carrier such as Purolator or UPS. Once shipped, please provide the tracking number so our team can process the return upon receipt.\n\nPlease note that if no fault is found, return shipping costs will not be covered. All serial numbers are verified on returns, and if an item is found to be tampered with or does not match our records, the claim may be refused.\n\nThe warranty evaluation process may take up to seven business days from the date of arrival.\n\n**Ship to Address:**\nATTN: Singh Electronics Warranty **RMA # (INSERT ORDER NUMBER)**\n7003 Steeles Avenue West, Unit #15\nToronto, Ontario M9W 0A2\n\nThank you,"
  },

  warranty_amp_kenwood_over30_terminal: {
    id: "warranty_amp_kenwood_over30_terminal",
    type: "terminal",
    section: "Warranty — Kenwood Amplifier",
    terminalType: "direct",
    title: "Direct to Authorized Service Centre — Kenwood Amplifier",
    body: "After 30 days → customer contacts authorized repair center. If unrepairable, replacement may be issued.\nCustomer must provide sales receipt.\n\nFind nearest service center: https://locator.kenwood.com/ca/\n\nNearest known centre:\nDowntown Audio Video Electronics\n1585 Britannia Rd E Unit F7, Mississauga, ON L4W 2M4\nPhone: (905) 564-3682\n\n⚠️ High-Value Exception: Customer with $800+ in purchases follows up after being directed → consult management.",
    emailTemplate: "Hello,\n\nThank you for contacting us. We are sorry to hear that you are experiencing issues with your Kenwood amplifier. Please be informed that the Kenwood amplifier is covered under a 1-year manufacturer's warranty. To initiate the warranty process, please use the link below to find the nearest authorized service center.\n\nKenwood's Official website: https://locator.kenwood.com/ca/\n\nService Centre: Downtown Audio Video Electronics\nAddress: 1585 Britannia Rd E Unit F7, Mississauga, ON L4W 2M4\nPhone: (905) 564-3682\n\nThank you,"
  },

  warranty_amp_pioneer_30: {
    id: "warranty_amp_pioneer_30",
    type: "question",
    section: "Warranty — Pioneer Amplifier",
    question: "Was the Pioneer amplifier purchased or delivered within the last 30 days?",
    helpText: "Pioneer amplifiers come with a one-year manufacturer's warranty.",
    choices: [
      { label: "Yes — Within 30 days", short: "Within 30 days", next: "warranty_amp_pioneer_within30_terminal" },
      { label: "No — Over 30 days ago", short: "Over 30 days", next: "warranty_amp_pioneer_over30_terminal" }
    ]
  },

  warranty_amp_pioneer_within30_terminal: {
    id: "warranty_amp_pioneer_within30_terminal",
    type: "terminal",
    section: "Warranty — Pioneer Amplifier",
    terminalType: "approve",
    title: "Ship Back to Store — Pioneer Amplifier Within 30 Days",
    body: "Customer returns unit with all original accessories. Customer responsible for return shipping.\n\nIf confirmed defective:\n• We cover return shipping within Canada (ground)\n• Replacement issued if in stock\n• Replacement issued only ONCE\n\nIf sold out / discontinued → exchange or store credit (no refunds)\n\n⚠️ If no defect found → claim denied. Customer responsible for return shipping.\n\n⚠️ Replacement Policy: If a product is deemed defective, a replacement will only be issued once. If the customer believes the replacement unit is also defective, they will need to contact the manufacturer for further assistance.",
    emailTemplate: "Hello,\n\nThank you for reaching out to us. If you believe the amplifier may be defective, you have two options: you can either ship it back to our store location or drop it off in stores for evaluation. Once received, our team will thoroughly inspect the unit. If we are able to replicate the issue and confirm the defect, we will be happy to provide a replacement.\n\nKindly ensure the item is returned in the same condition as received, including the original manufacturer packaging and all accessories. Please do not place labels directly on the manufacturer's box, as the barcodes are required for processing. Instead, please place the manufacturer's box inside a separate shipping box and use protective material to prevent any damage in transit.\n\nWhen returning the item, we recommend using a trackable carrier such as Purolator or UPS. Once shipped, please provide the tracking number so our team can process the return upon receipt.\n\nPlease note that if no fault is found, return shipping costs will not be covered. All serial numbers are verified on returns, and if an item is found to be tampered with or does not match our records, the claim may be refused.\n\nThe warranty evaluation process may take up to seven business days from the date of arrival.\n\n**Ship to Address:**\nATTN: Singh Electronics Warranty **RMA # (INSERT ORDER NUMBER)**\n7003 Steeles Avenue West, Unit #15\nToronto, Ontario M9W 0A2\n\nThank you,"
  },

  warranty_amp_pioneer_over30_terminal: {
    id: "warranty_amp_pioneer_over30_terminal",
    type: "terminal",
    section: "Warranty — Pioneer Amplifier",
    terminalType: "direct",
    title: "Direct to Northstar Electronics — Pioneer Amplifier",
    body: "After 30 days → customer contacts Northstar Electronics (Pioneer's authorized repair center).\n\nAddress: 75 Cathedral High St, Markham, ON L6C 0P1\nEmail: info@northstarelectronics.ca\nPhone: (647) 880-6888\nHours: Monday to Friday, 9am–6pm\n\nCustomer must provide sales receipt.\n\n⚠️ High-Value Exception: Customer with $800+ in purchases follows up → consult management.",
    emailTemplate: "Hello,\n\nThank you for contacting us. We are sorry to hear that you are experiencing issues with your Pioneer amplifier. Please be informed that the Pioneer amplifier is covered under a 1-year manufacturer's warranty. Please contact the designated warranty service center below:\n\nAddress: 75 Cathedral High St, Markham, ON L6C 0P1\nEmail: info@northstarelectronics.ca\nPhone: (647) 880-6888\nMonday to Friday: 9am–6pm\n\nThank you,"
  },

  warranty_amp_gemsen_terminal: {
    id: "warranty_amp_gemsen_terminal",
    type: "terminal",
    section: "Warranty — Amplifier (Gemsen)",
    terminalType: "approve",
    title: "Ship Back to Store — Gemsen Brand Amplifier",
    body: "Customer ships unit back to store with all original accessories. If confirmed defective → sent to distributor for repair. If unrepairable → replacement issued.\nProcess: 1–2 weeks. We cover return shipping (Canada, ground) if defective.\n\n⚠️ If no defect found → claim denied. Customer responsible for return shipping.\n\n⚠️ Replacement Policy: If a product is deemed defective, a replacement will only be issued once. If the customer believes the replacement unit is also defective, they will need to contact the manufacturer for further assistance.",
    emailTemplate: "Hello,\n\nThank you for reaching out to us. If you believe the amplifier may be defective, you have two options: you can either ship it back to our store location or drop it off in stores for evaluation. Once received, our team will thoroughly inspect the unit. If we are able to replicate the issue and confirm the defect, we will be happy to provide a replacement.\n\nKindly ensure the item is returned in the same condition as received, including the original manufacturer packaging and all accessories. Please do not place labels directly on the manufacturer's box, as the barcodes are required for processing. Instead, please place the manufacturer's box inside a separate shipping box and use protective material to prevent any damage in transit.\n\nWhen returning the item, we recommend using a trackable carrier such as Purolator or UPS. Once shipped, please provide the tracking number so our team can process the return upon receipt.\n\nPlease note that if no fault is found, return shipping costs will not be covered. All serial numbers are verified on returns, and if an item is found to be tampered with or does not match our records, the claim may be refused.\n\nThe warranty evaluation process may take up to seven business days from the date of arrival.\n\n**Ship to Address:**\nATTN: Singh Electronics Warranty **RMA # (INSERT ORDER NUMBER)**\n7003 Steeles Avenue West, Unit #15\nToronto, Ontario M9W 0A2\n\nThank you,"
  },

  warranty_amp_shipback_terminal: {
    id: "warranty_amp_shipback_terminal",
    type: "terminal",
    section: "Warranty — Amplifier",
    terminalType: "approve",
    title: "Ship Back to Store — Amplifier",
    body: "Customer ships unit back with all original accessories. Customer responsible for return shipping.\n\nIf confirmed defective:\n• We cover return shipping within Canada (ground)\n• Replacement issued if in stock\n• Replacement issued only ONCE\n\nIf sold out / discontinued → exchange or store credit (no refunds)\n\n⚠️ If no defect found → claim denied. Customer responsible for return shipping.\n\n⚠️ Replacement Policy: If a product is deemed defective, a replacement will only be issued once. If the customer believes the replacement unit is also defective, they will need to contact the manufacturer for further assistance.",
    emailTemplate: "Hello,\n\nThank you for reaching out to us. If you believe the amplifier may be defective, you have two options: you can either ship it back to our store location or drop it off in stores for evaluation. Once received, our team will thoroughly inspect the unit. If we are able to replicate the issue and confirm the defect, we will be happy to provide a replacement.\n\nKindly ensure the item is returned in the same condition as received, including the original manufacturer packaging and all accessories. Please do not place labels directly on the manufacturer's box, as the barcodes are required for processing. Instead, please place the manufacturer's box inside a separate shipping box and use protective material to prevent any damage in transit.\n\nWhen returning the item, we recommend using a trackable carrier such as Purolator or UPS. Once shipped, please provide the tracking number so our team can process the return upon receipt.\n\nPlease note that if no fault is found, return shipping costs will not be covered. All serial numbers are verified on returns, and if an item is found to be tampered with or does not match our records, the claim may be refused.\n\nThe warranty evaluation process may take up to seven business days from the date of arrival.\n\n**Ship to Address:**\nATTN: Singh Electronics Warranty **RMA # (INSERT ORDER NUMBER)**\n7003 Steeles Avenue West, Unit #15\nToronto, Ontario M9W 0A2\n\nThank you,"
  },

  // ── SIGNAL PROCESSOR ─────────────────────
  warranty_sp_confirm: {
    id: "warranty_sp_confirm",
    type: "info",
    section: "Warranty — Signal Processor",
    infoType: "info",
    title: "Step Required Before Proceeding",
    body: "Ask for detailed description:\n• Does it power on?\n• Is there distortion, crackling, clipping, no output, or other issues?\n• Check that power, ground, all input/output cables (RCA, speaker wires) are properly connected.",
    emailTemplate: "Hello,\n\nWe're sorry to hear you're having issues with your signal processor. In order to assist you, we kindly ask that you provide a detailed description of the problem you're experiencing. Please let us know whether the unit powers on, or if you're experiencing distortion, crackling, or clipping, or if there is no output or any other areas of concern.\n\nAdditionally, we recommend double-checking that your power and ground connections are secure and that all input and output cables are properly and securely connected.\n\nThank you,",
    next: "warranty_sp_brand"
  },

  warranty_sp_brand: {
    id: "warranty_sp_brand",
    type: "question",
    section: "Warranty — Signal Processor Brand",
    question: "What brand signal processor is it?",
    helpText: "",
    choices: [
      { label: "American Bass, Autotek, Cerwin-Vega (Direct), Hifonics, PRV, Stetsom, Taramps, Timpano — Direct to Manufacturer", short: "Direct to Manufacturer", next: "warranty_sp_direct_terminal" },
      { label: "All Other Brands (Alpine, Audiocontrol, DS18, JL Audio, Rockford, Skar, etc.) — Ship Back to Store", short: "Ship to Store", next: "warranty_sp_shipback_terminal" }
    ]
  },

  warranty_sp_direct_terminal: {
    id: "warranty_sp_direct_terminal",
    type: "terminal",
    section: "Warranty — Signal Processor",
    terminalType: "direct",
    title: "Direct to Manufacturer — Signal Processor",
    body: "Customer contacts manufacturer directly.\n\nContacts:\n• American Bass: https://www.americanbassusa.com/pages/contact\n• Autotek: https://autotekcaraudio.com/contact/\n• Cerwin-Vega Direct: https://cerwinvega.com/pages/contact\n• Hifonics: https://hifonics.com/contact/\n• PRV: https://prvaudio.com/warranty-center/\n• Stetsom: https://garantia.grupostetsom.com.br/\n• Taramps: https://www.taramps.com.br/en/rede-de-assistencias-tecnicas/\n• Timpano: https://timpanoaudio.com/warranty-center/",
    emailTemplate: "Hello,\n\nThank you for contacting us. We're sorry to hear you're experiencing issues with your signal processor. Please note that this brand handles all warranty claims directly. To initiate the warranty process, you will need to contact the manufacturer for further assistance.\n\nThank you,"
  },

  warranty_sp_shipback_terminal: {
    id: "warranty_sp_shipback_terminal",
    type: "terminal",
    section: "Warranty — Signal Processor",
    terminalType: "approve",
    title: "Ship Back to Store — Signal Processor",
    body: "One-year warranty. Customer ships unit with all original accessories. Customer responsible for return shipping.\n\nIf confirmed defective:\n• We cover return shipping within Canada (ground)\n• Replacement issued if in stock\n• Replacement issued only ONCE\n\nIf sold out / discontinued → exchange or store credit (no refunds)\n\n⚠️ If no defect found → claim denied. Customer responsible for return shipping.\n\n⚠️ Replacement Policy: If a product is deemed defective, a replacement will only be issued once. If the customer believes the replacement unit is also defective, they will need to contact the manufacturer for further assistance.",
    emailTemplate: "Hello,\n\nThank you for reaching out to us. If you believe the signal processor may be defective, you have two options: you can either ship it back to our store location or drop it off in stores for evaluation. Once received, our team will thoroughly inspect the unit. If we are able to replicate the issue and confirm the defect, we will be happy to provide a replacement.\n\nKindly ensure the item is returned in the same condition as received, including the original manufacturer packaging and all accessories. Please do not place labels directly on the manufacturer's box, as the barcodes are required for processing. Instead, please place the manufacturer's box inside a separate shipping box and use protective material to prevent any damage in transit.\n\nWhen returning the item, we recommend using a trackable carrier such as Purolator or UPS. Once shipped, please provide the tracking number so our team can process the return upon receipt.\n\nPlease note that if no fault is found, return shipping costs will not be covered. All serial numbers are verified on returns, and if an item is found to be tampered with or does not match our records, the claim may be refused.\n\nThe warranty evaluation process may take up to seven business days from the date of arrival.\n\n**Ship to Address:**\nATTN: Singh Electronics Warranty **RMA # (INSERT ORDER NUMBER)**\n7003 Steeles Avenue West, Unit #15\nToronto, Ontario M9W 0A2\n\nThank you,"
  },

  // ── BATTERY ──────────────────────────────
  warranty_battery_confirm: {
    id: "warranty_battery_confirm",
    type: "info",
    section: "Warranty — Battery",
    infoType: "info",
    title: "Step Required Before Proceeding",
    body: "Ask for detailed description:\n• Is the voltage on the battery dropping?\n• Is the battery not holding a charge?\n• Is there any physical damage to the battery?",
    emailTemplate: "Hello,\n\nWe're sorry to hear you're having issues with your battery. In order to assist you, we kindly ask that you provide a detailed description of the issue you are experiencing. Please let us know if the voltage on the battery is dropping, if the battery is not holding a charge, or if there is any visible or physical damage to the battery.\n\nThank you,",
    next: "warranty_battery_brand"
  },

  warranty_battery_brand: {
    id: "warranty_battery_brand",
    type: "question",
    section: "Warranty — Battery Brand",
    question: "What brand battery is it?",
    helpText: "",
    choices: [
      { label: "American Bass, Limitless Lithium, Underground Power — Direct to Manufacturer", short: "Direct to Manufacturer", next: "warranty_battery_direct_terminal" },
      { label: "DS18, Skar Audio, XS Power — Ship Back to Store", short: "Ship to Store", next: "warranty_battery_shipback_terminal" }
    ]
  },

  warranty_battery_direct_terminal: {
    id: "warranty_battery_direct_terminal",
    type: "terminal",
    section: "Warranty — Battery",
    terminalType: "direct",
    title: "Direct to Manufacturer — Battery",
    body: "Customer contacts manufacturer directly.\n\nNote for Limitless Lithium: Manufacturer may require battery to be shipped to their facility in the US for inspection. If warranty claim approved and we have an upcoming shipment, replacement may be included with our shipment and forwarded to customer.\n\nContacts:\n• American Bass: https://www.americanbassusa.com/pages/contact\n• Limitless Lithium: https://limitlesslithium.com/warranty-request/",
    emailTemplate: "Hello,\n\nThank you for contacting us. We're sorry to hear you're experiencing issues with your battery. Please note that this brand handles all warranty claims directly. To initiate the warranty process, you will need to contact the manufacturer for further assistance.\n\nThank you,"
  },

  warranty_battery_shipback_terminal: {
    id: "warranty_battery_shipback_terminal",
    type: "terminal",
    section: "Warranty — Battery",
    terminalType: "approve",
    title: "Ship Back to Store — Battery",
    body: "One-year warranty. Customer ships unit with all original accessories. Customer responsible for return shipping.\n\nIf confirmed defective:\n• We cover return shipping within Canada (ground)\n• Replacement issued if in stock\n• Replacement issued only ONCE\n\nIf sold out / discontinued → exchange or store credit (no refunds)\n\n⚠️ If no defect found → claim denied. Customer responsible for return shipping.\n\n⚠️ Replacement Policy: If a product is deemed defective, a replacement will only be issued once. If the customer believes the replacement unit is also defective, they will need to contact the manufacturer for further assistance.",
    emailTemplate: "Hello,\n\nThank you for reaching out to us. If you believe the battery may be defective, you have two options: you can either ship it back to our store location or drop it off in stores for evaluation. Once received, our team will thoroughly inspect the unit. If we are able to replicate the issue and confirm the defect, we will be happy to provide a replacement.\n\nKindly ensure the item is returned in the same condition as received, including the original manufacturer packaging and all accessories. Please do not place labels directly on the manufacturer's box, as the barcodes are required for processing. Instead, please place the manufacturer's box inside a separate shipping box and use protective material to prevent any damage in transit.\n\nWhen returning the item, we recommend using a trackable carrier such as Purolator or UPS. Once shipped, please provide the tracking number so our team can process the return upon receipt.\n\nPlease note that if no fault is found, return shipping costs will not be covered. All serial numbers are verified on returns, and if an item is found to be tampered with or does not match our records, the claim may be refused.\n\nThe warranty evaluation process may take up to seven business days from the date of arrival.\n\n**Ship to Address:**\nATTN: Singh Electronics Warranty **RMA # (INSERT ORDER NUMBER)**\n7003 Steeles Avenue West, Unit #15\nToronto, Ontario M9W 0A2\n\nThank you,"
  },

  // ── REMOTE STARTER / INTERFACES ──────────
  warranty_remote_confirm: {
    id: "warranty_remote_confirm",
    type: "info",
    section: "Warranty — Remote Starter/Interface",
    infoType: "info",
    title: "Step Required Before Proceeding",
    body: "Ask for detailed description:\n• Is the module not communicating with the vehicle?\n• Are there programming issues?\n• Serial number of the product\n• Year, make, and model of the vehicle",
    emailTemplate: "Hello,\n\nWe're sorry to hear you're having issues with your interface. To assist you further, we kindly ask that you provide a detailed description of the issue. Please let us know if the module is failing to communicate with the vehicle, if there are programming-related issues, or any other specific concerns.\nAdditionally, please confirm the serial number of the product, as well as the year, make, and model of the vehicle.\n\nThank you,",
    next: "warranty_remote_brand"
  },

  warranty_remote_brand: {
    id: "warranty_remote_brand",
    type: "question",
    section: "Warranty — Remote Starter/Interface Brand",
    question: "What brand remote starter or interface is it?",
    helpText: "Tip: Before proceeding with an RMA, if the issue can be resolved through basic troubleshooting, assist the customer or direct them to the brand's technical support.",
    choices: [
      { label: "Compustar — Tech Support: 1-888-820-3690 (M–F 8am–5pm PST)", short: "Compustar", next: "warranty_remote_shipback_terminal" },
      { label: "Fortin — Tech Support: 1-877-336-7797", short: "Fortin", next: "warranty_remote_shipback_terminal" },
      { label: "iDatastart — Tech Support: 1-866-427-2999 ext. 2", short: "iDatastart", next: "warranty_remote_shipback_terminal" },
      { label: "Viper / Directed — Tech Support: 1-800-361-7271", short: "Viper/Directed", next: "warranty_remote_shipback_terminal" },
      { label: "Axxess — Tech Support: techsupport@metra-autosound.com / 386-257-1187", short: "Axxess", next: "warranty_remote_shipback_terminal" },
      { label: "iDatalink — Tech Support: https://www.idatalinkmaestro.com/en/support/contact-us / 1-866-427-2999", short: "iDatalink", next: "warranty_remote_idatalink_terminal" },
      { label: "Metra — Tech Support: techsupport@metra-autosound.com / 386-257-1187", short: "Metra", next: "warranty_remote_metra_terminal" },
      { label: "PAC Audio — Tech Support: support@pac-audio.com / 727-592-5991 (M–F 9am–8pm EST)", short: "PAC Audio", next: "warranty_remote_shipback_terminal" }
    ]
  },

  warranty_remote_idatalink_terminal: {
    id: "warranty_remote_idatalink_terminal",
    type: "terminal",
    section: "Warranty — iDatalink Interface",
    terminalType: "direct",
    title: "Direct to iDatalink Tech Support",
    body: "Recommend customer contact iDatalink Maestro tech support to troubleshoot the issue and determine if it is a defect in the dash kit or a wiring-related concern.\n\nTech Support: https://www.idatalinkmaestro.com/en/support/contact-us / 1-866-427-2999\n\nIf iDatalink confirms defect → proceed with warranty claim. Customer may return unit to store for replacement.",
    emailTemplate: "Hello,\n\nThank you for confirming the issue and providing your vehicle details. Based on the information you've provided, we can confirm that the unit is compatible with your vehicle.\n\nFor further assistance, we recommend contacting iDatalink Maestro's technical support team at 1-866-427-2999, extension 2. They will be able to help determine whether the issue is due to a defect in the dash kit or a wiring-related concern.\n\nIf iDatalink confirms that the dash kit is defective, please let us know. We'll be happy to proceed with a warranty claim. You may return the defective unit to our store, and if the issue is verified as a manufacturer defect, we will issue a replacement.\n\nThank you,"
  },

  warranty_remote_metra_terminal: {
    id: "warranty_remote_metra_terminal",
    type: "terminal",
    section: "Warranty — Metra Interface",
    terminalType: "direct",
    title: "Direct to Metra Tech Support",
    body: "Recommend customer contact Metra's technical support team for step-by-step installation support and to determine if the issue is a defect or a wiring/setup concern.\n\nTech Support: techsupport@metra-autosound.com / 1-386-257-1187",
    emailTemplate: "Hello,\n\nThank you for confirming the issue and providing your vehicle details. Based on the information you've shared, we can confirm that the unit is compatible with your vehicle.\n\nHowever, with certain vehicle models such as the Ford Transit, it is common for the factory harness not to supply accessory power through the standard wiring. In these cases, the red accessory wire from the aftermarket stereo may need to be connected to an alternative accessory power source, such as one found in the vehicle's fuse box.\n\nFor further guidance specific to your vehicle, we recommend reaching out to Metra's technical support team at 1-386-257-1187. They can assist you with step-by-step installation support tailored to your setup.\n\nThank you,"
  },

  warranty_remote_shipback_terminal: {
    id: "warranty_remote_shipback_terminal",
    type: "terminal",
    section: "Warranty — Remote Starter/Interface",
    terminalType: "approve",
    title: "Ship Back to Store — Remote Starter/Interface",
    body: "Customer ships unit with all original accessories. Customer responsible for return shipping.\n\nIf confirmed defective:\n• We cover return shipping within Canada (ground)\n• Replacement issued if in stock\n• Replacement issued only ONCE\n\nIf sold out / discontinued → exchange or store credit (no refunds)\n\n⚠️ If no defect found → claim denied. Customer responsible for return shipping.\n\n⚠️ Replacement Policy: If a product is deemed defective, a replacement will only be issued once. If the customer believes the replacement unit is also defective, they will need to contact the manufacturer for further assistance.",
    emailTemplate: "Hello,\n\nIf you believe the interface may be defective, you have two options: you may either ship the item back to our store location or drop it off in person for testing. If our team confirms that the interface is indeed defective, we will gladly issue a replacement.\nPlease note that if no defect is found, return shipping costs will not be covered. Processing the warranty claim may take up to seven to ten business days upon arrival.\n\nShip to Address:\nATTN: Singh Electronics Warranty **RMA # (INSERT ORDER NUMBER)**\n7003 Steeles Avenue West, Unit #15\nToronto, Ontario M9W 0A2\n\nThank you,"
  },

  // ── OTHER PRODUCTS ────────────────────────
  warranty_other_confirm: {
    id: "warranty_other_confirm",
    type: "info",
    section: "Warranty — Other Products",
    infoType: "info",
    title: "Step Required Before Proceeding",
    body: "Ask for a detailed description of the issue. A general statement that it is defective or not working is not sufficient. Also confirm the serial number of the product.",
    emailTemplate: "Hello,\n\nWe're sorry to hear you're having issues with your product. To assist you further, we kindly ask that you provide a detailed description of the issue you're experiencing. A general statement such as \"defective\" or \"not working\" does not provide enough information for us to properly assess the situation. Additionally, please confirm the serial number of the product.\n\nThank you,",
    next: "warranty_other_troubleshoot"
  },

  warranty_other_troubleshoot: {
    id: "warranty_other_troubleshoot",
    type: "question",
    section: "Warranty — Other Products",
    question: "Can the issue be troubleshot, or does it sound like a manufacturing defect?",
    helpText: "For large portable speakers (JBL PartyBox, etc.) or soundbar products by Erikson → have customer contact Erikson Consumer at info@eriksonconsumer.com first.\nFor inMusic brands (Akai, Alesis, Alto, Denon DJ, Marantz, M-Audio, Numark, Rane DJ, etc.) → customer contacts customerexperienceteam@inmusicbrands.com",
    choices: [
      { label: "Yes — Can likely be resolved with troubleshooting assistance", short: "Troubleshoot first", next: "warranty_other_troubleshoot_info" },
      { label: "No — Appears to be a manufacturing defect", short: "Likely a defect", next: "warranty_other_shipback_terminal" },
      { label: "Product is from Erikson or Inmusic — Direct to manufacturer", short: "Erikson/Inmusic", next: "warranty_other_erikson_terminal" }
    ]
  },

  warranty_other_troubleshoot_info: {
    id: "warranty_other_troubleshoot_info",
    type: "terminal",
    section: "Warranty — Other Products",
    terminalType: "info-end",
    title: "Assist with Troubleshooting",
    body: "Assist the customer or direct them to the brand's/manufacturer's technical support team.\n\nFor JBL PartyBox or Erikson products:\nContact Erikson Consumer at info@eriksonconsumer.com or 1-877-457-2592 (M–F 8:30am–5:30pm ET)\n\nFor inMusic brands:\nEmail: customerexperienceteam@inmusicbrands.com\n\nIf troubleshooting fails and issue confirmed defective → ship back to store.",
    emailTemplate: "Hello,\n\nThank you for reaching out, and we're sorry to hear you're experiencing issues with your product. As a first step, we recommend contacting the brand's technical support team. Their team will assist you with troubleshooting and can determine whether the issue is due to a defect.\nIf it is confirmed to be defective, they will advise us on how to proceed under warranty. Please let us know if you have any questions or need assistance during the process.\n\nThank you,"
  },

  warranty_other_erikson_terminal: {
    id: "warranty_other_erikson_terminal",
    type: "terminal",
    section: "Warranty — Other Products",
    terminalType: "direct",
    title: "Direct to Erikson Consumer / inMusic",
    body: "Erikson Consumer (JBL large speakers, soundbars, etc.):\nEmail: info@eriksonconsumer.com\nPhone: 1-877-457-2592 (M–F 8:30am–5:30pm ET)\n\ninMusic Brands (Akai, Alesis, Alto, Denon DJ, Headrush, Marantz, M-Audio, Numark, Rane DJ, Sheeran Looper, Soundswitch):\nEmail: customerexperienceteam@inmusicbrands.com",
    emailTemplate: "Hello,\n\nThank you for reaching out, and we're sorry to hear you're experiencing issues. For warranty-related concerns with this product, please contact the authorized service team directly. They will assist you with the warranty process.\n\nThank you,"
  },

  warranty_other_shipback_terminal: {
    id: "warranty_other_shipback_terminal",
    type: "terminal",
    section: "Warranty — Other Products",
    terminalType: "approve",
    title: "Ship Back to Store — Other Products",
    body: "If troubleshooting unsuccessful and issue appears to be a legitimate manufacturing defect:\nCustomer returns unit with all original accessories. Customer responsible for return shipping.\n\nIf confirmed defective:\n• We cover return shipping within Canada (ground)\n• Replacement issued if in stock\n• Replacement issued only ONCE\n\nIf sold out / discontinued → exchange or store credit (no refunds)\n\n⚠️ If no defect found → claim denied. Customer responsible for return shipping.\n\n⚠️ Replacement Policy: If a product is deemed defective, a replacement will only be issued once. If the customer believes the replacement unit is also defective, they will need to contact the manufacturer for further assistance.",
    emailTemplate: "Hello,\n\nIf you believe the product may be defective, you have two options: you may either ship the item back to our store location or drop it off in person for testing. If our team confirms that the product is indeed defective, we will gladly issue a replacement.\nPlease note that if no defect is found, return shipping costs will not be covered. Processing the warranty claim may take up to seven to ten business days upon arrival.\n\nShip to Address:\nATTN: Singh Electronics Warranty **RMA # (INSERT ORDER NUMBER)**\n7003 Steeles Avenue West, Unit #15\nToronto, Ontario M9W 0A2\n\nThank you,"
  }
};
