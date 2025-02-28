function TabSwitch(selector) {
    this.container = document.querySelector(selector);

    if(!this.container) {
        console.error(`Tabswitch: No container found for selector '${selector}'`);
        return;
    }

    this.tabs = Array.from(document.querySelectorAll("li a"));

    if (!this.tabs.length) {
        console.error(`Tabswitch: No tabs found inside the container`);
        return;
    }

    this.panels = this.tabs.map(tab => {
        const panel = document.querySelector(tab.getAttribute("href"));
        if (!panel) {
            console.error(`Tabswitch: No panel foud for selector '${tab.getAttribute("href")}'`);
        }
        return panel;
    }).filter(Boolean);

    if (this.panels.length !== this.tabs.length) return;

    this._init();
}

Tabswitch.prototype._init = function() {
    const tabActive = this.tabs[0];
    tabActive.closest('li').classList.add('tabswitch--active');

    this.panels.forEach(panel => panel.hidden = true);

    this.tabs.forEach(tab => {
        tab.onclick = (event) => this._handleTabClick(event, tab);
    })
    
    const panelActive = this.panels[0];
    panelActive.hidden = false;
}


Tabswitch.prototype._handleTabClick = function(event) {
    event.preventDefault();
    this.tabs.forEach(tab => {
        tab.closest('li').classList.remove('tabswitch--active');
    });

    tab.closest('li').classList.add('tabswitch--active');

    this.panels.forEach(panel => (panel.hidden = true));
    const panelActive = document.querySelector(tab.getAttribute("href"));
    panelActive.hidden = false;
}


