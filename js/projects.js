



//
function addProject(project_dict){

    //
    var div_main = document.createElement("div");
    div_main.classList.add("col", "m_small", "m_b_0", "m_l_auto", "m_r_auto", "p_tiny", "bg_plt_4", "br_small", "min_width_uuul", "max_width_uuul", "min_height_ultra_large", "max_height_ultra_large");

    //
    var div_row_header = document.createElement("div");
    div_main.appendChild(div_row_header);
    div_row_header.classList.add("row", "m_tiny");

    //
    var div_icon = document.createElement("div");
    div_row_header.appendChild(div_icon);
    div_icon.classList.add("m_tiny");

    var icon = document.createElement("img");
    div_icon.appendChild(icon);
    icon.classList.add("size_larger");
    icon.src = project_dict["icon"];

    //
    var div_name = document.createElement("div");
    div_row_header.appendChild(div_name);
    div_name.classList.add("m_tiny", "center_v")
    
    var name = document.createElement("b");
    div_name.appendChild(name);
    name.innerText = project_dict["name"];

    //
    var div_description = document.createElement("div");
    div_main.appendChild(div_description);
    div_description.classList.add("m_tiny", "m_t_0", "m_b_auto", "v_scroll");
    
    var p_description = document.createElement("p");
    div_description.appendChild(p_description);
    p_description.classList.add("font_smaller", "m_b_auto", "m_t_0");
    if(Object.keys(project_dict["description"]).includes(window.current_language)){
        p_description.innerText = project_dict["description"][window.current_language];
    }
    else{
        p_description.innerText = project_dict["description"]["fr"];
    }
    // Add translation
    for(lang of Object.keys(project_dict["description"])){
        p_description.setAttribute("data-translation_"+lang, project_dict["description"][lang]);
    }
    p_description.classList.add("to_translate");

    //
    var div_status = document.createElement("div");
    div_main.appendChild(div_status);
    div_status.classList.add("row", "m_r_0");

    //
    var project_state = project_dict["state"];
    if(data_states[project_state] != undefined){
        //
        var status_icon_div = document.createElement("div");
        div_status.appendChild(status_icon_div);
        status_icon_div.classList.add("m_tiny", "m_r_0");

        var status_icon = document.createElement("div");
        status_icon_div.appendChild(status_icon);
        status_icon.classList.add("size_small", "center_v");
        status_icon.innerHTML = states_icon_svgs[project_state];

        //
        var status_text_div = document.createElement("div");
        div_status.appendChild(status_text_div);
        status_text_div.classList.add("m_tiny", "m_r_auto", "m_t_0", "m_b_auto");

        //
        var status_text = document.createElement("span");
        status_text_div.appendChild(status_text);
        status_text.classList.add("font_smaller", "m_t_0", "m_b_auto", "cl_status_"+project_state);
        if(Object.keys(data_states[project_state]).includes(window.current_language)){
            status_text.innerText = data_states[project_state][window.current_language];
        }
        else{
            status_text.innerText = data_states[project_state]["en"];
        }
        // Add translation
        for(lang of Object.keys(data_states[project_state])){
            status_text.setAttribute("data-translation_"+lang, data_states[project_state][lang]);
        }
        status_text.classList.add("to_translate");

    }

    //
    document.getElementById("projects_list").appendChild(div_main);
}




function displayProjects(){

    if(projects == undefined || typeof(projects) != "object" || !Array.isArray(projects)){
        return;
    }

    for(project_dict of projects){
        addProject(project_dict);
    }

}








