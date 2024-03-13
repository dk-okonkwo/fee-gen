from config import db


class WPMFee(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    tenants_rents = db.Column(
        db.String(80), nullable=False, default='tenantRents.xlsx')
    Leasing_and_retention = db.Column(
        db.String(80), nullable=False, default='LARS.xlsx')
    trans_schedule = db.Column(db.String(80), nullable=False,
                            default='transfeesch.xlsx')
    leasing_fee = db.Column(db.String(80), nullable=True)
    retention_fee = db.Column(db.String(80), nullable=True)
    trans_fee = db.Column(db.String(80), nullable=True)
    
    def to_json(self):
        data = {
            "id": self.id,
            "tenantsRents": self.tenants_rents,
            "LARS": self.Leasing_and_retention,
            "transSchedule": self.trans_schedule,
        }
        if self.leasing_fee is not None:
            data["leasingFee"] = self.leasing_fee
        if self.retention_fee is not None:
            data["retentionFee"] = self.retention_fee
        if self.trans_fee is not None:
            data["transFee"] = self.trans_fee

        return data

