type AppWindow = Window & { globalCode?: string };
type ValueControl = HTMLElement & { value: string; required?: boolean };
type CheckedControl = HTMLElement & { checked: boolean };

function getInput(id: string): HTMLInputElement | null {
    const element = document.getElementById(id);
    return element instanceof HTMLInputElement ? element : null;
}

function getValueControl(id: string): ValueControl | null {
    const element = document.getElementById(id);
    if (!element || !("value" in element)) {
        return null;
    }
    return element as ValueControl;
}

function getCheckedControl(id: string): CheckedControl | null {
    const element = document.getElementById(id);
    if (!element || !("checked" in element)) {
        return null;
    }
    return element as CheckedControl;
}

function setControlRequired(control: ValueControl, required: boolean): void {
    if (typeof control.required === "boolean") {
        control.required = required;
        return;
    }

    if (required) {
        control.setAttribute("required", "");
    } else {
        control.removeAttribute("required");
    }
}

function isControlRequired(control: ValueControl): boolean {
    if (typeof control.required === "boolean") {
        return control.required;
    }
    return control.hasAttribute("required");
}

function getElement(id: string): HTMLElement | null {
    const element = document.getElementById(id);
    return element instanceof HTMLElement ? element : null;
}

function shareURL() {
    const sharedURLInput = getValueControl("sharedURL");
    const authTokenInput = getValueControl("URLAuthToken");
    const authNeededInput = getCheckedControl("URLAuthNeeded");
    const onetimeURLInput = getCheckedControl("onetimeURL");
    const expirationInput = getValueControl("URLExpiration");
    const resultEle = getElement("URLResult");

    if (
        !sharedURLInput ||
        !authTokenInput ||
        !authNeededInput ||
        !onetimeURLInput ||
        !expirationInput ||
        !resultEle
    ) {
        return;
    }

    const sharedURL = sharedURLInput.value;
    if (!sharedURL) {
        setControlRequired(sharedURLInput, true);
        return;
    }

    if (isControlRequired(sharedURLInput)) {
        setControlRequired(sharedURLInput, false);
    }

    const authToken = authTokenInput.value;
    const authNeeded = authNeededInput.checked;

    if (!authToken && authNeeded) {
        setControlRequired(authTokenInput, true);
        return;
    }

    if (isControlRequired(authTokenInput) && authNeeded) {
        setControlRequired(authTokenInput, false);
    }

    const onetimeURL = onetimeURLInput.checked;

    const formData = new FormData();
    if (sharedURL && !onetimeURL) {
        formData.append("url", sharedURL);
    } else if (sharedURL && onetimeURL) {
        formData.append("oneshot_url", sharedURL);
    }

    const headers: Record<string, string> = {
        Authorization: authToken,
    };
    const expiration = expirationInput.value;
    if (expiration) {
        headers.expire = expiration;
    }

    fetch("/", {
        method: "POST",
        headers,
        body: formData,
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            resultEle.innerHTML = "uploaded successfully.";
            return response.text();
        })
        .then((data) => {
            resultEle.innerHTML = data;
        })
        .catch((error) => {
            resultEle.innerHTML = "error shortening the url: " + error;
            console.error("There was an error shortening the url: ", error);
        });
}

function shareFileWithAuth() {
    const fileInput = getInput("file");
    const filetypeInput = document.querySelector("#filetype");
    const authTokenInput = getValueControl("authToken");
    const authNeededInput = getCheckedControl("authNeeded");
    const onetimeInput = getCheckedControl("onetime");
    const expirationInput = getValueControl("expiration");
    const resultEle = getElement("result");

    if (
        !fileInput ||
        !(filetypeInput instanceof HTMLInputElement || filetypeInput instanceof HTMLSelectElement) ||
        !authTokenInput ||
        !authNeededInput ||
        !onetimeInput ||
        !expirationInput ||
        !resultEle
    ) {
        return;
    }

    const file = fileInput.files?.[0];
    const rawCode = (window as AppWindow).globalCode ?? "";
    const format = filetypeInput.value;
    const bFile = rawCode
        ? new File([new Blob([rawCode], { type: "text/plain" })], `file${format}`, { type: "text/plain" })
        : null;

    if (!file && !rawCode) {
        alert("Please select a file or paste something");
        return;
    }

    const authToken = authTokenInput.value;
    const authNeeded = authNeededInput.checked;

    if (!authToken && authNeeded) {
        setControlRequired(authTokenInput, true);
        return;
    }

    if (isControlRequired(authTokenInput) && authNeeded) {
        setControlRequired(authTokenInput, false);
    }

    const formData = new FormData();
    const onetime = onetimeInput.checked;
    if (file && !onetime) {
        formData.append("file", file);
    } else if (bFile && !onetime) {
        formData.append("file", bFile);
    } else if (file && onetime) {
        formData.append("oneshot", file);
    } else if (bFile && onetime) {
        formData.append("oneshot", bFile);
    }

    const headers: Record<string, string> = {
        Authorization: authToken,
    };
    const expiration = expirationInput.value;
    if (expiration) {
        headers.expire = expiration;
    }

    fetch("/", {
        method: "POST",
        headers,
        body: formData,
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            resultEle.innerHTML = "uploaded successfully.";
            return response.text();
        })
        .then((data) => {
            resultEle.innerHTML = data;
        })
        .catch((error) => {
            resultEle.innerHTML = "error uploading the file:" + error;
            console.error("There was an error uploading the file:", error);
        });
}

const URLForm = document.getElementById("shareURLForm");
if (URLForm instanceof HTMLFormElement) {
    URLForm.addEventListener("submit", (event) => {
        event.preventDefault();
        shareURL();
    });
}

const fileForm = document.getElementById("shareFileForm");
if (fileForm instanceof HTMLFormElement) {
    fileForm.addEventListener("submit", (event) => {
        event.preventDefault();
        shareFileWithAuth();
    });
}


