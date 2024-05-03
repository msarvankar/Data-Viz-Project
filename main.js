(function() {
    // The tab showing function
    function showTab(tabName) {
        var i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName("content");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }
        var activeTab = document.getElementById(tabName);
        if (activeTab) {
            if(tabName == "home"){
                activeTab.style.display = "flex";
            }else{
                activeTab.style.display = "block";
            }
        }

        // Remove active class from all tabs and add to the current tab clicked
        tablinks = document.getElementsByClassName("tab");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].classList.remove("active");
        }
        document.getElementsByName(tabName)[0].classList.add("active");

        // Check if 'compare' tab is active and if dropdowns need to be initialized
        if (tabName === 'compare') {
            // Assuming loadDataAndCreateViz is a function defined in compare.js
            if (window.loadDataAndCreateViz) {
                window.loadDataAndCreateViz();
            }
        }

        if (tabName === 'insights') {
            if (window.showDataInsights) {
                window.showDataInsights();
            }
        }
    }

    // Attaching the showTab function to window object to make it accessible from HTML
    window.showTab = showTab;

    // Show the home tab by default
    showTab('home');
})();