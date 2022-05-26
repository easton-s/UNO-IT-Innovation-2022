const XLSX = require('xlsx');
const fs = require('fs');
const workbook = XLSX.readFile('official_data.xlsx');
const sheet_name_list = workbook.SheetNames;

const SHEET = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

const formatted_data = {};

const OVERALL_KEYS = ["Total Employed", "Average Income", "Veterans", "Disability"];
const EDUCATION_KEYS = ["High School Diploma", "Bachelors", "Associate", "Diploma", "Certificate", "Masters", "Doctorate", "License"];
//const INCOME_KEYS = ["Poverty Line to 30,000", "30,000 to 90,000", "90,000 to 400,000", "400,000 to Max"];
const CLASS_KEYS = ["Poverty Line/Poor", "Middle Class", "Upper Class", "Top 1%"];
const SKIP_KEYS = ["Percentage of Poverty Line/Poor", "Percentage of Middle Class", "Percentage of Upper Class", "Percentage of Top 1%", "Below Poverty Line Out of All Elgible", "Current Population Below Poverty Line", "Total 16 years and over", "Weight of Poverty Line/Poor", "Weight of Middle Class", "Weight of Upper Class", "Weight of Top 1%", "Total", "Poverty Line to 30,000", "30,000 to 90,000", "90,000 to 400,000", "400,000 to Max"];

// iterate each row in sheet array
for(const row of SHEET){
    //set row constants
    let data_name = (row['__EMPTY'] || '').trim();
    if(!data_name || data_name == '') continue;
    let data_type = row['__EMPTY_1'];
    let data_section_specific = row['__EMPTY_2'] == 'Total' ? false : true;
    // iterate over keys in row object
    for(const data_category in row){
        // skip constants
        if(data_category.includes('__EMPTY') || !data_category || SKIP_KEYS.includes(data_name)) continue;
        if(!formatted_data[data_category]){
            formatted_data[data_category] = {
                'overall': {},
                'Education': {},
                //'Income': {},
                'Class': {}
            };
        }
        if(OVERALL_KEYS.includes(data_name)){
            formatted_data[data_category]['overall'][data_name] = {
                type: data_type,
                section_specific: data_section_specific,
                value: row[data_category]
            };
        }
        else if(EDUCATION_KEYS.includes(data_name)){
            formatted_data[data_category]['Education'][data_name] = {
                type: data_type,
                section_specific: data_section_specific,
                value: row[data_category]
            };
        }/*
        else if(INCOME_KEYS.includes(data_name)){
            formatted_data[data_category]['Income'][data_name] = {
                type: data_type,
                section_specific: data_section_specific,
                value: row[data_category]
            };
        }*/
        else if(CLASS_KEYS.includes(data_name)){
            formatted_data[data_category]['Class'][data_name] = {
                type: data_type,
                section_specific: data_section_specific,
                value: row[data_category]
            };
        }
        else{ // keys are able to be dynamically split into special categories
            if(data_name.includes(' in ')){
                let parent_category = data_name.split(' in ')[0].trim();
                if(['Males', 'Females'].includes(parent_category)){
                    parent_category = parent_category.split('s')[0];
                }
                let child_category = data_name.split(' in ')[1].trim();
                if(!formatted_data[data_category][parent_category]) formatted_data[data_category][parent_category] = {};
                formatted_data[data_category][parent_category][child_category] = {
                    type: data_type,
                    section_specific: data_section_specific,
                    value: row[data_category]
                };
            } else{
                if(!formatted_data[data_category][data_name]) formatted_data[data_category][data_name] = {};
                formatted_data[data_category][data_name]['Population'] = {
                    type: data_type,
                    section_specific: data_section_specific,
                    value: row[data_category]
                };
            }
        }
    }
}

// write JSON string to a file
fs.writeFile('official_data.json', JSON.stringify(formatted_data), (err) => {
    if (err) {
        throw err;
    }
    console.log("JSON data is saved.");
});    