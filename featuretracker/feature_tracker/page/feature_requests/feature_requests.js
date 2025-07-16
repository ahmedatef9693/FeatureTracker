frappe.require('/assets/featuretracker/js/FeatureRequestAction.js')
frappe.require('/assets/featuretracker/js/constants.js')

frappe.pages['feature-requests'].on_page_load = function(wrapper) {
    new MyPage(wrapper);
}


MyPage = Class.extend({
    init: function(wrapper) {
        this.page = frappe.ui.make_app_page({
            parent: wrapper,
            title: 'Feature Requests',
            single_column: false
        })
        this.page.set_primary_action("＋ Feature Request", future_request_handler);
        this.page.add_inner_button('<i class="fa fa-refresh"></i>', () => {
            this.render_data();
        });
        this.page.add_inner_button('＋ Bulk Feature Request', feature_request_bulk_handler);
        this.render_data();
    },
    render_data: function() {
        this.sync_time = frappe.datetime.now_datetime();
        this.get_feature_requests();
        this.update_sync_field();
    },
    update_sync_field: function() {
        let me = this;
        const updateLabel = function() {
            if (me.sync_time) {
                let pretty = frappe.datetime.prettyDate(me.sync_time);
                $('.last-synced').text("Last Synced: " + pretty);
            }
        };
        updateLabel();
        if (me.sync_interval) clearInterval(me.sync_interval);
        me.sync_interval = setInterval(updateLabel, 1000);
    },
    get_feature_requests: function() {
        let me = this;
        frappe.call({
            method: 'frappe.client.get_list',
            args: {
                doctype: 'Feature Request',
                fields: ['name', 'title', 'status', 'priority'],
                limit_page_length: 1000
            },
            callback: function(response) {
                let planned = response.message.filter(item => item.status === 'Open');
                let in_progress = response.message.filter(item => item.status === 'In Progress');
                let completed = response.message.filter(item => item.status === 'Closed');
                let html = this.get_html_code(planned, in_progress, completed);
                if (me.page && me.page.main) {
                    me.page.main.empty();
                    $(html).appendTo(me.page.main);
                    this.sort_items(planned, in_progress, completed);
                } else {
                    console.log("error");
                }
            },
            sort_items: function(planned, in_progress, completed) {
                let sort_btn_objects = {
                    "planned": [$('.btn-planned-sort'), planned, false],
                    "in_progress": [$('.btn-in_progress-sort'), in_progress, false],
                    "completed": [$('.btn-completed-sort'), completed, false]
                }
                for (let key in sort_btn_objects) {
                    if (sort_btn_objects.hasOwnProperty(key)) {
                        $(`.${key}`).off('click').on('click', `.btn-${key}-sort`, () => {

                            if (!sort_btn_objects[key][2]) {
                                sort_btn_objects[key][1].sort((a, b) => {
                                    return priorityOrder[a.priority] - priorityOrder[b.priority];
                                });
                                let newHtml = `
                                <div style="display:flex; justify-content:space-between">
                                    <h3>${key} ${sort_btn_objects[key][1].length}</h3>
                                    ${get_sort_button(String(key))}
                                </div>
                                    ${get_feature_cards(sort_btn_objects[key][1])}`;
                                $(`.${key}`).html(newHtml);
                                sort_btn_objects[key][2] = true;
                            } else {
                                sort_btn_objects[key][1].sort((a, b) => {
                                    return priorityOrder[b.priority] - priorityOrder[a.priority];
                                });
                                let newHtml = `
                                <div style="display:flex; justify-content:space-between">
                                    <h3>${key} ${sort_btn_objects[key][1].length}</h3>
                                    ${get_sort_button(String(key))}
                                </div>
                                    ${get_feature_cards(sort_btn_objects[key][1])}`;
                                $(`.${key}`).html(newHtml);
                                sort_btn_objects[key][2] = false;

                            }
                        })

                    }

                }
            },
            get_html_code: function(planned, in_progress, completed) {
                return `
                ${get_styles()}
                <h3 class="roadmap-board">Roadmap</h3>
                <span class="last-synced text-muted" style="margin-left: 10px;"></span>
                <div class="roadmap-board">
                ${get_roadmap_columns(planned,in_progress,completed)}    

                </div>
            `;
            },

        });
    }

})


function get_feature_cards(items) {
    let html = '';
    for (let item of items) {
        html += `
        <a href="feature-request/${item.name}" class="feature-card" style="display:block; text-decoration:none;">
            <small>△ ${item.priority || ''}</small>
            <div>${item.title || ''}</div>
        </a>
        `;
    }
    return html;
}


function get_sort_button(type) {
    return `<button class="btn-${type}-sort" style="border:none">🔼 Deadline</button>`
}

function get_roadmap_columns(planned, in_progress, completed) {
    let columnlookup = {
        "planned": planned,
        "in_progress": in_progress,
        "completed": completed
    }
    let html = ''
    for (const key in columnlookup) {
        if (columnlookup.hasOwnProperty(key)) {
            html += `
            <div class="roadmap-column ${key}">
                <div style="display:flex; justify-content:space-between">
                    <h3>${String(key)} ${columnlookup[key].length}</h3>
                    ${get_sort_button(String(key))}
                </div>
                ${get_feature_cards(columnlookup[key])}
            </div>`
        }
    }
    return html;
    // return `                    


    //     <div class="roadmap-column in_progress">
    //         <div style="display:flex; justify-content:space-between">
    //             <h3>in_progress ${in_progress.length}</h3>
    //             ${get_sort_button('in_progress')}
    //         </div>
    //         ${get_feature_cards(in_progress)}
    //     </div>

    //     <div class="roadmap-column completed">
    //         <div style="display:flex; justify-content:space-between">
    //             <h3>completed ${completed.length}</h3>
    //             ${get_sort_button('completed')}
    //         </div>
    //         ${get_feature_cards(completed)}
    //     </div>`

}



function get_styles() {
    return `<style>
                    .roadmap-board {
                        display: flex;
                        gap: 20px;
                        padding: 10px;
                        margin-bottom:-5px
                    }
                    .roadmap-column {
                        background-color:rgb(250, 250, 250);
                        border-radius: 8px;
                        flex: 1;
                        padding: 15px;
                        color: black;
                        max-height: 500px;
                        overflow-y: auto;
                        box-shadow: 0 0 6px rgba(0,0,0,0.1);
                    }
                    .roadmap-column h3 {
                        font-size: 1.2rem;
                        margin-bottom: 10px;
                        padding-bottom: 5px;
                        
                    }
                    .feature-card {
                        background-color: white;
                        padding: 10px;
                        border-radius: 6px;
                        margin-bottom: 10px;
                        border: 1px solid #ccc;
                    }
                    .feature-card small {
                        font-size: 0.8rem;
                        color: gray;
                    }
                </style>`
}


function feature_request_bulk_handler(feature_request_data) {
    let feature_request_action = new FeatureRequestAction(feature_request_data);
    feature_request_action.launch_feature_request_form();
}

function future_request_handler() {
    frappe.new_doc("Feature Request");

}