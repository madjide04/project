function selected(link) {
    // Remove active class from all links
    const links = document.querySelectorAll('.nav-link');
    links.forEach(function(link) {
        link.classList.remove('active');
    });

    // Add active class to the clicked link
    link.classList.add('active');
}

function toggleModes(link) {
    // Your toggleModes function logic here
    // For example, if you want to toggle a class on click
    link.classList.toggle('active');
}
