"""
SAP S/4HANA BAPI & RFC Simulation Client Module
Simulates remote enterprise function calls:
  - Vendor Master Data: LFA1 / BAPI_VENDOR_GETDETAIL
  - Purchase Orders:    EKKO/EKPO / BAPI_PO_GETDETAIL (3-Way Matching)
"""

import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("SAP_BAPI_CLIENT")

# Simulated ERP Vendor Master Data (Table LFA1)
SAP_VENDOR_MASTER = {
    "VEN-1001": {
        "vendorName": "Global Tech Services GmbH",
        "accountStatus": "ACTIVE",
        "creditLimit": 500000.00,
        "riskRating": "LOW",
        "country": "DE",
        "iban": "DE89370400440532013000",
        "reconciliationAccount": "160000"
    },
    "VEN-9982": {
        "vendorName": "Acme Logistics Corp",
        "accountStatus": "BLOCKED_FOR_PAYMENT",
        "creditLimit": 50000.00,
        "riskRating": "HIGH",
        "country": "US",
        "iban": "US33CHAS00000012345678",
        "reconciliationAccount": "210000"
    },
    "VEN-7700": {
        "vendorName": "Apex Infrastructure Solutions",
        "accountStatus": "ACTIVE",
        "creditLimit": 150000.00,
        "riskRating": "MEDIUM",
        "country": "US",
        "iban": "US44CITI00000098765432",
        "reconciliationAccount": "180000"
    }
}

# Simulated ERP Purchase Orders (Tables EKKO / EKPO) for 3-Way Matching
SAP_PURCHASE_ORDERS = {
    "PO-1001": {
        "poNumber": "PO-1001",
        "vendorId": "VEN-1001",
        "currency": "USD",
        "poTotal": 4500.50,
        "items": [
            {"itemNo": 10, "description": "Cloud Architecture Review", "quantity": 1, "unitPrice": 4500.50}
        ],
        "goodsReceiptStatus": "CONFIRMED",
        "approvalStatus": "RELEASED"
    },
    "PO-9982": {
        "poNumber": "PO-9982",
        "vendorId": "VEN-9982",
        "currency": "USD",
        "poTotal": 25000.00,
        "items": [
            {"itemNo": 10, "description": "Freight & Warehousing Services", "quantity": 1, "unitPrice": 25000.00}
        ],
        "goodsReceiptStatus": "PENDING_DELIVERY",
        "approvalStatus": "ON_HOLD"
    },
    "PO-7700": {
        "poNumber": "PO-7700",
        "vendorId": "VEN-7700",
        "currency": "USD",
        "poTotal": 2000.00,
        "items": [
            {"itemNo": 10, "description": "Network Switches & Cables", "quantity": 50, "unitPrice": 40.00}
        ],
        "goodsReceiptStatus": "CONFIRMED",
        "approvalStatus": "RELEASED"
    }
}


class SapBapiClient:
    def __init__(self, system_id="S4H_PRD_100"):
        self.system_id = system_id
        logger.info(f"Connected to SAP S/4HANA Instance: {self.system_id}")

    def get_vendor_master_data(self, vendor_id: str) -> dict:
        """Executes simulated BAPI_VENDOR_GETDETAIL lookup."""
        logger.info(f"[🔍 BAPI CALL] BAPI_VENDOR_GETDETAIL executing for Vendor: '{vendor_id}' on system {self.system_id}")
        vendor_data = SAP_VENDOR_MASTER.get(vendor_id)
        if vendor_data:
            return {
                "bapiStatus": "SUCCESS",
                "vendorId": vendor_id,
                **vendor_data
            }
        return {
            "bapiStatus": "NOT_FOUND",
            "vendorId": vendor_id,
            "accountStatus": "UNKNOWN",
            "creditLimit": 0.0,
            "riskRating": "UNKNOWN",
            "reconciliationAccount": "N/A"
        }

    def get_purchase_order(self, po_number: str) -> dict:
        """Executes simulated BAPI_PO_GETDETAIL for 3-Way Matching."""
        logger.info(f"[🔍 BAPI CALL] BAPI_PO_GETDETAIL executing for PO: '{po_number}' on system {self.system_id}")
        po_data = SAP_PURCHASE_ORDERS.get(po_number)
        if po_data:
            return {
                "bapiStatus": "SUCCESS",
                "poNumber": po_number,
                **po_data
            }
        return {
            "bapiStatus": "NOT_FOUND",
            "poNumber": po_number,
            "poTotal": 0.0,
            "items": [],
            "goodsReceiptStatus": "NO_RECORD",
            "approvalStatus": "NOT_FOUND"
        }
