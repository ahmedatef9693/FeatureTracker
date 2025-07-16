


import frappe
import json


class RequestValidation:
    def __init__(self,request_data,doctype):
        self.feature_request_docs = request_data
        self.doctype_name = doctype
        self.is_list()
    def is_list(self):
        if not isinstance(self.feature_request_docs,list):
            raise frappe.ValidationError("Items Should Be Of A List Type!")
    def check_existence(self,name:str):
        if frappe.db.exists("Feature Request",{"name":name}):
            return True
        else:
            return False
    



    




class CreationValidation(RequestValidation):
    def __init__(self, request_data, doctype):
        super().__init__(request_data, doctype)
        self.validate_mandatory_fields()
        self.check_existence_before_creation()
        
    
    def check_existence_before_creation(self):
        for entry in self.feature_request_docs:
            if self.check_existence(entry.get('title')):
                frappe.throw(f"feature request already exist before {entry.get('title')}")
            
    
    def validate_mandatory_fields(self):
        mandatory_fields = self.get_mandatory_fields()
        missing_fields = []
        for field in mandatory_fields:
            for doc in self.feature_request_docs:
                if (field not in doc) or (not doc[field]):
                    missing_fields.append(field)
        if missing_fields:
            missing_fields_str = ", ".join(missing_fields)
            error_msg = f"The mandatory field(s) {missing_fields_str} are missing or empty. Please provide a valid value."
            raise frappe.ValidationError(error_msg)
    
    def get_mandatory_fields(self):
        doctype = frappe.get_meta(self.doctype_name)
        mandatory_fields = [
            field.fieldname for field in doctype.fields if field.reqd
        ]
        return mandatory_fields
    


class DeletionValidation(RequestValidation):
    def __init__(self, request_data, doctype):
        super().__init__(request_data, doctype)
        self.validate_entry_list()
    def validate_entry_list(self):
        for entry in self.feature_request_docs:
            if not isinstance(entry,str):
                raise frappe.ValidationError("Elements Should Be A List Of Names!")
            else:
                if not self.check_existence(name=entry):
                    raise frappe.ValidationError(f"Element {entry} Doesnt Exist In Database!")

    


class UpdateValidation(RequestValidation):
    def __init__(self, request_data, doctype):
        super().__init__(request_data, doctype)
    def validate_names_to_update(self):
        new_feature_request_docs = []
        if len(self.feature_request_docs) > 0:
            for entry in self.feature_request_docs:
                if "name" in entry:
                    self.check_existence(entry.get('name'))
                    new_feature_request_docs.append(entry)
                else:
                    continue
        return new_feature_request_docs



