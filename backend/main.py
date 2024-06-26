from flask import request, jsonify, send_from_directory, send_file
from config import app, db
from models import WPMFee
import os
from leasingFee import get_leasing_fee
from retentionFee import get_renewal_fee
from transactionFee import get_transfee
from getRents import get_tenants_rents

app.config['UPLOAD_FOLDER'] = 'sheets'
download_fee = 0


def toJson(object):
    data = {
        "id": object.id,
        "tenantsRents": object.tenants_rents,
        "LARS": object.Leasing_and_retention,
        "transSchedule": object.trans_schedule,
    }
    if object.leasing_fee is not None:
        data["leasingFee"] = object.leasing_fee
    if object.retention_fee is not None:
        data["retentionFee"] = object.retention_fee
    if object.trans_fee is not None:
        data["transFee"] = object.trans_fee

    return data


def save_file(excel_sheet):
    file_path = os.path.join(app.root_path, 'static',
                             'sheets', excel_sheet.filename)
    excel_sheet.save(file_path)

    return file_path


@app.route("/", methods=["GET"])
@app.route("/home", methods=["GET"])
def get_main_fees():
    default_fees = WPMFee.query.first()
    json_default_fees = toJson(default_fees)
    return jsonify({"defaultFees": json_default_fees})


@app.route("/update/<string:type>", methods=["PATCH"])
def update(type):
    types = ["rent", "LARS", "trans"]
    try:
        if "file" not in request.files:
            return jsonify({"message": f"No file part.{request.files}"}), 400

        file = request.files['file']
        if file.filename == '':
            return jsonify({"message": "No selected file."}), 400

        default_fees = WPMFee.query.first()

        if type == "rent":
            tenantsRents_file = get_tenants_rents(file)
            default_fees.tenants_rents = tenantsRents_file
            db.session.commit()
        if type == "LARS":
            lars_file = file.filename
            default_fees.Leasing_and_retention = lars_file
            file.save(f'sheets/{lars_file}')
            db.session.commit()
        if type == "trans":
            trans_file = file.filename
            default_fees.trans_schedule = trans_file
            file.save(f'sheets/{trans_file}')
            db.session.commit()
        if type not in types:
            return jsonify({"message": "Wrong response"}), 400
        return jsonify({"message": "Schedule updated."}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Not sure how we got here: {str(e)}"}), 500


@app.route("/runfees/<string:type>/<string:group>", methods=['PATCH'])
def run_fee(type, group):
    try:
        if "file" not in request.files:
            return jsonify({"message": f"No file part.{request.files}"}), 400

        default_fees = WPMFee.query.first()
        lars = f'sheets/{default_fees.Leasing_and_retention}'
        tenants_rents = f'sheets/{default_fees.tenants_rents}'
        trans_schedule = f'sheets/{default_fees.trans_schedule}'

        file = request.files['file']
        if file.filename == '':
            return jsonify({"message": "No selected file."}), 400

        if type == "leasing":
            new_leasing_file = get_leasing_fee(
                group, tenants_rents, lars, file)
            default_fees.leasing_fee = new_leasing_file
            db.session.commit()
            download_fee = 1
            return jsonify({"message": f"click the blue button to download {download_fee}"}), 200
        elif type == "retention":
            new_retention_file = get_renewal_fee(group, lars, file)
            default_fees.retention_fee = new_retention_file
            db.session.commit()
            download_fee = 2
            return jsonify({"message": f"click the blue button to download {download_fee}"}), 200
        else:
            new_transaction_file = get_transfee(group, trans_schedule, file)
            default_fees.trans_fee = new_transaction_file
            db.session.commit()
            download_fee = 3
            return jsonify({"message": f"click the blue button to download {download_fee}"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Error: {str(e)}"}), 500


@app.route("/downloads/<int:num>", methods=['GET'])
def downloads(num):
    default_fees = WPMFee.query.first()
    lease = default_fees.leasing_fee
    trans = default_fees.trans_fee
    ret = default_fees.retention_fee
    if num == 1:
        file_path = f'sheets/{lease}'
    elif num == 2:
        file_path = f'sheets/{ret}'
    elif num == 3:
        file_path = f'sheets/{trans}'
    else:
        return jsonify({"message": "No file to download"}), 401
    return send_file(file_path, as_attachment=True, mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'), 200


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
        # Check if main_fees already exists
        existing_main_fees = WPMFee.query.first()
        if existing_main_fees is None:
            # If main_fees does not exist, add it
            main_fees = WPMFee()
            db.session.add(main_fees)
            db.session.commit()
    app.run()
