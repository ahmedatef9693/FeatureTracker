class FeatureRequestValidation {
    constructor(cur_dialog) {
        this.cur_dialog = cur_dialog;
    }
    validate_dialog_data() {
        let fields = this.cur_dialog.fields_dict.feature_requests.df.fields
            .filter((field) => field.reqd)
            .map(field => field.fieldname);
        this.grid_data = this.cur_dialog.fields_dict.feature_requests.grid.data;
        if (this.grid_data.length > 0) {
            fields.forEach(field => {
                this.grid_data.forEach(element => {
                    if (!element[field]) {
                        frappe.throw(`Please Set Mandatory Field <b>${field}</b> for idx ${element.idx}`)
                    }
                });
            });
        } else {
            frappe.throw("No Data Entered!")
        }

    }

}