frappe.require('/assets/featuretracker/js/FeatureRequestValidation.js')
class FeatureRequestAction {
    constructor(feature_request_data) {
        this.feature_request_data = feature_request_data;
    }
    launch_feature_request_form() {
        this.dialog = new frappe.ui.Dialog({
            title: __("Add New Feature Requests"),
            fields: [{
                label: __("Feature Requests"),
                fieldname: "feature_requests",
                fieldtype: "Table",
                fields: [{
                        label: __("Title"),
                        fieldname: "title",
                        fieldtype: "Text",
                        in_list_view: 1,
                        reqd: 1
                    },
                    {
                        label: __("Description"),
                        fieldname: "description",
                        fieldtype: "Long Text",
                        in_list_view: 1,
                        reqd: 1
                    },
                    {
                        label: __("Priority"),
                        fieldname: "priority",
                        fieldtype: "Select",
                        options: ["High", "Medium", "Low"],
                        in_list_view: 1,
                        reqd: 1
                    },
                    {
                        label: __("Status"),
                        fieldname: "status",
                        fieldtype: "Select",
                        options: ["Open", "In Progress", "Closed"],
                        in_list_view: 1,
                        reqd: 1
                    }
                ]
            }],
            primary_action_label: __("Create Feature Requests"),
            primary_action: () => {
                let validation = new FeatureRequestValidation(cur_dialog);
                validation.validate_dialog_data();
                this.grid_items = this.dialog.fields_dict.feature_requests.grid.data
                this.dialog.hide();
                this.add_feature_request();
            }
        });

        this.dialog.show();
    }
    add_feature_request() {
        if (this.grid_items && this.grid_items.length) {
            frappe.call({
                method: 'featuretracker.api.feature_request.add_feature_requests',
                args: {
                    feature_request_docs: this.grid_items
                },
                btn: $('.primary-action'),
                freeze: true,
                callback: (r) => {},
                error: (r) => {

                }
            })
        } else {

        }
    }




}