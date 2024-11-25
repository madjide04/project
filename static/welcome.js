function toggleModes() {
    var modesMenu = document.getElementById("modesMenu");
    modesMenu.style.display = (modesMenu.style.display == "none") ? "block" : "none";
}

function selectOption(option) {
    // Set the selected value
    document.getElementById("selectedValue").value = option;
    // Submit the form
    document.getElementById("gameForm").submit();
}
