function TabSwitch(selector, options = {}) {
    this.container = document.querySelector(selector);

    if (!this.container) {
        console.error(
            `Tabswitch: No container found for selector '${selector}'`
        );
        return;
    }

    this.tabs = Array.from(document.querySelectorAll("li a"));

    if (!this.tabs.length) {
        console.error(`Tabswitch: No tabs found inside the container`);
        return;
    }

    this.panels = this.tabs
        .map((tab) => {
            const panel = document.querySelector(tab.getAttribute("href"));
            if (!panel) {
                console.error(
                    `Tabswitch: No panel foud for selector '${tab.getAttribute(
                        "href"
                    )}'`
                );
            }
            return panel;
        })
        .filter(Boolean);

    if (this.panels.length !== this.tabs.length) return;

    this.opt = Object.assign({
        remember: false,
    }, options);

    this._originalHTML = this.container.innerHTML;

    this._init();
}

Tabswitch.prototype._init = function () {
    const hash = location.hash;
    // if (hash) {
    //     tabToActivate = this.tabs.find(tab => tab.getAttribute('href') === hash) || this.tabs[0];
    // } else {
    //     tabToActivate = this.tabs[0];
    // }

    const tabToActivate =
        (this.opt.remember && hash && this.tabs.find((tab) => tab.getAttribute("href") === hash)) ||
        this.tabs[0];

    this._activateTab(tabToActivate);

    this.tabs.forEach((tab) => {
        tab.onclick = (event) => this._handleTabClick(event, tab);
    });
};

Tabswitch.prototype._handleTabClick = function (event, tab) {
    event.preventDefault();
    this._activateTab(tab);
};

Tabswitch.prototype._activateTab = function (tab) {
    this.tabs.forEach((tab) => {
        tab.closest("li").classList.remove("tabswitch--active");
    });

    tab.closest("li").classList.add("tabswitch--active");

    this.panels.forEach((panel) => (panel.hidden = true));
    const panelActive = document.querySelector(tab.getAttribute("href"));
    panelActive.hidden = false;

    // localStorage.setItem('tabswitch-active', tab.getAttribute('href'));
    if (this.opt.remember) {
        history.replaceState(null, null, tab.getAttribute("href"));
    }
};

Tabswitch.prototype.switch = function (input) {
    let tabToActivate = null;

    if (typeof input === "string") {
        tabToActivate = this.tabs.find(
            (tab) => tab.getAttribute("href") === input
        );
        if (!tabToActivate) {
            console.error(`Tabswitch: No panel found with ID '${input}'`);
            return;
        }
    } else if (this.tabs.includes(input)) {
        tabToActivate = input;
    }

    if (!tabToActivate) {
        console.error(`Tabswitch: Invalid input '${input}'`);
        return;
    }

    this._activateTab(tabToActivate);
};

Tabswitch.prototype.destroy = function () {
    this.container.innerHTML = this._originalHTML;

    this.panels.forEach((panel) => (panel.hidden = false));
    this.container = null;
    this.tabs = null;
    this.panels = null;
};
