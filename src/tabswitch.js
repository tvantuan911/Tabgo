function TabSwitch(selector, options = {}) {
    this.container = document.querySelector(selector);
    if (!this.container) {
        console.error(`TabSwitch: No container found for selector '${selector}'`);
        return;
    }

    this.tabs = Array.from(this.container.querySelectorAll("li a"));
    if (!this.tabs.length) {
        console.error(`TabSwitch: No tabs found inside the container`);
        return;
    }

    this.panels = this.tabs
        .map((tab) => {
            const panel = document.querySelector(tab.getAttribute("href"));
            if (!panel) {
                console.error(
                    `TabSwitch: No panel found for selector '${tab.getAttribute(
                        "href"
                    )}'`
                );
            }
            return panel;
        })
        .filter(Boolean);

    if (this.tabs.length !== this.panels.length) return;

    this.opt = Object.assign(
        {
            remember: false,
        },
        options
    );

    this._originalHTML = this.container.innerHTML;

    this._init();
}

TabSwitch.prototype._init = function () {
    // const hash = location.hash;
    const params = new URLSearchParams(location.search);
    const tabSelector = params.get('tab');
    const tab =
        (this.opt.remember &&
            tabSelector &&
            this.tabs.find((tab) => tab.getAttribute("href") === tabSelector)) ||
        this.tabs[0];

    this._activateTab(tab);

    this.tabs.forEach((tab) => {
        tab.onclick = (event) => this._handleTabClick(event, tab);
    });
};

TabSwitch.prototype._handleTabClick = function (event, tab) {
    event.preventDefault();

    this._activateTab(tab);
};

TabSwitch.prototype._activateTab = function (tab) {
    this.tabs.forEach((tab) => {
        tab.closest("li").classList.remove("tabswitch--active");
    });

    tab.closest("li").classList.add("tabswitch--active");

    this.panels.forEach((panel) => (panel.hidden = true));

    const panelActive = document.querySelector(tab.getAttribute("href"));
    panelActive.hidden = false;

    if (this.opt.remember) {
        // history.replaceState(null, null, tab.getAttribute("href"));
        history.replaceState(null, null, `?tab=${encodeURIComponent(tab.getAttribute('href'))}`);
    }
};

TabSwitch.prototype.switch = function (input) {
    let tabToActivate = null;

    if (typeof input === "string") {
        tabToActivate = this.tabs.find(
            (tab) => tab.getAttribute("href") === input
        );
        if (!tabToActivate) {
            console.error(`TabSwitch: No panel found with ID '${input}'`);
            return;
        }
    } else if (this.tabs.includes(input)) {
        tabToActivate = input;
    }

    if (!tabToActivate) {
        console.error(`TabSwitch: Invalid input '${input}'`);
        return;
    }

    this._activateTab(tabToActivate);
};

TabSwitch.prototype.destroy = function () {
    this.container.innerHTML = this._originalHTML;
    this.panels.forEach((panel) => (panel.hidden = false));
    this.container = null;
    this.tabs = null;
    this.panels = null;
};
