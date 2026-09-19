"""
SAP S/4HANA BAPI & RFC Simulation Client Module
Simulates remote enterprise function calls to S/4HANA Master Data tables (LFA1 / BAPI_VENDOR_GETDETAIL).
"""

import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("SAP_BAPI_CLIENT")

# Simulated ERP Master Data Database
SAP_MASTER_DATA = {
    "VEN-9982": {
        "vendorName": "Acme Logistics Corp",
        "accountStatus": "BLOCKED_FOR_PAYMENT",
        "creditLimit": 50000.00,
        "riskRating": "HIGH",
        "country": "US",
        "reconciliationAccount": "210000"
    },
    "VEN-1001": {
        "vendorName": "Global Tech Services",
        "accountStatus": "ACTIVE",
        "creditLimit": 500000.00,
        "riskRating": "LOW",
        "country": "DE",
        "reconciliationAccount": "160000"
    }
}

class SapBapiClient:
    def __init__(self, system_id="S4H_PRD_100"):
        self.system_id = system_id
        logger.info(f"Connected to SAP S/4HANA Instance: {self.system_id}")

    def get_vendor_master_data(self, vendor_id: str) -> dict:
        """
        Executes simulated BAPI_VENDOR_GETDETAIL lookup.
        """
        logger.info(f"[🔍 BAPI CALL] BAPI_VENDOR_GETDETAIL executing for Vendor: '{vendor_id}' on system {self.system_id}")
        
        vendor_data = SAP_MASTER_DATA.get(vendor_id)
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