from featuretracker.api.Validations.feature_request_validation import CreationValidation,DeletionValidation,UpdateValidation,RequestValidation
import frappe
import json
@frappe.whitelist()
def add_feature_requests(feature_request_docs):
    try:
        feature_request_docs = json.loads(feature_request_docs)
        validation = CreationValidation(feature_request_docs,"Feature Request")
        create_feature_requests(feature_request_docs)
    except frappe.ValidationError as ve:
        frappe.local.response['message'] = str(ve)
        frappe.local.response.http_status_code = 422
        frappe.throw(f"Feature Request Validation Failed With {str(ve)}")
    except Exception as e:
        frappe.log_error(f'{str(e)}')
        frappe.local.response['message'] = str(e)
        frappe.local.response.http_status_code = 400
        frappe.throw(f"Feature Request Exception {str(e)}")


def create_feature_requests(feature_request_docs):
    for feature_request in feature_request_docs:
        try:
            frappe.get_doc({
                "doctype":"Feature Request",
                "name" : feature_request.get('title'),
                "title" : feature_request.get('title'),
                "description":feature_request.get('description'),
                "priority" : feature_request.get('priority'),
                "status": feature_request.get('status')
            }).insert(ignore_permissions=True)
        except Exception as e:
            frappe.log_error(f'{str(e)}')
            frappe.throw(f"Feature Request Exception {str(e)}")
    frappe.db.commit()
    frappe.msgprint("Data Inserted Successfully!")




@frappe.whitelist()
def delete_feature_requests(feature_request_docs):
    try:
        feature_request_docs = json.loads(feature_request_docs)
        validation = DeletionValidation(feature_request_docs,"Feature Request")
        existing_docs = frappe.get_list("Feature Request", filters={"name": ["in", feature_request_docs]}, pluck="name")
        for doc_name in existing_docs:
            frappe.delete_doc("Feature Request", doc_name)
        frappe.local.response['message'] = "Data Deleted Successfully!"
        frappe.msgprint("Data Deleted Successfully!")
    except frappe.ValidationError as ve:
        frappe.local.response['message'] = str(ve)
        frappe.local.response.http_status_code = 422
        frappe.throw(f"Feature Request Validation Failed With {str(ve)}")
    except Exception as e:
        frappe.log_error(f'{str(e)}')
        frappe.local.response['message'] = str(e)
        frappe.local.response.http_status_code = 400
        frappe.throw(f"Feature Request Exception {str(e)}")
    frappe.db.commit()
    




@frappe.whitelist()
def update_feature_requests(feature_request_docs):
    try:
        feature_request_docs = json.loads(feature_request_docs)
        validation = UpdateValidation(feature_request_docs,"Feature Request")
        new_feature_request_docs = validation.validate_names_to_update()
        for feature in new_feature_request_docs:
            request_doc = frappe.get_doc("Feature Request", feature.get('name'))
            request_doc.title = feature.get('title',request_doc.title)
            request_doc.description = feature.get('description',request_doc.description)
            request_doc.priority = feature.get('priority',request_doc.priority)
            request_doc.status = feature.get('status',request_doc.status)
            request_doc.save()
        frappe.local.response['message'] = "Data Updated Successfully!"
        frappe.msgprint("Data Updated Successfully!")
    except frappe.ValidationError as ve:
        frappe.local.response['message'] = str(ve)
        frappe.local.response.http_status_code = 422
        frappe.throw(f"Feature Request Validation Failed With {str(ve)}")
    except Exception as e:
        frappe.log_error(f'{str(e)}')
        frappe.local.response['message'] = str(e)
        frappe.local.response.http_status_code = 400
        frappe.throw(f"Feature Request Exception {str(e)}")
    frappe.db.commit()
    








